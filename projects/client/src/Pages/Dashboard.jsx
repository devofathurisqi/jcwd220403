import React, { useState } from 'react'
import {
    Box, Tabs, TabList, TabPanels, Tab, TabPanel,
    Avatar, Heading, Flex, Center, Button, Skeleton, Stack, Spacer

} from "@chakra-ui/react"

import EmptyDashboard from '../Components/ComponentBeTenant/EmptyDashboard';
import DashboardOne from '../Components/ComponentBeTenant/ComponentDashboardOne';
import ComponentDashboardTwo from '../Components/ComponentBeTenant/ComponentDashboardTwo';
import DeleteProperty from '../Components/ComponentBeTenant/DeleteProperty';
import { openModal } from '../Redux/ModalSlice';
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { useEffect } from 'react';


//perbaikan code nanti pengambilan data dari file ini saja , dan component <DashboardOne />, <ComponentDashboardTwo />, mengambil data 
//dari redux saja. itu nanti


const Dashboard = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState()
    const [load, setLoad] = useState(false)
    const deleted = useSelector((state) => state.DoneCreatePropertiesSlice.isDeleteProperty)
    console.log(deleted)
    //deleted hasilnya adalah false, memang yang kita butuhkan adalah kebalikan dari selesainya
    //hasil create data

    const getData = async () => {
        try {
            setLoad(true)
            const response = await axios.get("http://localhost:2000/api/property/1")
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
    return (
        <Box>
            {load ? <Loading /> : (
                deleted === false ? (
                    <Box>
                        <Box p={6}>
                            <Flex align="center" justify="space-between" mb={6} letterSpacing="3px">
                                <Heading as="h1" size="lg" fontFamily="Uniform Pro Medium">
                                    Tenant Dashboard
                                </Heading>
                                {/* avatar nanti masih di tembak nanti di ambil dari profile!! */}
                                <Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
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
                ) : (
                    <Box>
                        < EmptyDashboard />
                    </Box>
                )
            )}
        </Box>
    )
}

export default Dashboard
