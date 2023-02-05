import React, { useState, useEffect, useRef } from 'react'
import {
    Box, Heading, Grid, Flex, Image,
    Text, Icon, TableContainer,
    Td, Tr, Thead, Tbody, Th, Table, TableCaption, Tfoot,
    CircularProgress, Tooltip, Input, Button, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
    ModalFooter, Popover, PopoverTrigger, Portal, Center,
    FormControl, FormLabel, FormHelperText, Spinner, Card, CardBody,
    Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent,
    DrawerCloseButton, useBreakpointValue, useToast, Textarea,
    Tabs, TabList, TabPanels, Tab, TabPanel
} from "@chakra-ui/react"

import { AiOutlineEdit } from "react-icons/ai"
import BingMapsReact from "bingmaps-react";
import { DataFasility } from '../../Data/DataFasility';
import { useDispatch } from "react-redux"
import { openDrawerForMorePicture } from '../../Redux/MorePictureProperty';
import InputMorePictureProperty from './InputMorePictureProperty';
import "../../Styles/inputFile.css"
import useAuth from '../../hooks/useAuth';
import { Carousel } from 'react-responsive-carousel';
import DeleteProperty from './DeleteProperty';
import { openModal } from '../../Redux/DeleteProperty';

import axios from '../../api/axios';

const DashboardOne = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState()
    const [load, setLoad] = useState(false)
    const [editId, setEditId] = useState(null)

    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const iconRef = useRef()
    const { auth } = useAuth();

    //everything for editing picture
    const [picture, setPicture] = useState(null)
    const [msgPicture, setMsgPicture] = useState("")
    const [hover, setHover] = useState(false)
    const [openModalPicture, setOpanModelPicture] = useState(false)
    const [isOpenPopover, setIsOpenPopover] = useState(false)

    //everything for editing name Property
    const [nameProperty, setNameProperty] = useState("")
    const [msgName, setMsgName] = useState("")
    const isErrorNameProperty = nameProperty === ''

    //everything for facility
    const [clickedItem, setClickedItem] = useState([])
    const [msgNameFacility, setMsgNameFacility] = useState("")

    //everything for desc
    const [msgNameDesc, setMsgNameDesc] = useState("")
    const [desc, setDesc] = useState("")
    const isErrorDescProperty = desc === ''
    const [openPopoverDesc, setOpenPopoverDesc] = useState(false)

    //evertthing for location detail
    const [province, setProvince] = useState("")
    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")
    const [msgErrorLocation, setMsgErrorLocation] = useState("")
    const [modalOpenLocation, setModalOpenLocation] = useState(false)

    const isErrorCountry = country === ""
    const isErrorProvince = province === ""
    const isErrorCity = city === ""

    //toastify
    const toast = useToast()


    const getDataForDashboard = async () => {
        try {
            const response = await axios.get(`/property/${auth.tenantId}`)
            setData(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getDataForDashboard()
    }, [])


    const editPicture = async () => {
        try {
            if (!picture) {
                setMsgPicture("Picture is Required")
            }
            const formData = new FormData()
            formData.append('file', picture)
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
            await axios.patch(`/editpicture/${editId}`, formData, config)
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                getDataForDashboard()
                isCloseModalPicture()
                setPicture(null)
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

    const isOpenModalPicture = (item) => {
        setOpanModelPicture(true)
        setEditId(item.id)
    }
    const isCloseModalPicture = () => {
        setOpanModelPicture(false)
        setEditId(null)
    }

    const handleItemClick = (item) => {
        if (clickedItem.includes(item)) {
            setClickedItem(clickedItem.filter((i) => i !== item));
        } else {
            setClickedItem([...clickedItem, item]);
        }
    }

    function OpenDrawerFacility(item) {
        setIsOpenDrawer(true);
        setEditId(item.id)
    }

    function CloserDrawerFacility() {
        setIsOpenDrawer(false);
        setEditId(null)
    }


    const editName = async () => {
        try {
            await axios.patch(`/editname/${editId}`, {
                name: nameProperty
            })
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                getDataForDashboard()
                setNameProperty("")
                toast({
                    title: 'Success',
                    description: 'Edit name has been updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                closePopoverName()
            }, 3000)

        } catch (err) {
            console.log(err)
            if (err.response) {
                setMsgName(err.response.data)
            }
        }
    }

    const openPopoverName = (item) => {
        setIsOpenPopover(true)
        setEditId(item.id)
    }
    const closePopoverName = () => {
        setIsOpenPopover(false)
        setEditId(null)
    }

    const editFacilities = async (e) => {
        e.preventDefault()
        try {
            const nameFacility = clickedItem.map(facility => facility.title).join(", ")
            await axios.patch(`/editfacility/${editId}`, {
                name: nameFacility
            }, {
                withCredentials: true
            })
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                getDataForDashboard()
                CloserDrawerFacility()
                setClickedItem([])
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

    const handleModalOpenLocation = (item) => {
        setModalOpenLocation(true)
        setEditId(item.id)
    }

    const handleModalCloseLocation = () => {
        setModalOpenLocation(false)
        setEditId(null)
    }

    const editDescription = async () => {
        try {
            await axios.patch(`/editdescription/${editId}`, {
                description: desc
            }, {
                withCredentials: true
            })
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                getDataForDashboard()
                isCloseModalDesc()
                setDesc("")
                toast({
                    title: 'Success',
                    description: 'Description has been updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }, 3000)
        } catch (err) {
            if (err.response) {
                setMsgNameDesc(err.response.data)
            }
        }
    }

    const isOpenModalDesc = (item) => {
        setOpenPopoverDesc(true)
        setEditId(item.id)
    }
    const isCloseModalDesc = () => {
        setOpenPopoverDesc(false)
        setEditId(null)
    }

    const editLocationDetail = async () => {
        try {
            await axios.patch(`/editlocation/${editId}`, {
                country,
                province,
                city
            }, {
                withCredentials: true
            })
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                getDataForDashboard()
                handleModalCloseLocation()
                setCountry("")
                setProvince("")
                setCity("")
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
            {data && data.map((item) => (
                <Box>
                    <Tabs variant='enclosed'>
                        <TabList>
                            <Tab>{item.name}</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Box p={2}>
                                    <Heading as="h2" size="md" mb={4} fontFamily="Helvetica">
                                        {item.name}
                                        <Button bg="white" _hover="none" marginLeft="10px" onClick={() => openPopoverName(item)}>
                                            <Icon as={AiOutlineEdit} cursor="pointer" boxSize="20px" color="gray.600" />
                                        </Button>
                                        <Modal closeOnOverlayClick={false} isOpen={isOpenPopover} onClose={closePopoverName}>
                                            <ModalOverlay />
                                            <ModalContent>
                                                <ModalHeader>Edit your name property</ModalHeader>
                                                <ModalCloseButton />
                                                <ModalBody pb={6}>
                                                    <FormControl isInvalid={isErrorNameProperty}>
                                                        <FormLabel color="red" fontSize="12px">{msgName}</FormLabel>
                                                        <Input id="name" type="text" value={nameProperty} variant="flushed"
                                                            placeholder="Your name property?"
                                                            onChange={(e) => setNameProperty(e.target.value)} />
                                                        {isErrorNameProperty ? (<FormHelperText color="red" textAlign="center">Name is required</FormHelperText>) :
                                                            (<FormHelperText color="#478fd3" textAlign="center">Create name success</FormHelperText>)}
                                                    </FormControl>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button colorScheme='blue' mr={3} variant="outline" onClick={editName}>
                                                        {load ? <Spinner /> : "Submit"}
                                                    </Button>
                                                    <Button onClick={closePopoverName}>Cancel</Button>
                                                </ModalFooter>
                                            </ModalContent>
                                        </Modal>
                                    </Heading>
                                    <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
                                        <Box shadow="md" p={4}>
                                            <Box position="relative">
                                                <Carousel
                                                    autoPlay
                                                    infiniteLoop
                                                    showArrows={true}>
                                                    {item.propertypictures && item.propertypictures.map((image, i) => (
                                                        <Box key={i}>
                                                            <Image cursor="pointer" height="350px" style={{ filter: hover ? "brightness(30%)" : "none" }} src={`http://localhost:2000/propertyPicture/${image.picture}`} />
                                                        </Box>
                                                    ))}
                                                </Carousel>
                                                <Tooltip label="Change Picture?" fontSize="md" placement="top" openDelay={300} color="black" bg="white">
                                                    <Button onClick={() => isOpenModalPicture(item)} style={{
                                                        position: "absolute", top: "0", left: "0", right: "0", bottom: "0",
                                                        width: "100%", height: "100%", opacity: "0", cursor: "pointer",
                                                        zIndex: 1,
                                                    }} onMouseOver={handleMouseEnter} onMouseOut={handleMouseLeave}>Open Modal</Button>
                                                </Tooltip>
                                                <Modal closeOnOverlayClick={false} isOpen={openModalPicture} onClose={isCloseModalPicture}>
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
                                                            <Button colorScheme='blue' mr={3} type="submit" onClick={editPicture}>
                                                                {load ? <Spinner /> : "Save"}
                                                            </Button>
                                                            <Button onClick={isCloseModalPicture}>Cancel</Button>
                                                            <Button colorScheme="blue" variant="outline" marginLeft="10px" onClick={() => dispatch(openDrawerForMorePicture())}>More Picture?</Button>
                                                        </ModalFooter>
                                                    </ModalContent>
                                                </Modal>
                                                <InputMorePictureProperty />
                                            </Box>
                                            <Text fontSize="lg" fontWeight="bold" mt={2} fontFamily="Helvetica">
                                                Facilities provided
                                            </Text>
                                            <Text fontSize="md" color="gray.600" fontFamily="Helvetica">
                                                {item.facilities[0].name}
                                                <Icon as={AiOutlineEdit} cursor="pointer" boxSize="20px" color="gray.600" marginLeft="10px" onClick={() => OpenDrawerFacility(item)} ref={iconRef} />
                                                <Drawer
                                                    isOpen={isOpenDrawer}
                                                    placement='right'
                                                    onClose={CloserDrawerFacility}
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
                                                            <Button variant='outline' mr={3} onClick={CloserDrawerFacility}>
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
                                                {item.description}
                                                <Button bg="white" _hover="none" marginLeft="10px" onClick={() => isOpenModalDesc(item)}>
                                                    <Icon as={AiOutlineEdit} cursor="pointer" boxSize="20px" color="gray.600" />
                                                </Button>
                                            </Text>
                                            <Modal closeOnOverlayClick={false} isOpen={openPopoverDesc} onClose={isCloseModalDesc}>
                                                <ModalOverlay />
                                                <ModalContent>
                                                    <ModalHeader>Edit your name property</ModalHeader>
                                                    <ModalCloseButton />
                                                    <ModalBody pb={6}>
                                                        <FormControl isInvalid={isErrorNameProperty}>
                                                            <FormLabel color="red" fontSize="12px" textAlign="center">{msgNameDesc}</FormLabel>
                                                            <Textarea id="name" type="text" variant="flushed"
                                                                placeholder="Edit your Description"
                                                                onChange={(e) => setDesc(e.target.value)} />
                                                            {isErrorDescProperty ? (<FormHelperText color="red" textAlign="center">Desc is required</FormHelperText>) :
                                                                (<FormHelperText color="#478fd3" textAlign="center">Update desc success</FormHelperText>)}
                                                        </FormControl>
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button colorScheme='blue' mr={3} variant="outline" onClick={editDescription}>
                                                            {load ? <Spinner /> : "Submit"}
                                                        </Button>
                                                        <Button onClick={isCloseModalDesc}>Cancel</Button>
                                                    </ModalFooter>
                                                </ModalContent>
                                            </Modal>

                                            <Text fontSize="lg" fontWeight="bold" mt={2}>
                                                Location Detail
                                            </Text>

                                            <TableContainer>
                                                <Table variant='simple'>
                                                    <TableCaption>Edit location Detail
                                                        <Icon as={AiOutlineEdit} cursor="pointer" boxSize="20px" color="gray.600" marginLeft="10px" onClick={() => handleModalOpenLocation(item)} />
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
                                                            <Td>{item.category.country}</Td>
                                                            <Td>{item.category.province}</Td>
                                                            <Td>{item.category.city}</Td>
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
                                            <Modal closeOnOverlayClick={false} isOpen={modalOpenLocation} onClose={handleModalCloseLocation}>
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
                                                        <Button onClick={handleModalCloseLocation}>Cancel</Button>
                                                    </ModalFooter>
                                                </ModalContent>
                                            </Modal>
                                        </Box>
                                    </Grid>
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
                                                <Box border="2px solid white" borderRadius="10px" boxShadow="md" height="200px" width={width}>
                                                    <BingMapsReact
                                                        bingMapsKey="AomnrSfTreMtpt0Jm_l56DONLM_o-GkAwmDRzqtgMhaPqEnnHT6zAF5IysqWK1_e"
                                                        mapOptions={{
                                                            navigationBarMode: "square",
                                                        }}
                                                        viewOptions={{
                                                            center: { latitude: item.category.locationDetail.coordinates[0], longitude: item.category.locationDetail.coordinates[1] },
                                                            mapTypeId: "Road",
                                                        }}
                                                    />
                                                </Box>
                                            </Flex>
                                        </Flex>
                                    </Box>
                                    <Box boxShadow="md" p={4}>
                                        <Center>
                                            <Button textAlign="center" backgroundColor="red.400" color="white" onClick={() => dispatch(openModal(item))}>Delete Property</Button>
                                        </Center>
                                        <DeleteProperty />
                                    </Box>
                                </Box>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            ))
            }

        </Box >
    )
}

export default DashboardOne