import React, { useState } from 'react'
import {
    Box, Drawer, DrawerOverlay, DrawerContent,
    DrawerFooter, DrawerCloseButton, DrawerBody, Flex, DrawerHeader,
    Stack, FormControl, Heading, Image, Card, Text, Divider, Button,
    useToast, Input, Spinner, CardBody, CardFooter

} from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux"
import { closeDrawerForMorePicture, setPicture, resetPicture } from '../../Redux/MorePictureProperty'
import axios from "../../api/axios"
import useAuth from '../../hooks/useAuth'
import { AiOutlineCloudUpload } from "react-icons/ai"
import { useEffect } from 'react'

const InputMorePictureProperty = () => {
    const dispatch = useDispatch()
    const openDrawer = useSelector((state) => state.MorePictureProperty.isDrawerOpen)
    const picture = useSelector((state) => state.MorePictureProperty.picture)
    const imageUrl = useSelector((state) => state.MorePictureProperty.imageUrl)
    const [msgAddPicture, setMsgAddPicture] = useState("")
    const [load, setLoad] = useState(false)
    const [dataImages, setDataImages] = useState()
    const toast = useToast()
    const { auth } = useAuth();

    const getImagesProperty= async () => {
        try {
            const response = await axios.get(`/getmorePictureProperty/${auth.tenantId}`)
            setDataImages(response.data[0].propertypictures)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getImagesProperty()
    }, [])

    const handlePictureChange = (e) => {
        const picture = e.target.files[0];
        const imageUrl = URL.createObjectURL(e.target.files[0]);
        dispatch(setPicture({ picture, imageUrl }))
    }

    const handleSubmit = async () => {
        try {
            const formData = new FormData()
            formData.append('file', picture)

            await axios.post(`/createMorePictureProperty/${auth.tenantId}`, formData, {
                withCredentials: true
            })
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                dispatch(closeDrawerForMorePicture())
                getImagesProperty()
                window.location.reload()
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

    const deletePropertyImages = async (image) => {
        try {
            await axios.delete(`/deletepropertyimage/${image.id}`)
            getImagesProperty()
            window.location.reload()
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
            <Drawer
                isOpen={openDrawer}
                placement='bottom'
                onClose={() => dispatch(closeDrawerForMorePicture())}
                finalFocusRef={null}
                size="full"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton onClick={() => dispatch(closeDrawerForMorePicture())} />
                    <DrawerHeader textAlign="center" fontFamily="poppins">Create more picture for your property</DrawerHeader>

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
                                    key={i}
                                >
                                    <Image
                                        objectFit='cover'
                                        maxW={{ base: '100%', sm: '200px' }}
                                        src={'http://localhost:2000/propertyPicture/' + image.name}
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
                                            <Button variant="outline" colorScheme="red" onClick={() => deletePropertyImages(image)}>
                                                Delete Picture
                                            </Button>
                                        </CardFooter>
                                    </Stack>
                                </Card>
                            </Flex>
                        ))) : (<Text textAlign="center">Anda belum menambahkan foto untuk ruangan ini</Text>)}
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={() => dispatch(closeDrawerForMorePicture())}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue' onClick={handleSubmit}>{load ? <Spinner /> : "Save"}</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}

export default InputMorePictureProperty
