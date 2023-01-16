import React, { useState } from 'react'
import { Box, Text, Center, FormControl, FormLabel, Input, FormHelperText, Spinner, Button, useMediaQuery, useBreakpointValue } from "@chakra-ui/react"
import axios from "../../api/axios"
import { BsCheckLg } from "react-icons/bs"
import { useDispatch } from "react-redux"
import { submitClickedToFalse } from '../../Redux/ButtonSlice';
import { motion } from "framer-motion"

const InputRoom = () => {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState()
    const [picture, setPicture] = useState(null);
    const [load, setLoad] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [checklis, setChecklist] = useState(false)

    const isErrorName = name === ""
    const isErrorDesc = description === ""
    const isErrorPrice = price === undefined

    const width = useBreakpointValue({
        base: "300px",
        md: "500px",
        lg: "500px"
    })
    const dispatch = useDispatch()

    const handlePictureChange = (e) => {
        setPicture(e.target.files[0]);
    }

    const handleSubmit = async () => {
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
                setChecklist(true)
                dispatch(submitClickedToFalse())
            }, 3000)
        } catch (err) {
            console.log(err)
            if (err.response) {
                setErrorMsg(err.response.data)
            }
        }
    }
    return (
        <Box>
            <Box>
                <Text fontFamily="Uniform Pro Medium" fontSize="32px" fontWeight="bold" textAlign="center">Room Detail</Text>
                <Text fontFamily="Uniform Pro Medium" fontSize="32px" fontWeight="bold" textAlign="center">untuk properti anda</Text>
            </Box>
            <Center>
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.7 }}
                >

                    <Box boxShadow="lg" border="2px solid white" borderRadius="10px" width={width} textAlign="center" padding="20px">
                        <form onSubmit={handleSubmit}>
                            <FormControl isInvalid={isErrorName} >
                                <FormLabel>Room Name</FormLabel>
                                <Input variant="flushed" placeholder='Room name?' value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {isErrorName ? (<FormHelperText color="red">Room name is required</FormHelperText>) :
                                    (<FormHelperText color="#478fd3">Create room name is success</FormHelperText>)}
                            </FormControl>
                            <FormControl isInvalid={isErrorDesc} >
                                <FormLabel>Description</FormLabel>
                                <Input variant="flushed" placeholder='Description?' value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                {isErrorDesc ? (<FormHelperText color="red">Description is required</FormHelperText>) :
                                    (<FormHelperText color="#478fd3">Create description success</FormHelperText>)}
                            </FormControl>
                            <FormControl isInvalid={isErrorPrice}>
                                <FormLabel>Price</FormLabel>
                                <Input variant="flushed" placeholder='Price?' value={price}
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
                            <Text color="red" marginTop="10px" textAlign='center'>{errorMsg}</Text>
                            <Center>
                                <Center>
                                    {load ? (
                                        <Button onClick={handleSubmit} backgroundColor="white" color="black"
                                            padding="25px" _hover={{ fontWeight: "bold" }} marginTop="10px" marginBottom="10px" isDisabled="true">
                                            <Spinner color="black" />
                                        </Button>
                                    ) : (
                                        <Button onClick={handleSubmit} backgroundColor="white" color="black"
                                            marginTop="10px" marginBottom="10px" padding="25px" _hover={{ fontWeight: "bold" }}
                                            style={{ border: checklis ? "" : "2px solid black" }} borderRadius="20px" isDisabled={checklis}>
                                            {checklis ? <BsCheckLg /> : "Submit"}
                                        </Button>
                                    )}
                                </Center>
                            </Center>
                            <br />
                            <br />
                            <br />
                        </form>
                    </Box>
                </motion.div>
            </Center>
        </Box>
    )
}

export default InputRoom
