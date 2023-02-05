import React, { useState } from 'react'
import {
    Box, Flex, Image, Text, Button, AlertDialog,
    AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody,
    AlertDialogFooter, FormControl, FormLabel, Input, FormHelperText,
    Center, Spinner, useToast, useBreakpointValue, useMediaQuery
} from '@chakra-ui/react'
import room from "../../Assets/room.jpg"
import { useSelector } from "react-redux"
import axios from "../../api/axios"

const MoreRooms = () => {
    const [moreRooms, setMoreRooms] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const nameProperty = useSelector((state) => state.PropertySlice.value.name)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState()
    const [picture, setPicture] = useState(null);
    const [msgError, setMsgError] = useState("")
    const [load, setLoad] = useState(false);

    const isErrorName = name === ""
    const isErrorDesc = description === ""
    const isErrorPrice = price === undefined

    const toast = useToast()

    const handleMoreRooms = () => {
        setMoreRooms(true)
        setAlertOpen(false)
    }

    const handlePictureChange = (e) => {
        setPicture(e.target.files[0]);
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
                    'Content-Type': 'multipart/form-data',
                    withCredentials: true
                }
            }

            await axios.post(`/room?name=${nameProperty}`, formData, config)
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                setName("")
                setDescription("")
                setPrice()
                setPicture(null)
                setMsgError("")
                toast({
                    title: 'Success',
                    description: 'Room has been created',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                setMoreRooms(false)
            }, 3000)
        } catch (err) {
            console.log(err)
            if (err.response) {
                setMsgError(err.response.data)
            }
        }
    }

    const Alert = () => {
        return (
            <>
                <AlertDialog
                    isOpen={alertOpen}
                    onClose={() => setAlertOpen(false)}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Perhatian!
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                <Text>Apakah anda yakin untuk membuat room di property {nameProperty}?</Text>
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button onClick={handleMoreRooms} colorScheme="blue" variant="outline">
                                    Lanjutkan
                                </Button>
                                <Button colorScheme='red' onClick={() => setAlertOpen(false)} ml={3} variant="outline">
                                    Cancel
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </>
        )
    }

    const Direction = useBreakpointValue({
        base: "column",
        md: "column",
        lg: "row"
    })

    const width = useBreakpointValue({
        base: "100%",
        md: "100%",
        lg: "100%"
    })

    const marginTop = useBreakpointValue({
        base: "10px",
        md: "10px",
        lg: ""
    })

    const displayText = useBreakpointValue({
        base: "none",
        md : "none",
        lg : "block"
    })

    const padding = useBreakpointValue({
        base : 5,
        md : 10,
        lg: 10
    })

    return (
        <Box>
            <Flex marginTop="10px" bg="#efefed" borderRadius="10px" p={padding} height="max-content" flexDirection={Direction}>
                <Box width={width} >
                    <Text fontSize="xl" fontWeight="medium" mb={4}>Tambahkan Room untuk Property Anda</Text>
                    <Text mb={4}>Dengan menambahkan room baru, anda dapat meningkatkan kapasitas property anda dan memperluas pangsa pasar anda. Ini akan membuat property anda lebih menarik bagi calon tamu dan meningkatkan pendapatan anda.</Text>
                    <Text mb={4} display={displayText}>Tambahkan room dengan fasilitas yang sesuai dengan kebutuhan calon tamu, seperti kamar mandi pribadi, dapur, atau akses internet yang cepat. Ini akan meningkatkan nilai tawar property anda dan meningkatkan kemungkinan calon tamu untuk memesan.</Text>
                    {moreRooms ? (
                        <Center>
                            <Button backgroundColor="white" color="black" mt={4} width="90%" onClick={createDataRooms}>
                                {load ? <Spinner /> : "Save"}
                            </Button>
                        </Center>
                    ) : (
                        <Center>
                            <Button colorScheme="facebook" mt={4} onClick={() => setAlertOpen(true)}>
                                Create Room
                            </Button>
                        </Center>
                    )}
                    <Alert />
                </Box>
                <Box width={width} marginTop={marginTop}>
                    {moreRooms ? (
                        <Flex flexDirection="column" gap="10px" backgroundColor="white" height="max-content" p={4} borderRadius="10px">
                            <Text color="red.400" textAlign="center">{msgError}</Text>
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
                        </Flex>
                    ) : (
                        <Image src={room} alt="property with rooms" boxShadow="md" />
                    )}
                </Box>
            </Flex>
        </Box>
    )
}

export default MoreRooms
