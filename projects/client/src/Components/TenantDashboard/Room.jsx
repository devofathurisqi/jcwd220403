import React, { useState } from 'react'
import {
    Box, Divider, Flex, Text, Icon, Spacer, useBreakpointValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Portal,
    useMediaQuery
} from "@chakra-ui/react"
import { MdOutlineBedroomChild } from "react-icons/md"
import { AiOutlineDown } from "react-icons/ai"
import axios from "../../api/axios"
import useAuth from '../../hooks/useAuth'
import { useDispatch } from "react-redux"
import { getName } from '../../Redux/PropertySlice'
import { useEffect } from 'react'

//import component
import RoomCard from './RoomCard'
import MoreRooms from './MoreRooms'


const Room = () => {
    const [indexAcctive, setIndexAcctive] = useState(0)
    const [nameProperty, setNameProperty] = useState([])
    const [propertyBy, setPropertyBy] = useState()
    const { auth } = useAuth();
    const dispatch = useDispatch()

    const getNameProperty = async () => {
        try {
            const response = await axios.get(`/getNamesProperty/${auth.tenantId}`)
            setNameProperty(response.data)
            setPropertyBy(response.data[0].name)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getNameProperty()
    }, [])

    useEffect(() => {
        dispatch(getName(propertyBy))
    }, [propertyBy])


    const RenderComponent = () => {
        if (indexAcctive === 0) {
            return (
                <RoomCard />
            )
        } else if (indexAcctive === 3) {
            return (
                <MoreRooms />
            )
        }
    }

    const flexDisplay = useBreakpointValue({
        base: "none",
        md: "block",
        lg: "block"
    })
    const [isMobile] = useMediaQuery('(max-width: 481px)');

    return (
        <Box p={12}>
            <Text fontWeight="bold" fontSize="26px">Room List</Text>
            <Flex borderBottom="2px solid #f0f0f0" paddingBottom="10px" flexWrap="wrap" justifyContent="center">
                <Box border="2px solid #ededed" borderRadius="10px" width="max-content" marginTop="10px">
                    <Flex p={2}>
                        <Flex gap="5px" alignItems="center" cursor="pointer" onClick={() => setIndexAcctive(0)}>
                            <Text color={indexAcctive === 0 ? "black" : "#c6c6c6"}>Status</Text>
                            <Box>
                                <Flex gap="5px">
                                    <Text color={indexAcctive === 0 ? "black" : "#c6c6c6"}>All</Text>
                                    <Box borderRadius="30px" backgroundColor={indexAcctive === 0 ? "#106fd2" : "#dbdbdd"}
                                        width="25px" textAlign="center" color={indexAcctive === 0 ? "white" : "#c6c6c6"}>8</Box>
                                </Flex>
                            </Box>
                            <Divider borderColor="#c6c6c6" orientation='vertical' marginLeft="5px" />
                        </Flex>
                        <Flex gap="5px" alignItems="center" marginLeft="5px" cursor="pointer" onClick={() => setIndexAcctive(1)}>
                            <Text color={indexAcctive === 1 ? "black" : "#c6c6c6"}>Active</Text>
                            <Box>
                                <Flex gap="5px">
                                    <Box borderRadius="30px" backgroundColor={indexAcctive === 1 ? "#106fd2" : "#dbdbdd"}
                                        width="25px" textAlign="center" color={indexAcctive === 1 ? "white" : "#c6c6c6"}>3</Box>
                                </Flex>
                            </Box>
                            <Divider borderColor="#c6c6c6" orientation='vertical' marginLeft="5px" />
                        </Flex>
                        <Flex gap="5px" alignItems="center" marginLeft="5px" cursor="pointer" onClick={() => setIndexAcctive(2)}>
                            <Text color={indexAcctive === 2 ? "black" : "#c6c6c6"}>{isMobile? "Off" : "Off Market"}</Text>
                            <Box>
                                <Flex gap="5px">
                                    <Box borderRadius="30px" backgroundColor={indexAcctive === 2 ? "#106fd2" : "#dbdbdd"}
                                        width="25px" textAlign="center" color={indexAcctive === 2 ? "white" : "#c6c6c6"}>2</Box>
                                </Flex>
                            </Box>
                            <Divider borderColor="#c6c6c6" orientation='vertical' marginLeft="5px" />
                        </Flex>
                        <Flex gap="5px" alignItems="center" marginLeft="5px" cursor="pointer" onClick={() => setIndexAcctive(3)}>
                            <Text color={indexAcctive === 3 ? "black" : "#c6c6c6"}>{isMobile? "More?" : "More Rooms"}</Text>
                            <Box>
                                <Flex gap="5px">
                                    <Box borderRadius="30px" backgroundColor={indexAcctive === 3 ? "#106fd2" : "#dbdbdd"}
                                        width="30px" textAlign="center" color={indexAcctive === 3 ? "white" : "#c6c6c6"}
                                        display="flex" justifyContent="center" alignItems="center" height="25px">
                                        <Icon as={MdOutlineBedroomChild} margin="auto" />
                                    </Box>
                                </Flex>
                            </Box>
                        </Flex>
                    </Flex>
                </Box>
                <Spacer display={flexDisplay} />
                <Box border="2px solid #ededed" borderRadius="10px" width="max-content" marginTop="10px" >
                    <Flex p={2} justifyContent="center" alignItems="center" gap="5px" >
                        <Text color="#999999" fontFamily="sans-serif">Property by</Text>
                        <Menu>
                            <MenuButton>
                                <Flex alignItems="center" justifyContent="space-between">
                                    <Text color="#575758" fontFamily="sans-serif" fontWeight="bold">{propertyBy}</Text>
                                    <Icon as={AiOutlineDown} color="#878787" boxSize="20px" />
                                </Flex>
                            </MenuButton>
                            <Portal>
                                <MenuList marginTop="5px">
                                    {nameProperty.map((item, index) => (
                                        <MenuItem key={index} onClick={() => setPropertyBy(item.name)}>{item.name}</MenuItem>
                                    ))}
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Flex>
                </Box>
            </Flex>
            <RenderComponent />
        </Box>
    )
}

export default Room