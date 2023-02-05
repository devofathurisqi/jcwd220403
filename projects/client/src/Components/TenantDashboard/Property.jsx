import React, { useEffect, useState } from 'react'
import {
    Box, Divider, Flex, Text, Icon, Spacer, useBreakpointValue,
    Menu, MenuButton, Portal, MenuList, MenuItem
} from "@chakra-ui/react"
import { RiDashboardFill } from "react-icons/ri"
import { useDispatch } from "react-redux"
import { AiOutlineDown } from "react-icons/ai"
import { Link } from "react-router-dom"
import { activeBestSeller, activeStatus, activeNotSold, Sort } from '../../Redux/FilterProperty'

//import component
import CardProperty from './CardProperty'

const Property = () => {
    const [indexAcctive, setIndexAcctive] = useState(0)
    const [sortBy, setSortBy] = useState("Newest to Oldest")
    const [listItemSort, setListItemSort] = useState("Oldest to Newest")
    const dispatch = useDispatch()

    const flexDisplay = useBreakpointValue({
        base: "none",
        md: "block",
        lg: "block"
    })
    const justifyContent = useBreakpointValue({
        base: "center",
        md: "",
        lg: ""
    })
    const indexActiveStatusAll = () => {
        setIndexAcctive(0)
        dispatch(activeStatus())
    }
    const indexActiveBestSeller = () => {
        setIndexAcctive(1)
        dispatch(activeBestSeller())
    }
    const indexActiveNotSold = () => {
        setIndexAcctive(2)
        dispatch(activeNotSold())
    }

    const RenderComponent = () => {
        return (
            <CardProperty />
        )
    }

    const handleMenuButton = () => {
        if (sortBy === "Newest to Oldest") {
            setListItemSort("Oldest to Newest")
        } else if (listItemSort === "Oldest to Newest") {
            setListItemSort("Newest to Oldest")
        }
    }
    const handleMenuItem = () => {
        if (listItemSort === "Oldest to Newest") {
            setSortBy("Oldest to Newest")
            dispatch(Sort("ASC"))
        } else if (listItemSort === "Newest to Oldest") {
            setSortBy("Newest to Oldest")
            dispatch(Sort("DESC"))
        }
    }

    return (
        <Box p={12}>
            <Text fontWeight="bold" fontSize="26px">Properties</Text>
            <Flex borderBottom="2px solid #f0f0f0" paddingBottom="10px" flexWrap="wrap" justifyContent="center" gap="5px">
                <Box border="2px solid #ededed" borderRadius="10px" width="max-content" marginTop="10px">
                    <Flex p={2}>
                        <Flex gap="5px" alignItems="center" cursor="pointer" onClick={indexActiveStatusAll}>
                            <Text color={indexAcctive === 0 ? "#176dc8" : "#c6c6c6"} >Status All</Text>
                            <Divider borderColor="#c6c6c6" orientation='vertical' marginLeft="5px" />
                        </Flex>
                        <Flex gap="5px" alignItems="center" marginLeft="5px" cursor="pointer" onClick={indexActiveBestSeller}>
                            <Text color={indexAcctive === 1 ? "#176dc8" : "#c6c6c6"}>Best Seller</Text>
                            <Divider borderColor="#c6c6c6" orientation='vertical' marginLeft="5px" />
                        </Flex>
                        <Flex gap="5px" alignItems="center" marginLeft="5px" cursor="pointer" onClick={indexActiveNotSold}>
                            <Text color={indexAcctive === 2 ? "#176dc8" : "#c6c6c6"}>Not Sold Yet</Text>
                            <Divider borderColor="#c6c6c6" orientation='vertical' marginLeft="5px" />
                        </Flex>
                    </Flex>
                </Box>
                <Box border="2px solid #ededed" borderRadius="10px" width="max-content" marginTop="10px">
                    <Link to='/tenant/add-property'>
                        <Flex p={2} justifyContent="center" alignItems="center" cursor="pointer">
                            <Flex alignItems="center" gap="5px" textAlign="center">
                                <Text color="#999999" fontFamily="sans-serif">More</Text>
                                <Text color="#999999" fontFamily="sans-serif">Property</Text>
                                <Icon as={RiDashboardFill} color="#176dc8" boxSize="25px" />
                            </Flex>
                        </Flex>
                    </Link>
                </Box>
                <Spacer display={flexDisplay} />
                <Box border="2px solid #ededed" borderRadius="10px" width="max-content" marginTop="10px" >
                    <Flex p={2} justifyContent="center" alignItems="center" gap="5px" >
                        <Text color="#999999" fontFamily="sans-serif">Sort By</Text>
                        <Menu>
                            <MenuButton onClick={handleMenuButton}>
                                <Flex alignItems="center" justifyContent="space-between">
                                    <Text color="#575758" fontFamily="sans-serif" fontWeight="bold" marginRight="5px">{sortBy}</Text>
                                    <Icon as={AiOutlineDown} color="#878787" boxSize="20px" />
                                </Flex>
                            </MenuButton>
                            <Portal>
                                <MenuList marginTop="5px">
                                    <MenuItem onClick={handleMenuItem}>{listItemSort}</MenuItem>
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

export default Property