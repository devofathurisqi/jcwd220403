import React, { useState } from 'react'
import {
    Box, Button, Modal,
    ModalContent, ModalCloseButton, ModalHeader, ModalBody, Text,
    ModalFooter, Input, Spinner, ModalOverlay
} from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux"
import { closeModal } from '../../Redux/DeleteProperty'
import { isDeleteData } from '../../Redux/DoneCreatePropertiesSlice'
import { isDeletePropertyData } from '../../Redux/DoneCreatePropertiesSlice'
import axios from "../../api/axios"
import { useEffect } from 'react'
// import axios from "axios"

const DeleteProperty = () => {
    const dispatch = useDispatch()
    const isOpen = useSelector((state) => state.DeleteProperty.isOpen)
    const property = useSelector((state) => state.DeleteProperty.property)
    const [input, setInput] = useState("")
    const [load, setLoad] = useState(false)
    const [msg, setMsg] = useState("")
    const [lanjutkan, setLanjutkan] = useState(false)
    // msg === ""? setLanjutkan(false) : setLanjutkan(true)
    const validasi = property && `Delete Property ${property.name}`

    const commitDelete = () => {
        msg === ""? setLanjutkan(false) : setLanjutkan(true)
    }

    useEffect(() => {
        commitDelete()
    }, [msg])


    const deleteProperty = async () => {
        try {
            await axios.delete(`/deleteproperty/${property.id}`, {
                headers: {
                  'Content-Type': 'application/json'
                },
                data: {
                  lanjutkan: lanjutkan
                }
              })
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                setMsg("")
                dispatch(isDeleteData())
                dispatch(isDeletePropertyData())
                window.location.reload()
            }, 3000)
        } catch (err) {
            console.log(err)
            if (err.response) {
                setMsg(err.response.data)
            }
        }
    }

    const closeModalDelete = () => {
        dispatch(closeModal())
        setMsg("")
        setInput("")
    }

    return (
        <Box>
            <Modal isCentered isOpen={isOpen} onClose={closeModalDelete}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">Delete Your Property</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text textAlign="center" fontWeight="bold" color="red" fontFamily="sans-serif"
                            display={msg === "" ? "block" : "none"}
                        >Are you sure to delete all your property data in Holistay? to ensure input like the one below
                        </Text>
                        <Box boxShadow="md" p={2} display={msg === "" ? "none" : "block"}>
                            <Text textAlign="center" fontWeight="bold" borderBottom="1px solid gray" color="red">Pemberitahuan!</Text>
                            <Text marginTop="10px" textAlign="center" color="red">{msg}</Text>
                        </Box>
                        <Text textAlign="center" marginTop="5px" fontWeight="bold">{validasi}</Text>
                        <Input onChange={(e) => setInput(e.target.value)} textAlign="center" defaultValue={input} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={closeModalDelete} marginRight="10px" variant="outline" colorScheme="cyan">Close</Button>
                        {input === validasi ? <Button onClick={deleteProperty} cursor={msg === "You cannot delete because there is a transaction in progress"? "not-allowed" : "pointer"} backgroundColor="red.400" color="white">{load ? <Spinner /> : msg ===""? "Delete" : "Lanjutkan"}</Button> :
                            <Button isDisabled="true" opacity="0.5">Delete</Button>}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default DeleteProperty
