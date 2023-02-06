import React, { useState } from 'react'
import {
    Box, Flex, Image, Text, Button, useBreakpointValue,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Input, Spinner
} from "@chakra-ui/react"
import settingsPicture from "../../Assets/settings.jpg"
import useAuth from '../../hooks/useAuth'
import axios from '../../api/axios'
import { useNavigate } from "react-router-dom"
import Axios from "axios"

const Settings = () => {
    const { auth } = useAuth();
    console.log(auth)
    const [msg, setMsg] = useState("")
    const [input, setInput] = useState("")
    const createdAt = new Date(auth.createdAt)
    const now = new Date() - createdAt
    const diffDays = Math.ceil(now / (100 * 60 * 60 * 24))
    const validasiInput = `${auth.email}/${auth.name}`
    const navigate = useNavigate()
    const [load, setLoad] = useState(false)
    //formodal
    const [isOpen, setIsOpen] = useState(false)

    const directionFlex = useBreakpointValue({
        base: "column",
        md: "column",
        lg: "row"
    })
    const widthFlex = useBreakpointValue({
        base: "100%",
        md: "100%",
        lg: "50%"
    })

    const handleSubmit = async () => {
        try {
            await axios.delete(`/logoutTenant/${auth.tenantId}/${auth.email}`)
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                window.location.reload()
            }, 3000)
            // navigate("/")
        } catch (err) {
            console.log(err)
            if (err.response) {
                setMsg(err.response.data)
            }
        }
    }

    const closeModal = () => {
        setIsOpen(false)
        setMsg("")
        setInput("")
    }

    return (
        <Box p={6}>
            <Flex justifyContent="center" alignItems="center" flexDirection={directionFlex}>
                <Flex width={widthFlex}>
                    <Image src={settingsPicture} width="100%" margin="auto" />
                </Flex>
                <Flex width={widthFlex} flexDirection="column" flex="1">
                    <Box borderBottom="1px solid #0f0673">
                        <Text color="#0f0673" textAlign="center" fontSize="32px" fontFamily="sans-serif" letterSpacing="4px">Mengakhiri</Text>
                        <Text color="#0f0673" textAlign="center" fontSize="32px" fontFamily="sans-serif" letterSpacing="4px">Sebagai Tenant</Text>
                    </Box>
                    <Text marginTop="30px" color="#4649ee" fontFamily="sans-serif">
                        Halo {auth.name}, kami sangat menyesal jika ada hal yang membuat Anda ingin membatalkan status
                        sebagai tenant di Holistay.
                    </Text>
                    <Text marginTop="10px" color="#4649ee" fontFamily="sans-serif">
                        Sudah {diffDays} hari anda disini, dan holistay sangat berterima kasih atas partisipasi anda
                        untuk mempercayai holistay mengembangkan property anda, kami harap anda akan mempertimbagkan keputusan anda
                    </Text>
                    <Button marginTop="10px" width="100%" colorScheme="facebook" onClick={() => setIsOpen(true)}>Akhiri Sekarang</Button>


                    {/* -------------------Modal------------ */}

                    <Modal isOpen={isOpen} onClose={closeModal}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Megakhiri Sebagai Tenant</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Box boxShadow={msg===""? "" : "md"} marginBottom="5px" p={2}>
                                    <Text textAlign="center" color="red.400">{msg}</Text>
                                </Box>
                                <Text borderBottom="1px solid black" paddingBottom="5px" fontFamily="sans-serif" textAlign="center" fontWeight="bold">Dengan ini saya menyatakan untuk menghapus hubungan dengan holistay</Text>
                                <Text color="red.400" textAlign="center" marginBottom="5px">Tulis seperti contoh di bawah ini!</Text>
                                <Box boxShadow="md" p={2} marginBottom="5px">
                                    <Text textAlign="center">{validasiInput}</Text>
                                </Box>
                                <Input textAlign="center" onChange={(e) => setInput(e.target.value)} />
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="gray" mr={3} onClick={closeModal}>
                                    Close
                                </Button>
                                {input === validasiInput ?
                                    <Button colorScheme="red" onClick={handleSubmit}>{load ? <Spinner /> : "Delete!"}</Button>
                                    : <Button isDisabled="true">Delete!</Button>
                                }
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Settings
