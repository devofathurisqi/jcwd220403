import React, { useState } from 'react'
import {
    Box, Tabs, TabList, TabPanels, Tab, TabPanel,
    Avatar, Heading, Flex, Center, Button, Skeleton, Spacer,
    Text

} from "@chakra-ui/react"

import EmptyDashboard from '../Components/ComponentBeTenant/EmptyDashboard';
import DashboardOne from '../Components/ComponentBeTenant/ComponentDashboardOne';
import ComponentDashboardTwo from '../Components/ComponentBeTenant/ComponentDashboardTwo';
import DeleteProperty from '../Components/ComponentBeTenant/DeleteProperty';
import { openModal } from '../Redux/ModalSlice';
import { useDispatch } from "react-redux"
import axios from "axios"
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState(null)
    const [load, setLoad] = useState(false)
    const { auth } = useAuth();

    //get dataa nanti di hapus

    const getData = async () => {
        try {
            setLoad(true)
            const response = await axios.get(`http://localhost:2000/api/property/${auth.tenantId}`)
            setData(response.data)
            setLoad(false)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        getData()
    }, [])

    const Loading = () => {
        return (
            <Box p={6}>
                <Box>
                    <Flex>
                        <Skeleton height='30px' width="100px" marginTop="10px" />
                        <Spacer />
                        <Skeleton height='30px' width="100px" marginTop="10px" />
                    </Flex>
                </Box>
                <Box>
                    <Flex>
                        <Skeleton height='300px' width="550px" marginTop="10px" />
                        <Spacer />
                        <Skeleton height='300px' width="550px" marginTop="10px" />
                    </Flex>
                </Box>
                <Box>
                    <Skeleton height='300px' marginTop="10px" />
                </Box>
            </Box>
        )
    }

    const ComponentDashboard = () => {
        return (
            <Box>
                <Box p={6}>
                    <Flex align="center" justify="space-between" mb={6} letterSpacing="3px">
                        <Heading as="h1" size="lg" fontFamily="Uniform Pro Medium">
                            Tenant Dashboard
                        </Heading>
                        {/* avatar nanti masih di tembak nanti di ambil dari profile!!, foto masih di tembak!! */}
                        <Avatar name={auth.name} src='https://bit.ly/dan-abramov' />
                    </Flex>
                </Box>
                <Tabs variant="enclosed">
                    <TabList>
                        <Tab>Property Detail</Tab>
                        <Tab>Room Detail</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <DashboardOne />
                            <Box boxShadow="md" p={4}>
                                <Center>
                                    <Button textAlign="center" backgroundColor="red.400" color="white" onClick={() => dispatch(openModal())}>Delete Property</Button>
                                </Center>
                                <DeleteProperty />
                            </Box>
                        </TabPanel>
                        <TabPanel>
                            <ComponentDashboardTwo />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        )
    }

    return (
        <Box>
            <Box>
                {data !== null && data.length > 0 ? (
                    load ? <Loading /> : (
                        <ComponentDashboard />
                    )
                ) : (
                    <Box>
                        <EmptyDashboard />
                        <Text textAlign="center">Mungkin anda telah menghapus atau belum menambahkan property anda di Holistay
                            <Link to="/createtenant">
                                <Text color="blue.400" _hover={{ fontWeight: "bold" }} >Tambahkan Property</Text>
                            </Link>
                        </Text>
                    </Box>

                )}
            </Box>
        </Box>
    )
}

export default Dashboard
