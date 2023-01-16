import React, { useState, useEffect } from 'react'
import {
    Box, Flex, Text, Icon, useDisclosure,
    Modal, ModalBody, ModalOverlay, ModalFooter, ModalCloseButton, ModalContent,
    ModalHeader, Button, Input, FormControl, FormLabel, FormHelperText, Spinner,
    useToast, Image, Drawer, DrawerBody, DrawerCloseButton, DrawerOverlay, DrawerContent,
    DrawerHeader, DrawerFooter, Heading, Stack, Divider, Card, CardBody, CardFooter
} from "@chakra-ui/react"
import axios from '../../api/axios'
import { BsPlusSquareDotted } from "react-icons/bs"
import { BiEdit } from "react-icons/bi"
import { AiOutlineDelete, AiOutlineCloudUpload } from "react-icons/ai"
import { ImFilePicture } from "react-icons/im"
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';


const ComponentDashboardTwo = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState()
    const [picture, setPicture] = useState(null);
    const [msgError, setMsgError] = useState("")
    const [load, setLoad] = useState(false)

    const isErrorName = name === ""
    const isErrorDesc = description === ""
    const isErrorPrice = price === undefined

    //for uupdate data
    const [valueName, setValueName] = useState("")
    const [valueDesc, setValueDesc] = useState("")
    const [valuePrice, setValuePrice] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const [editId, setEditId] = useState(0)
    const [msgAddPicture, setMsgAddPicture] = useState("")

    //everything for picture or images
    const [roomId, setRoomId] = useState(0)
    const [imageUrl, setImageUrl] = useState(null)
    const [dataImages, setDataImages] = useState()
    // console.log(dataImages)
    const [imageForSlider, setImageForSlider] = useState()
    console.log(imageForSlider)

    //for delete data
    const toast = useToast()


    const getDataRoom = async () => {
        try {
            const response = await axios.get("/getallpictureroom/1")
            setImageForSlider(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const getDataImagesRoom = async () => {
        try {
            const response = await axios.get(`/roomimages/${roomId}`)
            setDataImages(response.data[0].images)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getDataRoom()
    }, [])

    useEffect(() => {
        getDataImagesRoom()
    }, [roomId])

    const AfterSendData = () => {
        setMsgError("")
        setName("")
        setDescription("")
        setPrice(undefined)
        setPicture(null)
        setImageUrl(null);
        setMsgAddPicture("")
    }

    const Open = async (room) => {
        const value = await axios.get(`/roombyid/${room.id}`, {
            withCredentials: true
        })
        setEditId(room.id)
        setValueName(value.data.name)
        setValueDesc(value.data.description)
        setValuePrice(value.data.price)
        setOpenModal(true)
    }
    const Close = () => {
        setOpenModal(false)
    }

    const handlePictureChange = (e) => {
        setPicture(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]))
    }

    const createDataRooms = async () => {
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('price', price)
            formData.append('file', picture)

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            await axios.post("/room/1", formData, config, {
                withCredentials: true
            })
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                onClose(true)
                getDataRoom()
                AfterSendData()
            }, 3000)
        } catch (err) {
            console.log(err)
            if (err.response) {
                setMsgError(err.response.data)
            }
        }
    }
    const updateRooms = async () => {
        try {
            const formData = new FormData()

            formData.append('name', name)
            formData.append('description', description)
            formData.append('price', price)
            formData.append('file', picture)

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            await axios.patch(`editroom/${editId}`, formData, config, {
                withCredentials: true
            })
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                setOpenModal(false)
                getDataRoom()
                AfterSendData()
            }, 3000)
        } catch (err) {
            console.log(err)
            if (err.response) {
                setMsgError(err.response.data)
            }
        }
    }

    const createManyRooms = async () => {
        try {
            const formData = new FormData()
            formData.append('file', picture)
            formData.append('roomId', roomId)

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            await axios.post("addmanyimageroom", formData, config, {
                withCredentials: true
            })
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                setIsOpenDrawer(false)
                getDataRoom()
                getDataImagesRoom()
                AfterSendData()
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

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setImageUrl(null);
        setDataImages(null)
    }
    const handleOpenDrawer = (room) => {
        setIsOpenDrawer(true)
        setRoomId(room.id)
    }

    const deleteRooms = async (room) => {
        try {
            await axios.delete(`/deleteroom/${room.id}`)
            getDataRoom()
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

    const deleteRoomImages = async (image) => {
        try {
            await axios.delete(`/deleteroomimage/${image.id}`)
            getDataImagesRoom()
            getDataRoom()
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

    return (
        <Box>
            <Box p={6}>
                <Flex flexWrap="wrap" gap="10px" justifyContent="center">
                    {imageForSlider && imageForSlider.map(room => (
                        <Box width="350px" borderWidth="1px" rounded="lg" overflow="hidden" mb={4} key={room.id}>
                            <Flex px={6} py={4}>
                                <Flex flexDirection="column" gap="20px">
                                    <Icon
                                        as={BiEdit}
                                        alt="Card image"
                                        boxSize="30px"
                                        objectFit="cover"
                                        cursor="pointer"
                                        alignItems="flex-start"
                                        onClick={() => Open(room)}
                                    />
                                    <Modal blockScrollOnMount={false} isOpen={openModal} onClose={Close}>
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>Edit Rooms</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                <Text fontWeight='bold' mb='1rem' color="red">
                                                    {msgError}
                                                </Text>
                                                <FormControl isInvalid={isErrorName} >
                                                    <FormLabel>Room Name</FormLabel>
                                                    <Input variant="flushed" placeholder='Room name?' defaultValue={valueName}
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
                                                    {isErrorName ? (<FormHelperText color="red">Room name is required</FormHelperText>) :
                                                        (<FormHelperText color="#478fd3">Update room name is success</FormHelperText>)}
                                                </FormControl>
                                                <FormControl isInvalid={isErrorDesc} >
                                                    <FormLabel>Description</FormLabel>
                                                    <Input variant="flushed" placeholder='Description?' defaultValue={valueDesc}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                    />
                                                    {isErrorDesc ? (<FormHelperText color="red">Description is required</FormHelperText>) :
                                                        (<FormHelperText color="#478fd3">Update description success</FormHelperText>)}
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Price</FormLabel>
                                                    <Input variant="flushed" placeholder='Price?' defaultValue={valuePrice}
                                                        onChange={(e) => setPrice(e.target.value)}
                                                    />
                                                    {isErrorPrice ? (<FormHelperText color="red">Price is required</FormHelperText>) :
                                                        (<FormHelperText color="#478fd3">Update price success</FormHelperText>)}
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Picture</FormLabel>
                                                    <Input type="file"
                                                        variant="flushed"
                                                        onChange={handlePictureChange}
                                                    />
                                                </FormControl>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button colorScheme='blue' mr={3} onClick={Close}>
                                                    Close
                                                </Button>
                                                <Button variant="outline" colorScheme="blue" onClick={updateRooms}>{load ? <Spinner /> : "Save"}</Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                    <Icon
                                        as={AiOutlineDelete}
                                        alt="Card image"
                                        boxSize="30px"
                                        objectFit="cover"
                                        cursor="pointer"
                                        onClick={() => deleteRooms(room)}
                                    />
                                    <Icon
                                        as={ImFilePicture}
                                        alt="Card image"
                                        boxSize="30px"
                                        objectFit="cover"
                                        cursor="pointer"
                                        onClick={() => handleOpenDrawer(room)}
                                    />
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
                                                {dataImages ? (dataImages.map((image, i) => (
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
                                <Box marginLeft="30px">
                                    <Carousel
                                        autoPlay
                                        infiniteLoop
                                        showArrows={true}>
                                        {room.images.map((image, i) => (
                                            <Box key={i}>
                                                <Image src={`http://localhost:2000/roomPicture/${image.picture}`} />
                                            </Box>
                                        ))}
                                    </Carousel>
                                    <Text fontSize="xl" fontWeight="bold">
                                        {room.name}
                                    </Text>
                                    <Text color="gray.600" mt={1}>
                                        {room.description}
                                    </Text>
                                    <Text mt={2} fontSize="lg" fontWeight="bold" color="teal.500">
                                        Rp.{room.price}
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    ))}
                    <Box width="200px" height="129px" position="relative">
                        <Box position="absolute" left="40%" top="30%">
                            <Icon as={BsPlusSquareDotted} boxSize={10} cursor="pointer" onClick={onOpen} />
                        </Box>
                    </Box>
                    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Create Property Rooms</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Text fontWeight='bold' mb='1rem' color="red">
                                    {msgError}
                                </Text>
                                <FormControl isInvalid={isErrorName} >
                                    <FormLabel>Room Name</FormLabel>
                                    <Input variant="flushed" placeholder='Room name?'
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    {isErrorName ? (<FormHelperText color="red">Room name is required</FormHelperText>) :
                                        (<FormHelperText color="#478fd3">Create room name is success</FormHelperText>)}
                                </FormControl>
                                <FormControl isInvalid={isErrorDesc} >
                                    <FormLabel>Description</FormLabel>
                                    <Input variant="flushed" placeholder='Description?'
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    {isErrorDesc ? (<FormHelperText color="red">Description is required</FormHelperText>) :
                                        (<FormHelperText color="#478fd3">Create description success</FormHelperText>)}
                                </FormControl>
                                <FormControl isInvalid={isErrorPrice}>
                                    <FormLabel>Price</FormLabel>
                                    <Input variant="flushed" placeholder='Price?'
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                    {isErrorPrice ? (<FormHelperText color="red">Price is required</FormHelperText>) :
                                        (<FormHelperText color="#478fd3">Create price success</FormHelperText>)}
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Picture</FormLabel>
                                    <Input type="file"
                                        variant="flushed"
                                        onChange={handlePictureChange}
                                    />
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="facebook" mr={3} onClick={onClose}>
                                    Close
                                </Button>
                                <Button variant='ghost' colorScheme="blue" onClick={createDataRooms}>{load ? <Spinner /> : "Submit"}</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Flex>
            </Box>
        </Box>
    )
}

export default ComponentDashboardTwo
