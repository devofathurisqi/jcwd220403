import React from 'react'
import {
    Box, Input, Button, Icon, Text, Flex, Spacer,
    InputLeftElement, InputGroup, Divider, Avatar,
    useMediaQuery, MenuButton, Menu, MenuList, MenuItem, IconButton, Tag, MenuDivider,
} from "@chakra-ui/react"
import { HamburgerIcon, AddIcon, ExternalLinkIcon, RepeatIcon, EditIcon } from "@chakra-ui/icons"
import { BsFillLightningFill } from "react-icons/bs"
import { AiOutlineSearch, AiOutlineBell } from "react-icons/ai"
import { IoIosHelpCircleOutline } from "react-icons/io"
import useAuth from '../../hooks/useAuth'
import { useDispatch } from "react-redux"
import { Link } from 'react-router-dom'
import { getIndex } from '../../Redux/PropertySlice'

const NavbarDashboard = () => {
    const { auth } = useAuth();
    const [isMobile] = useMediaQuery('(max-width: 481px)');
    const dispatch = useDispatch()

    const listItem = [
        { name: "Dashboard" },
        { name: "Properties" },
        { name: "Room List" },
        { name: "Resident & Leases" },
        { name: "Message" },
        { name: "Transactions" },
        { name: "Report" },
        { name: "Settings" }
    ]

    return (
        <Box bg="#122b45" p={4}>
            {isMobile ? (
                <Flex>
                    <Flex alignItems="center" gap="20px">
                        <Text fontWeight="bold" color="white" fontFamily="sans-serif">Holistay</Text>
                        <InputGroup width="80%" variant="flushed">
                            <InputLeftElement
                                pointerEvents='none'
                                children={<AiOutlineSearch color="white" />}
                            />
                            <Input placeholder={isMobile ? "Search.." : "Search properties, lease and more"} border="none" _placeholder={{ color: "white", fontFamily: "sans-serif" }} color="white" />
                        </InputGroup>
                    </Flex>
                    <Spacer />
                    <Flex alignItems="center">
                        <Menu colorScheme="white">
                            <MenuButton>
                                <MenuButton w='70px'>
                                    <Tag
                                        bgColor='white'
                                        w='40'
                                        h='10'
                                        borderRadius='full'
                                        border='1px'
                                        borderColor='gray.300'
                                        _hover={{ cursor: 'pointer' }}
                                    >
                                        <Icon as={HamburgerIcon} mr='2' ml='1' />
                                        {auth?.userPhoto ? (
                                            <Avatar
                                                size='sm'
                                                name='A'
                                                bgColor='#FE9900'
                                                src={
                                                    'http://localhost:2000/profilePicture/' +
                                                    auth?.userPhoto
                                                }
                                            />
                                        ) : (
                                            <Avatar size='sm' name='A' bgColor='#FE9900' />
                                        )}
                                    </Tag>
                                </MenuButton>
                            </MenuButton>
                            <MenuList zIndex={2}>
                                {listItem.map((item, index) => (
                                    <MenuItem onClick={() => dispatch(getIndex(index))}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                                <MenuDivider />
                                <MenuItem >
                                    Help Center
                                </MenuItem>
                                <MenuItem>
                                    Provide Feedback
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>

            ) : (
                <Flex>
                    <Flex width="40%" alignItems="center" gap="20px">
                        <Text fontWeight="bold" color="white" fontFamily="sans-serif">Holistay</Text>
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents='none'
                                children={<AiOutlineSearch color="white" />}
                            />
                            <Input placeholder="Search properties, lease and more" border="none" _placeholder={{ color: "white", fontFamily: "sans-serif" }} color="white" />
                        </InputGroup>
                    </Flex>
                    <Spacer />
                    <Flex gap="10px" alignItems="center">
                        <Button borderBottom="1px solid" bg="#0d70d9" leftIcon={<Icon as={BsFillLightningFill} color="white" />} color="white" fontFamily="sans-serif">
                            Quick Actions
                        </Button>
                        <Divider orientation='vertical' borderColor="white" />
                        <Icon as={AiOutlineBell} color="white" boxSize="20px" />
                        <Icon as={IoIosHelpCircleOutline} color="white" boxSize="20px" />
                        <Link to="/user">
                            {auth?.userPhoto ? (
                                <Avatar
                                    size='sm'
                                    name='A'
                                    src={
                                        'http://localhost:2000/profilePicture/' +
                                        auth?.userPhoto
                                    }
                                />
                            ) : (
                                <Avatar size='sm' name={auth.name} />
                            )}
                        </Link>
                        <Text color="white" fontFamily="sans-serif">{auth.name}</Text>
                    </Flex>
                </Flex>
            )}
        </Box>
    )
}

export default NavbarDashboard
