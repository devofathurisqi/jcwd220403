import React, { useState } from 'react'
import { Box, Divider, Flex, Text, Icon, Spacer, useBreakpointValue } from "@chakra-ui/react"
import { RiDashboardFill } from "react-icons/ri"
import { BsListUl } from "react-icons/bs"
import { RxDividerVertical } from "react-icons/rx"
import { AiOutlineDown } from "react-icons/ai"

//import component
import CardProperty from './CardProperty'

const Property = () => {
    const [indexAcctive, setIndexAcctive] = useState(0)

    const RenderComponent = () => {
        if (indexAcctive === 0) {
            return (
                <CardProperty />
            )
        }
    }

    const flexDisplay = useBreakpointValue({
        base: "none",
        md:"block",
        lg:"block"
    })
    const justifyContent = useBreakpointValue({
        base: "center",
        md:"",
        lg:""
    })

    return (
        <Box p={12}>
            <Text fontWeight="bold" fontSize="26px">Properties</Text>
            <Flex borderBottom="2px solid #f0f0f0" paddingBottom="10px" flexWrap="wrap" justifyContent="center">
                <Box border="2px solid #ededed" borderRadius="10px" width="max-content" marginTop="10px" display={flexDisplay}>
                    <Flex p={2}>
                        <Flex gap="5px" alignItems="center" cursor="pointer" onClick={() => setIndexAcctive(0)}>
                            <Text color={indexAcctive === 0 ? "black" : "#c6c6c6"} >Status</Text>
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
                            <Text color={indexAcctive === 2 ? "black" : "#c6c6c6"}>Off Market</Text>
                            <Box>
                                <Flex gap="5px">
                                    <Box borderRadius="30px" backgroundColor={indexAcctive === 2 ? "#106fd2" : "#dbdbdd"}
                                        width="25px" textAlign="center" color={indexAcctive === 2 ? "white" : "#c6c6c6"}>2</Box>
                                </Flex>
                            </Box>
                            <Divider borderColor="#c6c6c6" orientation='vertical' marginLeft="5px"/>
                        </Flex>
                        <Flex gap="5px" alignItems="center" marginLeft="5px" cursor="pointer" onClick={() => setIndexAcctive(3)}>
                            <Text color={indexAcctive === 3 ? "black" : "#c6c6c6"}>Draft</Text>
                            <Box>
                                <Flex gap="5px">
                                    <Box borderRadius="30px" backgroundColor={indexAcctive === 3 ? "#106fd2" : "#dbdbdd"}
                                        width="25px" textAlign="center" color={indexAcctive === 3 ? "white" : "#c6c6c6"}>7</Box>
                                </Flex>
                            </Box>
                        </Flex>
                    </Flex>
                </Box>
                <Box border="2px solid #ededed" borderRadius="10px" width="max-content" marginTop="10px" marginLeft="10px" display={flexDisplay}>
                    <Flex p={2} justifyContent="center" alignItems="center">
                        <Flex alignItems="center" gap="5px">
                            <Text color="#999999" fontFamily="sans-serif">Show as</Text>
                            <Icon as={RiDashboardFill} color="#176dc8" boxSize="20px" />
                            <Text color="#575758" fontWeight="bold" fontSize="sans-serif">Grid</Text>
                            <Icon as={RxDividerVertical} color="#999999" boxSize="20px" />
                            <Icon as={BsListUl} boxSize="20px" />
                            <Text color="#999999" fontFamily="sans-serif">List</Text>
                        </Flex>
                    </Flex>
                </Box>
                <Spacer display={flexDisplay} />
                <Box border="2px solid #ededed" borderRadius="10px" width="max-content" marginTop="10px" >
                    <Flex p={2} justifyContent="center" alignItems="center" gap="5px" >
                        <Text color="#999999" fontFamily="sans-serif">Sort by</Text>
                        <Text color="#575758" fontFamily="sans-serif" fontWeight="bold">Newest to Oldest</Text>
                        <Icon as={AiOutlineDown} color="#878787" boxSize="20px" />
                    </Flex>
                </Box>
            </Flex>
            <RenderComponent />
        </Box>
    )
}

export default Property