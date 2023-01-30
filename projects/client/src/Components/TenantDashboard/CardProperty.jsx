import React, { useState, useEffect } from 'react'
import {
    Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
    Tooltip, ModalFooter, Spinner, Text, useToast, Input, Image, Flex, Icon, FormControl,
    FormLabel, FormHelperText, Divider, Spacer, useDisclosure, AlertDialog, AlertDialogBody,
    AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton,
    Textarea, Card, CardBody, Heading, Center, Skeleton, SkeletonCircle, useBreakpointValue
} from "@chakra-ui/react"
import useAuth from '../../hooks/useAuth'
import axios from "../../api/axios"
import { Carousel } from 'react-responsive-carousel';
import { useDispatch } from "react-redux"
import InputMorePictureProperty from '../ComponentBeTenant/InputMorePictureProperty';
import { openDrawerForMorePicture } from '../../Redux/MorePictureProperty';
import { FiEdit3 } from "react-icons/fi"
import { RxDividerVertical } from "react-icons/rx"
import { DataFasility } from "../../Data/DataFasility"

const CardProperty = () => {
    //for everything
    const [data, setData] = useState([])
    const [load, setLoad] = useState(false)
    const [descProperty, setDescProperty] = useState()
    console.log(descProperty)
    const [loadDesc, setLoadDesc] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const { auth } = useAuth();
    const [editId, setEditId] = useState(null)
    console.log(editId)
    const toast = useToast()
    const cancelRef = React.useRef()

    //editname
    const [isopenModalName, setIsOpenModalName] = useState(false)
    const [nameProperty, setNameProperty] = useState("")
    const [msgName, setMsgName] = useState("")
    const isErrorNameProperty = nameProperty === ''

    //editpicture
    const [picture, setPicture] = useState(null)
    const [msgPicture, setMsgPicture] = useState("")
    const [indexHover, setIndexHover] = useState(-1)
    const [openModalPicture, setOpanModelPicture] = useState(false)

    //descripsi
    const [alertDialogDesc, setAlertDialogDesc] = useState(false)
    const [editDesc, setEditDesc] = useState(false)
    const [msgNameDesc, setMsgNameDesc] = useState("")
    const [desc, setDesc] = useState("")
    const isErrorDescProperty = desc === ''

    //edit location detail
    const [province, setProvince] = useState("")
    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")
    const [msgErrorLocation, setMsgErrorLocation] = useState("")
    const [modalOpenLocation, setModalOpenLocation] = useState(false)

    const isErrorCountry = country === ""
    const isErrorProvince = province === ""
    const isErrorCity = city === ""

    //facility
    const [alertDialogFacility, setAlertDialogFacility] = useState(false)
    const [editFacility, setEditFacility] = useState(false)
    const [clickedItem, setClickedItem] = useState([])
    const [dataFacility, setDataFacility] = useState()
    const [loadFacility, setLoadFacility] = useState(false)
    const [msgNameFacility, setMsgNameFacility] = useState("")

    const dispatch = useDispatch()

    const getData = async () => {
        try {
            const response = await axios.get(`property/${auth.tenantId}`)
            setData(response.data)
            setTimeout(() => {
                setLoadingData(false)
            }, 3000)
        } catch (err) {
            console.log(err)
        }
    }

    const getDataDesc = async () => {
        try {
            setLoadDesc(true)
            const response = await axios.get(`/descProperty/${editId}`)
            setDescProperty(response.data)
            setTimeout(() => {
                setLoadDesc(false)
            }, 3000)
        } catch (err) {
            console.log(err)
        }
    }

    const getDataFacility = async () => {
        try {
            setLoadFacility(true)
            const response = await axios.get(`/getFacilityById/${editId}`)
            setDataFacility(response.data)
            setTimeout(() => {
                setLoadFacility(false)
            }, 3000)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getDataFacility()
    }, [editId])

    useEffect(() => {
        getDataDesc()
    }, [editId])


    useEffect(() => {
        getData()
    }, [])

    // editpicture ............................................................................................
    const isOpenModalPicture = (item) => {
        setOpanModelPicture(true)
        setEditId(item.id)

    }
    const isCloseModalPicture = () => {
        setOpanModelPicture(false)
        setEditId(null)

    }


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
                isCloseModalPicture()
                setPicture(null)
                getData()
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
    // edit picture ..................................................................
    const openPopoverName = (item) => {
        setIsOpenModalName(true)
        setEditId(item.id)

    }
    const closePopoverName = () => {
        setIsOpenModalName(false)
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
                getData()
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
    // edit desc......................................................................
    const openAlertDialogDesc = (item) => {
        setAlertDialogDesc(true)
        setEditId(item.id)
        setEditDesc(false)
    }
    const closeAlertDialogDesc = async () => {
        setAlertDialogDesc(false)
        setEditId(null)
        setEditDesc(false)
    }
    const openEditDesc = () => {
        setEditDesc(true)
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
                getData()
                getDataDesc()
                closeAlertDialogDesc()
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

    //edit location detail
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
                getData()
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
    const handleModalOpenLocation = (item) => {
        setModalOpenLocation(true)
        setEditId(item.id)
    }

    const handleModalCloseLocation = () => {
        setModalOpenLocation(false)
        setEditId(null)
    }

    //facility
    const openAlertDialogFacility = (item) => {
        setAlertDialogFacility(true)
        setEditId(item.id)
        getDataFacility()
    }
    const closeAlertDialogFacility = () => {
        setAlertDialogFacility(false)
        setEditId(null)
        setEditFacility(false)
        setMsgNameFacility("")
    }
    const openEditFacility = () => {
        setEditFacility(true)
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
                closeAlertDialogFacility()
                getDataFacility()
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
    const handleItemClick = (item) => {
        if (clickedItem.includes(item)) {
            setClickedItem(clickedItem.filter((i) => i !== item));
        } else {
            setClickedItem([...clickedItem, item]);
        }
    }
    function countFacilities(facilities) {
        let count = 0;
        facilities.forEach(facility => {
            count += facility.name.split(", ").length;
        });
        return count;
    }

    //responsive
    const widthFontSize = useBreakpointValue({
        base:"8px",
        md : "10px",
        lg:"12px"
    })
    return (
        <Box marginTop="10px">
            <Flex gap="10px" justifyContent="center" alignItems="center" flexWrap="wrap">
                {data && data.map((item, index) => (
                    <Box width="340px" height="450px" border="4px solid #f1f1f1" borderRadius="15px">
                        <Box position="relative" margin="0" p={1} height="70%">
                            <Skeleton isLoaded={!loadingData}>
                                <Box>
                                    <Carousel
                                        autoPlay
                                        infiniteLoop
                                        showArrows={true}>
                                        {item.propertypictures && item.propertypictures.map((image, i) => (
                                            <Box key={i}>
                                                <Image cursor="pointer" height="150px" objectFit="cover" borderRadius="5px" style={{ filter: index === indexHover ? "brightness(30%)" : "none" }} src={`http://localhost:2000/propertyPicture/${image.picture}`} />
                                            </Box>
                                        ))}
                                    </Carousel>
                                    <Tooltip label="Change Picture?" fontSize="md" placement="top" openDelay={300} color="black" bg="white">
                                        <Button onClick={() => isOpenModalPicture(item)} style={{
                                            position: "absolute", top: "0", left: "0", right: "0", bottom: "0",
                                            width: "100%", height: "40%", opacity: "0", cursor: "pointer",
                                            zIndex: 1,
                                        }} onMouseOver={() => setIndexHover(index)} onMouseOut={() => setIndexHover(-1)}>Open Modal</Button>
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
                            </Skeleton>
                            <Box marginLeft="4">
                                <Flex gap="5px" alignItems="center">
                                    <Skeleton isLoaded={!loadingData}>
                                        <Text fontWeight="bold" fontFamily="sans-serif">{item.name}</Text>
                                    </Skeleton>
                                    <SkeletonCircle isLoaded={!loadingData}>
                                        <Icon as={FiEdit3} cursor="pointer" boxSize="22px" color="#4e90d3" onClick={() => openPopoverName(item)} />
                                    </SkeletonCircle>
                                </Flex>
                                <Modal closeOnOverlayClick={false} isOpen={isopenModalName} onClose={closePopoverName}>
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
                                <Flex gap="5px" alignItems="center" color="#9a9a9a">
                                    <Skeleton isLoaded={!loadingData}>
                                        {item.category.country}, {item.category.province}, {item.category.city}
                                    </Skeleton>
                                    <SkeletonCircle isLoaded={!loadingData}>
                                        <Icon as={FiEdit3} cursor="pointer" boxSize="15px" color="#4e90d3" onClick={() => handleModalOpenLocation(item)} />
                                    </SkeletonCircle>
                                </Flex>
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
                                <Flex alignItems="center" gap="5px" marginTop="5px">
                                    <Skeleton isLoaded={!loadingData}>
                                        <Text fontSize="12px" fontFamily="sans-serif">Made on : </Text>
                                    </Skeleton>
                                    <Skeleton isLoaded={!loadingData}>
                                        <Text fontSize="12px" fontFamily="sans-serif" color="#67a0d9">{new Date(item.createdAt).toLocaleString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                                    </Skeleton>
                                </Flex>
                                <Divider borderColor="#808080" width="90%" marginTop="10px" />
                                <Flex marginTop="10px" alignItems="center">
                                    <Box bg="#d9efe4" width="70px" borderRadius="5px">
                                        <Skeleton isLoaded={!loadingData}>
                                        <Text color="#539372" textAlign="center" fontWeight="bold" fontFamily="sans-serif">Active</Text>
                                        </Skeleton>
                                    </Box>
                                    <Skeleton isLoaded={!loadingData} marginLeft="5px">
                                    <Text color="#a8a8a8" marginLeft="5px" fontSize={widthFontSize}>Updated Nov 29</Text>
                                    </Skeleton>
                                    <Skeleton isLoaded={!loadingData} marginLeft="5px">
                                    <Text cursor="pointer" color="#5a93c9" marginLeft="20px" fontWeight="bold" onClick={() => openAlertDialogDesc(item)}>View Desc</Text>
                                    </Skeleton>
                                    <AlertDialog
                                        motionPreset='slideInBottom'
                                        onClose={closeAlertDialogDesc}
                                        isOpen={alertDialogDesc}
                                        isCentered
                                    >
                                        <AlertDialogOverlay />
                                        <AlertDialogContent>
                                            <AlertDialogHeader>Description</AlertDialogHeader>
                                            <AlertDialogCloseButton />
                                            <AlertDialogBody >
                                                {loadDesc ?
                                                    <Center>
                                                        <Spinner />
                                                    </Center>
                                                    :
                                                    editDesc ? (
                                                        <Box p={5} rounded="lg" shadow="md" width="100%">
                                                            <FormControl isInvalid={isErrorNameProperty}>
                                                                <FormLabel color="red" fontSize="12px" textAlign="center">{msgNameDesc}</FormLabel>
                                                                <Textarea id="name" type="text" variant="flushed" defaultValue={descProperty.description}
                                                                    placeholder="Edit your Description"
                                                                    onChange={(e) => setDesc(e.target.value)} />
                                                                {isErrorDescProperty ? (<FormHelperText color="red" textAlign="center">Desc is required</FormHelperText>) :
                                                                    (<FormHelperText color="#478fd3" textAlign="center">Update desc success</FormHelperText>)}
                                                            </FormControl>
                                                        </Box>
                                                    ) : (
                                                        <Box p={5} rounded='lg' shadow='md' width="100%" >
                                                            <Text textAlign="center">
                                                                {descProperty.description}
                                                            </Text>
                                                        </Box>
                                                    )
                                                }
                                            </AlertDialogBody>
                                            <AlertDialogFooter>
                                                <Button onClick={closeAlertDialogDesc} marginRight="10px">Cancel</Button>
                                                {editDesc ? (
                                                    <Button colorScheme="facebook" variant="outline" onClick={editDescription}>{load ? <Spinner /> : "Save"}</Button>
                                                ) : (<Button colorScheme="facebook" variant="outline" onClick={openEditDesc}>Edit?</Button>)}
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </Flex>
                            </Box>
                        </Box>
                        <Box bg="#f7f7f7" width="100%" marginTop="21.5px" height="25%" borderBottomRadius="10px">
                            <Box p={2}>
                                <Skeleton isLoaded={!loadingData}>
                                    <Text textAlign="center" fontFamily="sans-serif" color="#787878" fontWeight="bold">Past 30 days</Text>
                                </Skeleton>
                                <Flex marginTop="10px" alignItems="center" justifyContent="center">
                                    <Flex flexDirection="column" alignItems="center">
                                        <Skeleton isLoaded={!loadingData}>
                                        <Text color="#aeaeae">Views</Text>
                                        <Text color="#3b3a3e" textAlign="center">560</Text>
                                        </Skeleton>
                                    </Flex>
                                    <Icon as={RxDividerVertical} boxSize="40px" color="#eaeaea" />
                                    <Flex flexDirection="column" alignItems="center">
                                        <Skeleton isLoaded={!loadingData}>
                                        <Text color="#6a9dc7" fontWeight="bold" cursor="pointer" onClick={() => openAlertDialogFacility(item)}>Facility</Text>
                                        <Text color="#3b3a3e" textAlign="center">{countFacilities(item.facilities)}</Text>
                                        </Skeleton>
                                    </Flex>
                                    <AlertDialog
                                        motionPreset='slideInBottom'
                                        onClose={closeAlertDialogFacility}
                                        isOpen={alertDialogFacility}
                                        isCentered
                                    >
                                        <AlertDialogOverlay />
                                        <AlertDialogContent>
                                            <AlertDialogHeader>Facility</AlertDialogHeader>
                                            <AlertDialogCloseButton />
                                            <AlertDialogBody style={{ overflowY: 'scroll', maxHeight: '70vh' }} >
                                                <Text textAlign="center" color="red.400">{msgNameFacility}</Text>
                                                {loadFacility ?
                                                    <Center>
                                                        <Spinner />
                                                    </Center>
                                                    :
                                                    editFacility ? (
                                                        <Box p={5} rounded="lg" shadow="md" width="100%">
                                                            {DataFasility.map((item) => (
                                                                <Card width="100%" height="110px" p={2}
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
                                                        </Box>
                                                    ) : (
                                                        <Box p={5} rounded='lg' shadow='md' width="100%" >
                                                            <Text textAlign="center">
                                                                {dataFacility && dataFacility.facilities[0].name}
                                                            </Text>
                                                        </Box>
                                                    )
                                                }
                                            </AlertDialogBody>
                                            <AlertDialogFooter>
                                                <Button onClick={closeAlertDialogFacility} marginRight="10px">Cancel</Button>
                                                {editFacility ? (
                                                    <Button colorScheme="facebook" variant="outline" onClick={editFacilities}>{load ? <Spinner /> : "Save"}</Button>
                                                ) : (<Button colorScheme="facebook" variant="outline" onClick={openEditFacility}>Edit?</Button>)}
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <Icon as={RxDividerVertical} boxSize="40px" color="#eaeaea" />
                                    <Flex flexDirection="column" alignItems="center">
                                        <Skeleton isLoaded={!loadingData}>
                                        <Text color="#aeaeae">Desc</Text>
                                        <Text color="#3b3a3e" textAlign="center">7</Text>
                                        </Skeleton>
                                    </Flex>
                                </Flex>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Flex>
        </Box>
    )
}

export default CardProperty
