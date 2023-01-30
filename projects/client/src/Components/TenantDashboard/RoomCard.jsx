import React, { useState, useEffect } from 'react'
import {
    Box, Text, Flex, Image, Icon, Divider, Tag, TagLabel, TagRightIcon,
    Spacer, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, FormControl, FormLabel, Input, FormHelperText, ModalFooter, Button,
    useToast, Spinner, Center, AlertDialog, AlertDialogBody, AlertDialogFooter,
    AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton, AlertDialogHeader,
    Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader,
    DrawerBody, Stack, Heading, Card, CardBody, CardFooter, DrawerFooter,
    Skeleton, SkeletonCircle

} from "@chakra-ui/react"
import axios from "../../api/axios"
import useAuth from '../../hooks/useAuth'
import { useSelector, useDispatch } from "react-redux"
import { Carousel } from 'react-responsive-carousel';
import { FiEdit3 } from "react-icons/fi"
import { RxDividerVertical } from "react-icons/rx"
import { AiOutlineFolderOpen, AiFillSetting, AiOutlineCalendar, AiOutlineCloudUpload, AiFillDelete } from "react-icons/ai"
import { ImFilePicture } from "react-icons/im"
import { FaRegEdit } from "react-icons/fa"
import { GiPriceTag } from "react-icons/gi"
import { TfiStatsUp } from "react-icons/tfi"
import { openModalCertainDate } from '../../Redux/CertainDate'
import InputCertainDate from '../ComponentBeTenant/InputCertainDate'

const RoomCard = () => {
    //everything
    const { auth } = useAuth();
    const dispatch = useDispatch()
    const nameProperty = useSelector((state) => state.PropertySlice.value.name)
    const [data, setData] = useState([])
    const [roomImages, setRoomImages] = useState([])
    const [roomId, setRoomId] = useState(null)
    const [loadingData, setLoadingData] = useState(true)
    const [load, setLoad] = useState(false)
    const [editId, setEditId] = useState()
    const toast = useToast()

    //editRooms
    const [loadEdit, setLoadEdit] = useState(false)
    const [valueName, setValueName] = useState("")
    const [valueDesc, setValueDesc] = useState("")
    const [valuePrice, setValuePrice] = useState()
    const [openModal, setOpenModal] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState()
    const [picture, setPicture] = useState(null);
    const [msgError, setMsgError] = useState("")
    const [imageUrl, setImageUrl] = useState(null)

    //view desc
    const [descRooms, setDescRooms] = useState()
    const [loadDesc, setLoadDesc] = useState(false)
    const [alertDialogDesc, setAlertDialogDesc] = useState(false)

    //createManyRooms
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [msgAddPicture, setMsgAddPicture] = useState("")


    const getData = async () => {
        try {
            const response = await axios.get(`/getAllDataRooms/${auth.tenantId}`, {
                params: {
                    name: nameProperty
                }
            })
            response.data.forEach(property => {
                property.rooms.forEach(room => {
                    if (room.picture) {
                        room.images.push({ picture: room.picture })
                    }
                })
            })
            setData(response.data[0].rooms)
            setTimeout(() => {
                setLoadingData(false)
            }, 3000)
        } catch (err) {
            console.log(err)
        }
    }

    const getDataImagesRoom = async () => {
        try {
            const response = await axios.get(`/roomimages/${roomId}`)
            setRoomImages(response.data[0].images)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getDataImagesRoom()
    }, [roomId])

    useEffect(() => {
        getData()
    }, [nameProperty])

    //editRooms
    const handlePictureChange = (e) => {
        setPicture(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]))
    }

    const OpenModalEdit = async (item) => {
        setLoadEdit(true)
        const value = await axios.get(`/roombyid/${item.id}`)
        setEditId(item.id)
        setValueName(value.data.name)
        setValueDesc(value.data.description)
        setValuePrice(value.data.price)
        setOpenModal(true)
        setTimeout(() => {
            setLoadEdit(false)
        }, 2000)
    }
    const CloseModalEdit = () => {
        setOpenModal(false)
        setEditId(null)
        setMsgError("")
    }

    const updateRooms = async () => {
        try {
            const formData = new FormData()

            formData.append('name', !name ? valueName : name)
            formData.append('description', !description ? valueDesc : description)
            formData.append('price', !price ? valuePrice : price)
            formData.append('file', picture)

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    withCredentials: true
                }
            }
            await axios.patch(`/editroom/${editId}`, formData, config)
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                getData()
                setMsgError("")
                CloseModalEdit()
                toast({
                    title: 'Success',
                    description: 'Room has been updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }, 3000)
        } catch (err) {
            console.log(err)
            if (err.response) {
                setMsgError(err.response.data)
            }
        }
    }

    //everything for desc
    const getDataDesc = async () => {
        try {
            setLoadDesc(true)
            const response = await axios.get(`/descRoom/${editId}`)
            setDescRooms(response.data)
            setTimeout(() => {
                setLoadDesc(false)
            }, 3000)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        getDataDesc()
    }, [editId])

    const openAlertDialogDesc = (item) => {
        setAlertDialogDesc(true)
        setEditId(item.id)
    }
    const closeAlertDialogDesc = async () => {
        setAlertDialogDesc(false)
        setEditId(null)
    }

    //room alvailability
    const handleAlvaibleRoom = async (item) => {
        await axios.patch(`/updateAlvaible/${item.id}`)
        getData()
        toast({
            title: 'Success',
            description: `${item.name} is Alvaible`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        })
    }

    const handleDisableRoom = async (item) => {
        await axios.patch(`/updateDisable/${item.id}`)
        getData()
        toast({
            title: 'Success',
            description: `${item.name} is Disable`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        })
    }

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setImageUrl(null);
        setRoomImages(null)
    }
    const handleOpenDrawer = (item) => {
        setIsOpenDrawer(true)
        setRoomId(item.id)
    }

    const createManyRooms = async () => {
        try {
            const formData = new FormData()
            formData.append('file', picture)
            formData.append('roomId', roomId)

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    withCredentials: true
                }
            }

            await axios.post("/addmanyimageroom", formData, config)
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                setIsOpenDrawer(false)
                getData()
                getDataImagesRoom()
                toast({
                    title: 'Success',
                    description: 'Picture has been created',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }, 3000)
        } catch (err) {
            console.log(err)
            if (err.response) {
                setMsgAddPicture(err.response.data)
            }
        }
    }

    const deleteRoomImages = async (image) => {
        try {
            await axios.delete(`/deleteroomimage/${image.id}`)
            getDataImagesRoom()
            getData()
            toast({
                title: 'Success',
                description: 'Picture has been deleted',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            console.log(err)
        }
    }

    //delete rooms 
    const deleteRooms = async (item) => {
        try {
            await axios.delete(`/deleteroom/${item.id}`)
            getData()
            toast({
                title: 'Success',
                description: 'Data has been deleted',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Box marginTop="10px">
            <Flex gap="10px" justifyContent="center" alignItems="center" flexWrap="wrap">
                {data && data.map((item, index) => (
                    <Box width="300px" height="450px" border="4px solid #f1f1f1" borderRadius="15px">
                        <Box position="relative" margin="0" p={1} height="70%">
                            <Skeleton isLoaded={!loadingData}>
                                <Box>
                                    <Carousel
                                        autoPlay
                                        infiniteLoop
                                        showArrows={true}>
                                        {item.images && item.images.map((image, i) => (
                                            <Box key={i}>
                                                <Image cursor="pointer" height="150px" objectFit="cover" borderRadius="5px" src={`http://localhost:2000/roomPicture/${image.picture}`} />
                                            </Box>
                                        ))}
                                    </Carousel>
                                </Box>
                            </Skeleton>
                            <Box marginLeft="4">
                                <Flex gap="5px" alignItems="center" marginBottom="2px">
                                    <Skeleton isLoaded={!loadingData}>
                                        <Text fontWeight="bold" fontFamily="sans-serif">{item.name}</Text>
                                    </Skeleton>
                                </Flex>
                                <Flex gap="5px" alignItems="center" >
                                    <Skeleton isLoaded={!loadingData}>
                                        <Text color="#4e90d3" fontWeight="bold" cursor="pointer" onClick={() => openAlertDialogDesc(item)}>View Desc {item.name}</Text>
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
                                                {loadDesc ? <Center><Spinner /></Center> : (
                                                    <Box p={5} rounded='lg' shadow='md' width="100%" >
                                                        <Text textAlign="center">
                                                            {descRooms.description}
                                                        </Text>
                                                    </Box>
                                                )}
                                            </AlertDialogBody>
                                            <AlertDialogFooter>
                                                <Button onClick={closeAlertDialogDesc} marginRight="10px">Cancel</Button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </Flex>
                                <Flex alignItems="center" gap="12px" marginTop="5px">
                                    <Box>
                                        {item.highSeasons && item.highSeasons.map(room => {
                                            if (new Date(room.start_date) <= new Date() && new Date(room.end_date) > new Date()) {
                                                return (
                                                    <Flex gap="5px" alignItems="center">
                                                        <Flex flexDirection="column" alignItems="center">
                                                            <Skeleton isLoaded={!loadingData}>
                                                                <Icon as={TfiStatsUp} color="#5e9b7d" />
                                                                {/* <Text fontSize="8px" color="#5e9b7d" fontWeight="bold">{(((room.price - item.price) / item.price) * 100).toFixed(2)} %</Text> */}
                                                            </Skeleton>
                                                        </Flex>
                                                        <Skeleton isLoaded={!loadingData}>
                                                            <Text fontSize="12px" fontFamily="sans-serif" color="#67a0d9">
                                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(room.price)}
                                                            </Text>
                                                        </Skeleton>
                                                        <Skeleton isLoaded={!loadingData}>
                                                            <Tag size="md" variant='outline' color="#8eb2d4" cursor="pointer">
                                                                <TagLabel>High Seasons</TagLabel>
                                                                <TagRightIcon as={GiPriceTag} />
                                                                <Text fontSize="8px" color="#5e9b7d" fontWeight="bold">{(((room.price - item.price) / item.price) * 100).toFixed(2)} %</Text>
                                                            </Tag>
                                                        </Skeleton>
                                                    </Flex>
                                                )
                                            } else {
                                                return null
                                            }
                                        })}
                                        {item.highSeasons && item.highSeasons.filter(room => new Date(room.start_date)
                                            <= new Date() && new Date(room.end_date) > new Date()).length === 0 && (
                                                <Flex alignItems="center" gap="5px">
                                                    <Skeleton isLoaded={!loadingData}>
                                                        <Text fontSize="12px" fontFamily="sans-serif" color="#67a0d9">
                                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}
                                                        </Text>
                                                    </Skeleton>
                                                    <Skeleton isLoaded={!loadingData}>
                                                        <Tag size="md" variant='outline' color="#8eb2d4" cursor="pointer">
                                                            <TagLabel>Normal</TagLabel>
                                                            <TagRightIcon as={GiPriceTag} />
                                                        </Tag>
                                                    </Skeleton>
                                                </Flex>
                                            )}
                                    </Box>
                                </Flex>
                                <Divider borderColor="#808080" width="90%" marginTop="10px" />
                                <Flex marginTop="10px" alignItems="center" gap="5px">
                                    <Box bg="#d9efe4" width="70px" borderRadius="5px">
                                        <Skeleton isLoaded={!loadingData}>
                                            {item.availability ? (
                                                <Text color="#539372" textAlign="center" fontWeight="bold" fontFamily="sans-serif" onClick={() => handleDisableRoom(item)} cursor="pointer">Active</Text>
                                            ) : (
                                                <Text color="#5f5f5f" bg="#e5e5e5" textAlign="center" fontWeight="bold" fontFamily="sans-serif" onClick={() => handleAlvaibleRoom(item)} cursor="pointer">Disable</Text>
                                            )}
                                        </Skeleton>
                                    </Box>
                                    <Skeleton isLoaded={!loadingData}>
                                        <Text color="#a8a8a8" marginLeft="5px" fontSize="12px">Updated Nov 29</Text>
                                    </Skeleton>
                                    <Flex alignItems="center" cursor="pointer" onClick={() => dispatch(openModalCertainDate(item))}>
                                        <InputCertainDate />
                                        <Skeleton isLoaded={!loadingData}>
                                            <Text color="#5a93c9" marginLeft="20px" fontWeight="bold">Date</Text>
                                        </Skeleton>
                                        <Skeleton isLoaded={!loadingData}>
                                            <Icon as={AiOutlineCalendar} marginLeft="2px" color="#5a93c9" />
                                        </Skeleton>
                                    </Flex>
                                </Flex>
                            </Box>
                        </Box>
                        <Box bg="#f7f7f7" width="100%" marginTop="21.5px" height="25%" borderBottomRadius="10px">
                            <Box p={2}>
                                <Skeleton isLoaded={!loadingData}>
                                    <Text textAlign="center" fontFamily="sans-serif" color="#787878" fontWeight="bold">Settings</Text>
                                </Skeleton>
                                <Flex marginTop="10px" alignItems="center" justifyContent="center">
                                    <Flex flexDirection="column" alignItems="center" cursor="pointer" onClick={() => handleOpenDrawer(item)}>
                                        <Skeleton isLoaded={!loadingData}>
                                            <Text fontWeight="bold">Picture</Text>
                                        </Skeleton>
                                        <Skeleton isLoaded={!loadingData}>
                                            <Icon as={ImFilePicture} boxSize="24px" color="#3b3a3e" />
                                        </Skeleton>
                                        <Drawer
                                            isOpen={isOpenDrawer}
                                            placement='bottom'
                                            onClose={handleCloseDrawer}
                                            finalFocusRef={null}
                                            size="full"
                                        >
                                            <DrawerOverlay />
                                            <DrawerContent>
                                                <DrawerCloseButton onClick={handleCloseDrawer} />
                                                <DrawerHeader>Create more picture</DrawerHeader>

                                                <DrawerBody>
                                                    <Flex direction='column' align='center' m={4}>
                                                        <Box borderWidth='1px' borderColor='gray' rounded='lg' width='full' p={4}>
                                                            <Stack spacing={4} align='center'>
                                                                <Box as={AiOutlineCloudUpload} size='62px' color='blue.500' />
                                                                <Heading as='h3' size='md'>Drop your image here ..</Heading>
                                                            </Stack>
                                                            <Stack spacing={4} align='center' mt={4}>
                                                                <FormControl>
                                                                    <Input type="file" onChange={handlePictureChange} />
                                                                </FormControl>
                                                                {
                                                                    imageUrl &&
                                                                    <img src={imageUrl} alt="preview" width="auto" height="auto" />
                                                                }
                                                                <Text color="red">{msgAddPicture}</Text>
                                                                <Divider />
                                                            </Stack>
                                                        </Box>
                                                    </Flex>
                                                    {roomImages ? (roomImages.map((image, i) => (
                                                        <Flex justifyContent="center" alignItems="center" flexWrap="wrap" gap="10px">
                                                            <Card
                                                                direction={{ base: 'column', sm: 'row' }}
                                                                overflow='hidden'
                                                                variant='outline'
                                                            >
                                                                <Image
                                                                    objectFit='cover'
                                                                    maxW={{ base: '100%', sm: '200px' }}
                                                                    src={'http://localhost:2000/roomPicture/' + image.name}
                                                                    alt='Caffe Latte'
                                                                />

                                                                <Stack>
                                                                    <CardBody>
                                                                        <Heading size='md'>CreatedAt : {image.createdAt}</Heading>
                                                                        <Text py='2'>
                                                                            Your image type is : {image.type} <br />
                                                                            Your image size is : {image.size} bytes
                                                                        </Text>
                                                                    </CardBody>
                                                                    <CardFooter>
                                                                        <Button variant="outline" colorScheme="red" onClick={() => deleteRoomImages(image)}>
                                                                            Delete Picture
                                                                        </Button>
                                                                    </CardFooter>
                                                                </Stack>
                                                            </Card>
                                                        </Flex>
                                                    ))) : (<Text textAlign="center">Anda belum menambahkan foto untuk ruangan ini</Text>)}
                                                </DrawerBody>
                                                <DrawerFooter>
                                                    <Button variant='outline' mr={3} onClick={handleCloseDrawer}>
                                                        Cancel
                                                    </Button>
                                                    <Button colorScheme='blue' onClick={createManyRooms}>{load ? <Spinner /> : "Save"}</Button>
                                                </DrawerFooter>
                                            </DrawerContent>
                                        </Drawer>
                                    </Flex>
                                    <Icon as={RxDividerVertical} boxSize="40px" color="#eaeaea" />
                                    <Flex flexDirection="column" alignItems="center" cursor="pointer" onClick={() => OpenModalEdit(item)}>
                                        <Skeleton isLoaded={!loadingData}>
                                            <Text fontWeight="bold" cursor="pointer">Edit</Text>
                                        </Skeleton>
                                        <Skeleton isLoaded={!loadingData}>
                                            <Icon as={FaRegEdit} boxSize="24px" color="#3b3a3e" />
                                        </Skeleton>
                                        <Modal isOpen={openModal} onClose={CloseModalEdit}>
                                            <ModalOverlay />
                                            <ModalContent>
                                                <ModalHeader>Edit Rooms</ModalHeader>
                                                <ModalCloseButton />
                                                <ModalBody>
                                                    <Box>
                                                        {loadEdit ? <Center><Spinner /></Center> : (
                                                            <Box>
                                                                <Text fontWeight='bold' mb='1rem' color="red">
                                                                    {msgError}
                                                                </Text>
                                                                <FormControl>
                                                                    <FormLabel>Room Name</FormLabel>
                                                                    <Input variant="flushed" placeholder='Room name?' defaultValue={valueName}
                                                                        onChange={(e) => setName(e.target.value)}
                                                                    />
                                                                </FormControl>
                                                                <FormControl >
                                                                    <FormLabel>Description</FormLabel>
                                                                    <Input variant="flushed" placeholder='Description?' defaultValue={valueDesc}
                                                                        onChange={(e) => setDescription(e.target.value)}
                                                                    />
                                                                </FormControl>
                                                                <FormControl>
                                                                    <FormLabel>Price</FormLabel>
                                                                    <Input variant="flushed" placeholder='Price?' defaultValue={valuePrice}
                                                                        onChange={(e) => setPrice(e.target.value)}
                                                                    />
                                                                </FormControl>
                                                                <FormControl>
                                                                    <FormLabel>Picture</FormLabel>
                                                                    <Input type="file"
                                                                        variant="flushed"
                                                                        onChange={handlePictureChange}
                                                                    />
                                                                </FormControl>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button colorScheme='blue' mr={3} onClick={CloseModalEdit}>
                                                        Close
                                                    </Button>
                                                    <Button variant="outline" colorScheme="blue" onClick={updateRooms}>{load ? <Spinner /> : "Save"}</Button>
                                                </ModalFooter>
                                            </ModalContent>
                                        </Modal>
                                    </Flex>
                                    <Icon as={RxDividerVertical} boxSize="40px" color="#eaeaea" />
                                    <Flex flexDirection="column" alignItems="center" cursor="pointer" onClick={() => deleteRooms(item)}>
                                        <Skeleton isLoaded={!loadingData}>
                                            <Text fontWeight="bold">Delete</Text>
                                        </Skeleton>
                                        <Skeleton isLoaded={!loadingData}>
                                            <Icon as={AiFillDelete} boxSize="24px" color="#3b3a3e" />
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

export default RoomCard
