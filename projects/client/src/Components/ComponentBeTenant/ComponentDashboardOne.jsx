import React, { useState, useEffect, useRef } from 'react'
import {
    Box, Heading, Grid, Flex, Image,
    Text, Icon, TableContainer,
    Td, Tr, Thead, Tbody, Th, Table, TableCaption, Tfoot,
    CircularProgress, Tooltip, Input, Button, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
    ModalFooter, Popover, PopoverTrigger, Portal, PopoverArrow, PopoverContent,
    PopoverFooter, PopoverHeader, PopoverBody, PopoverCloseButton, Center,
    FormControl, FormLabel, FormHelperText, Spinner, Card, CardBody,
    Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent,
    DrawerCloseButton, useBreakpointValue, useToast, Textarea
} from "@chakra-ui/react"

import { AiOutlineEdit } from "react-icons/ai"
import axios from '../../api/axios';
import BingMapsReact from "bingmaps-react";
import { DataFasility } from '../../Data/DataFasility';
import { useDispatch } from "react-redux"
import { getName } from '../../Redux/PropertySlice';
import "../../Styles/inputFile.css"

const DashboardOne = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState()
    const [load, setLoad] = useState(false)
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const iconRef = useRef()

    //everything for editing picture
    const [picture, setPicture] = useState(null)
    const [msgPicture, setMsgPicture] = useState("")
    const [hover, setHover] = useState(false)
    const [isOpenPopover, setIsOpenPopover] = useState(false)

    //everything for editing name Property
    const [nameProperty, setNameProperty] = useState("")
    const [msgName, setMsgName] = useState("")
    const isErrorNameProperty = nameProperty === ''

    //everything for facility
    const [clickedItem, setClickedItem] = useState([])
    const [msgNameFacility, setMsgNameFacility] = useState("")

    //everything for desc
    const [valueDesc, setValueDesc] = useState()
    const [msgNameDesc, setMsgNameDesc] = useState("")
    const [desc, setDesc] = useState("")
    const isErrorDescProperty = desc === ''
    const [openPopoverDesc, setOpenPopoverDesc] = useState(false)

    //evertthing for location detail
    const [province, setProvince] = useState("")
    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")
    const [msgErrorLocation, setMsgErrorLocation] = useState("")
    const [modalOpen, setModalOpen] = useState(false)

    const isErrorCountry = country === ""
    const isErrorProvince = province === ""
    const isErrorCity = city === ""

    //toastify
    const toast = useToast()


    const getDataForDashboard = async () => {
        try {
            const response = await axios.get(`/property/1`, {
                withCredentials: true
            })
            setData(response.data)
            dispatch(getName(response.data.name))
            setValueDesc(response.data.description)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getDataForDashboard()
    }, [])


    const editPicture = async (e) => {
        e.preventDefault()
        try {
            if (!picture) {
                setMsgPicture("Picture is Required")
            }
            const formData = new FormData()
            formData.append('file', picture)
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            await axios.patch("http://localhost:2000/api/editpicture/1", formData, config)
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                getDataForDashboard()
                onClose(true)
                toast({
                    title: 'Success',
                    description: 'Picture has been updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }, 3000)
        } catch (err) {
            console.log(err)
            if (err.response) {
                setMsgPicture(err.response.data)
            }
        }
    }

    const handleItemClick = (item) => {
        if (clickedItem.includes(item)) {
            setClickedItem(clickedItem.filter((i) => i !== item));
        } else {
            setClickedItem([...clickedItem, item]);
        }
    }

    function OpenDrawer() {
        setIsOpenDrawer(true);
    }

    function CloserDrawer() {
        setIsOpenDrawer(false);
    }


    const editName = async (e) => {
        e.preventDefault()
        try {
            await axios.patch("http://localhost:2000/api/editname/1", {
                name: nameProperty
            })
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                getDataForDashboard()
                toast({
                    title: 'Success',
                    description: 'Edit name has been updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                setIsOpenPopover(false)
            }, 3000)

        } catch (err) {
            console.log(err)
            if (err.response) {
                setMsgName(err.response.data)
            }
        }
    }

    const editFacilities = async (e) => {
        e.preventDefault()
        try {
            const nameFacility = clickedItem.map(facility => facility.title).join(", ")
            await axios.patch("http://localhost:2000/api/editfacility/1", {
                name: nameFacility
            })
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                getDataForDashboard()
                CloserDrawer()
                toast({
                    title: 'Success',
                    description: 'Facility has been updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }, 3000)
        } catch (err) {
            console.log(err)
            if (err.response) {
                setMsgNameFacility(err.response.data)
            }
        }
    }

    const handleMouseEnter = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    const handleModalOpen = () => {
        setModalOpen(true)
    }

    const handleModalClose = () => {
        setModalOpen(false)
    }

    const editDescription = async () => {
        try {
            await axios.patch("http://localhost:2000/api/editdescription/1", {
                description: desc
            })
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                getDataForDashboard()
                toast({
                    title: 'Success',
                    description: 'Description has been updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                setOpenPopoverDesc(false)
            }, 3000)
        } catch (err) {
            if (err.response) {
                setMsgNameDesc(err.response.data)
            }
        }
    }

    const editLocationDetail = async () => {
        try {
            await axios.patch("http://localhost:2000/api/editlocation/1", {
                country,
                province,
                city
            })
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                getDataForDashboard()
                handleModalClose()
                toast({
                    title: 'Success',
                    description: 'Location Detail has been updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }, 3000)
        } catch (err) {
            console.log(err)
            if (err.response) {
                setMsgErrorLocation(err.response.data)
            }
        }
    }

    function MyMap() {
        return (
            <Box border="2px solid white" borderRadius="10px" boxShadow="md" height="200px" width={width}>
                <BingMapsReact
                    bingMapsKey="AomnrSfTreMtpt0Jm_l56DONLM_o-GkAwmDRzqtgMhaPqEnnHT6zAF5IysqWK1_e"
                    mapOptions={{
                        navigationBarMode: "square",
                    }}
                    viewOptions={{
                        center: { latitude: data.category.locationDetail.coordinates[0], longitude: data.category.locationDetail.coordinates[1] },
                        mapTypeId: "Road",
                    }}
                />
            </Box>
        )
    }
    const width = useBreakpointValue({
        base: "300px",
        md: "600px",
        lg: "600px"
    })
    const widthProgress = useBreakpointValue({
        base: "80px",
        md: "100px",
        lg: "100px"
    })

    return (
        <Box>
            {data && (
                <Box p={6}>
                    <Heading as="h2" size="md" mb={4} fontFamily="Helvetica">
                        {data.name}
                        <Popover isOpen={isOpenPopover}
                            onClose={() => setIsOpenPopover(false)}>
                            <PopoverTrigger>
                                <Button bg="white" _hover="none" marginLeft="10px" onClick={() => setIsOpenPopover(true)}>
                                    <Icon as={AiOutlineEdit} cursor="pointer" boxSize="20px" color="gray.600" />
                                </Button>
                            </PopoverTrigger>
                            <Portal>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverHeader textAlign="center">Edit your name property</PopoverHeader>
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                        <FormControl isInvalid={isErrorNameProperty}>
                                            <FormLabel color="red" fontSize="12px">{msgName}</FormLabel>
                                            <Input id="name" type="text" value={nameProperty} variant="flushed"
                                                placeholder="Your name property?"
                                                onChange={(e) => setNameProperty(e.target.value)} />
                                            {isErrorNameProperty ? (<FormHelperText color="red" textAlign="center">Name is required</FormHelperText>) :
                                                (<FormHelperText color="#478fd3" textAlign="center">Create name success</FormHelperText>)}
                                        </FormControl>
                                    </PopoverBody>
                                    <PopoverFooter><Center><Button colorScheme="blue" variant="outline" onClick={editName}>{load ? <Spinner /> : "Submit"}</Button></Center></PopoverFooter>
                                </PopoverContent>
                            </Portal>
                        </Popover>
                    </Heading>
                    <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
                        <Box shadow="md" p={4}>
                            <Box position="relative">
                                <Image src={'http://localhost:2000/propertyPicture/' +data.picture} cursor="pointer" style={{ filter: hover ? "brightness(30%)" : "none" }} />
                                <Tooltip label="Change Picture?" fontSize="md" placement="top" openDelay={300} color="black" bg="white">
                                    <Button onClick={onOpen} style={{
                                        position: "absolute", top: "0", left: "0", right: "0", bottom: "0",
                                        width: "100%", height: "100%", opacity: "0", cursor: "pointer",
                                        zIndex: 1,
                                    }} onMouseOver={handleMouseEnter} onMouseOut={handleMouseLeave}>Open Modal</Button>
                                </Tooltip>
                                <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>Change Picture</ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody pb={6}>
                                            <form onSubmit={editPicture}>
                                                <Input type="file" onChange={(e) => setPicture(e.target.files[0])} variant="flushed" color="red.400" />
                                            </form>
                                            <Text textAlign="center" color="red">{msgPicture}</Text>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button colorScheme='blue' mr={3} type="submit" onClick={editPicture} >
                                                {load ? <Spinner /> : "Save"}
                                            </Button>
                                            <Button onClick={onClose}>Cancel</Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </Box>
                            <Text fontSize="lg" fontWeight="bold" mt={2} fontFamily="Helvetica">
                                Facilities provided
                            </Text>
                            <Text fontSize="md" color="gray.600" fontFamily="Helvetica">
                                {data.facilities[0].name}
                                <Icon as={AiOutlineEdit} cursor="pointer" boxSize="20px" color="gray.600" marginLeft="10px" onClick={OpenDrawer} ref={iconRef} />
                                <Drawer
                                    isOpen={isOpenDrawer}
                                    placement='right'
                                    onClose={CloserDrawer}
                                    finalFocusRef={iconRef}
                                    size="md"
                                >
                                    <DrawerOverlay />
                                    <DrawerContent>
                                        <DrawerCloseButton />
                                        <DrawerHeader>Edit your fasility property <br />
                                        </DrawerHeader>
                                        <DrawerBody>
                                            <Text color="red" textAlign="center" fontSize="12px">{msgNameFacility}</Text>
                                            <Flex flexWrap="wrap" marginTop="10px" gap="10px" cursor="pointer" justifyContent="center">
                                                {DataFasility.map((item) => (
                                                    <Card width="130px" height="110px"
                                                        onClick={() => handleItemClick(item)}
                                                        style={clickedItem.includes(item) ? { border: '2px solid black', fontWeight: 'bold' } : null}
                                                        _hover={{ border: '2px solid black' }}>
                                                        <CardBody>
                                                            <Box>
                                                                <Heading size="md">{item.img}</Heading>
                                                                <Text pt='2' fontSize='md'>
                                                                    {item.title}
                                                                </Text>
                                                            </Box>
                                                        </CardBody>
                                                    </Card>
                                                ))}
                                            </Flex>
                                        </DrawerBody>
                                        <DrawerFooter>
                                            <Button variant='outline' mr={3} onClick={CloserDrawer}>
                                                Cancel
                                            </Button>
                                            <Button colorScheme='blue' variant="outline" onClick={editFacilities}>{load ? <Spinner /> : "Submit"}</Button>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                            </Text>
                        </Box>
                        <Box shadow="md" p={4}>
                            <Text fontSize="lg" fontWeight="bold" mt={2}>
                                Description
                            </Text>
                            <Text fontSize="md" color="gray.600">
                                {data.description}
                                <Popover isLazy placement="bottom"
                                    isOpen={openPopoverDesc}
                                    onClose={() => setOpenPopoverDesc(false)}>
                                    <PopoverTrigger>
                                        <Button bg="white" _hover="none" marginLeft="10px" onClick={() => setOpenPopoverDesc(true)}>
                                            <Icon as={AiOutlineEdit} cursor="pointer" boxSize="20px" color="gray.600" />
                                        </Button>
                                    </PopoverTrigger>
                                    <Portal>
                                        <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverHeader textAlign="center">Edit your Description</PopoverHeader>
                                            <PopoverCloseButton />
                                            <PopoverBody>
                                                <FormControl isInvalid={isErrorNameProperty}>
                                                    <FormLabel color="red" fontSize="12px" textAlign="center">{msgNameDesc}</FormLabel>
                                                    <Textarea id="name" type="text" variant="flushed" defaultValue={valueDesc}
                                                        placeholder="Edit your Description" size="md"
                                                        onChange={(e) => setDesc(e.target.value)} />
                                                    {isErrorDescProperty ? (<FormHelperText color="red" textAlign="center">Desc is required</FormHelperText>) :
                                                        (<FormHelperText color="#478fd3" textAlign="center">Update desc success</FormHelperText>)}
                                                </FormControl>
                                            </PopoverBody>
                                            <PopoverFooter><Center><Button colorScheme="blue" variant="outline" onClick={editDescription}>{load ? <Spinner /> : "Submit"}</Button></Center></PopoverFooter>
                                        </PopoverContent>
                                    </Portal>
                                </Popover>
                            </Text>
                            <Text fontSize="lg" fontWeight="bold" mt={2}>
                                Location Detail
                            </Text>
                            <TableContainer>
                                <Table variant='simple'>
                                    <TableCaption>Edit location Detail
                                        <Icon as={AiOutlineEdit} cursor="pointer" boxSize="20px" color="gray.600" marginLeft="10px" onClick={handleModalOpen} />
                                    </TableCaption>
                                    <Thead>
                                        <Tr>
                                            <Th>Country</Th>
                                            <Th>Province</Th>
                                            <Th>City</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td>{data.category.country}</Td>
                                            <Td>{data.category.province}</Td>
                                            <Td>{data.category.city}</Td>
                                        </Tr>
                                    </Tbody>
                                    <Tfoot>
                                        <Tr>
                                            <Th>Country</Th>
                                            <Th>Province</Th>
                                            <Th>City</Th>
                                        </Tr>
                                    </Tfoot>
                                </Table>
                            </TableContainer>
                            <Modal closeOnOverlayClick={false} isOpen={modalOpen} onClose={handleModalClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Edit location Detail</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody pb={6}>
                                        <form onSubmit={editLocationDetail}>
                                            <Text fontSize="14px" textAlign="center" color="red">{msgErrorLocation}</Text>
                                            <FormControl isInvalid={isErrorCountry} width="auto" marginLeft="10px" marginRight="10px" >
                                                <FormLabel>Country</FormLabel>
                                                <Input variant="flushed" placeholder='Country?'
                                                    onChange={(e) => setCountry(e.target.value)}
                                                />
                                                {isErrorCountry ? (<FormHelperText color="red">Country is required</FormHelperText>) :
                                                    (<FormHelperText color="#478fd3">Update country success</FormHelperText>)}
                                            </FormControl>
                                            <FormControl isInvalid={isErrorProvince} width="auto" marginLeft="10px" marginRight="10px" >
                                                <FormLabel>Province</FormLabel>
                                                <Input variant="flushed" placeholder='Province?'
                                                    onChange={(e) => setProvince(e.target.value)}
                                                />
                                                {isErrorProvince ? (<FormHelperText color="red">Province is required</FormHelperText>) :
                                                    (<FormHelperText color="#478fd3">Update province success</FormHelperText>)}
                                            </FormControl>
                                            <FormControl isInvalid={isErrorCity} width="auto" marginLeft="10px" marginRight="10px" >
                                                <FormLabel>City</FormLabel>
                                                <Input variant="flushed" placeholder='City?'
                                                    onChange={(e) => setCity(e.target.value)}
                                                />
                                                {isErrorCity ? (<FormHelperText color="red">City is required</FormHelperText>) :
                                                    (<FormHelperText color="#478fd3">Update city success</FormHelperText>)}
                                            </FormControl>
                                        </form>
                                    </ModalBody>

                                    <ModalFooter>
                                        <Button colorScheme='blue' mr={3} onClick={editLocationDetail}>
                                            {load ? <Spinner /> : "Submit"}
                                        </Button>
                                        <Button onClick={handleModalClose}>Cancel</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </Box>
                    </Grid>

                    {/* Bookings */}
                    <Heading size="md" mt={8} mb={4} fontFamily="Helvetica" textAlign="center">
                        Your property progress and location
                    </Heading>
                    <Box shadow="md" p={4}>
                        <Flex flexWrap="wrap" gap="10px" justifyContent="center" alignItems="center">
                            <Flex flex="1" justifyContent="center" alignItems="center" gap="10px">
                                <Box>
                                    <Text textAlign="center" fontFamily="Helvetica" color="gray.600" fontSize="md">Seen</Text>
                                    <CircularProgress value={40} color='blue.400' size={widthProgress} thickness="4px" />
                                </Box>
                                <Box>
                                    <Text textAlign="center" fontFamily="Helvetica" color="gray.600" fontSize="md">Like</Text>
                                    <CircularProgress value={20} color='orange.400' size={widthProgress} thickness="4px" />
                                </Box>
                                <Box>
                                    <Text textAlign="center" fontFamily="Helvetica" color="gray.600" fontSize="md">Last Month</Text>
                                    <CircularProgress value={90} color='red.400' size={widthProgress} thickness="4px" />
                                </Box>
                            </Flex>
                            <Flex flex="1" justifyContent="center" alignItems="center">
                                <MyMap />
                            </Flex>
                        </Flex>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default DashboardOne
