import {
    Text,
    Center,
    useMediaQuery,
    Box,
    TableContainer,
    Table,
    TableCaption,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Button,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Flex,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import { SearchIcon } from '@chakra-ui/icons';
import { BiFilter } from 'react-icons/bi';
import { IoCheckmarkDoneCircleOutline, IoCloseCircleOutline } from "react-icons/io5";

function WaitPayment() {
    const [isloading, setIsloading] = useState(true);
    const { auth } = useAuth();
    const [data, setData] = useState([])
    const axiosPrivate = useAxiosPrivate();
    const [isMobile] = useMediaQuery('(max-width: 481px)');


    const getData = async () => {
        try {
            const res = await axiosPrivate.get(`/transactions/tenant/${auth?.tenantId}/Menunggu Pembayaran`);
            setData(res.data)
            setIsloading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getData()
    }, [])

    const cancelOrders = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to cancel orders user transaction with id ${id}`,
            icon: 'warning',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            showCancelButton: true,
            confirmButtonText: 'Cancel it!',
            cancelButtonText: 'No, close!',
            confirmButtonColor: '#FE9900',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    Swal.fire({
                        title: 'Loading ..',
                        html: 'Cancel User Order In Progress',
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading()
                        },
                    })
                    const res = await axiosPrivate.post(`/transactions/cancelOrders/${id}`)
                    Swal.fire(
                        'SUCCESS !',
                        `${res.data}`,
                        'success'
                    )
                } catch (err) {
                    console.log(err);
                }

            }
        })
    }

    const onAcceptOrders = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to confirm user orders with id ${id}`,
            icon: 'question',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            showCancelButton: true,
            confirmButtonText: 'Confirm it!',
            cancelButtonText: 'No, cancel!',
            confirmButtonColor: '#FE9900',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    Swal.fire({
                        title: 'Loading ..',
                        html: 'Confirmed User Orders In Progress',
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading()
                        },
                    })
                    const res = await axiosPrivate.post(`/transactions/acceptOrders/${id}`)
                    Swal.fire(
                        'SUCCESS !',
                        `${res.data}`,
                        'success'
                    )
                } catch (err) {
                    console.log(err);
                }

            }
        })
    }

    return (
        <>
            <Center>
                {isMobile ? (
                    <Box w="90vw" mt="2" borderRadius="3xl" p="2" bgColor="white" boxShadow="base" >
                        <Flex m="4" w="80vw" justify="space-evenly" align="center">
                            <InputGroup bgColor="gray.50" boxShadow="base" w="80%" borderRadius="3xl" overflow="hidden">
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<SearchIcon />}
                                />
                                <Input borderRadius="3xl" placeholder='Search ..' fontSize="small" type="text" />
                            </InputGroup>
                            <Icon as={BiFilter} w={6} h={6} />

                        </Flex>
                        <TableContainer w="88vw">
                            <Table variant='simple'>
                                <TableCaption>{data.length === 0 ? "No Item" : "Holistay Transactions Users"}</TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>Id</Th>
                                        <Th>Description</Th>
                                        <Th>Action</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data.map(item => {
                                        return (
                                            <Tr>
                                                <Td>{item.id}</Td>
                                                <Td>
                                                    <Box>
                                                        <Text fontWeight="bold" fontSize="sm" color="orange">{item.room.name}</Text>
                                                        <Text fontSize="sm">{item.user.fullName}</Text>
                                                        <Text fontSize="sm">
                                                            {new Date(item.checkIn).toLocaleString('en', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </Text>
                                                        <Text fontSize="xx-small" >{item.transactionStatus}</Text>
                                                    </Box>
                                                </Td>
                                                <Td>
                                                    <Flex justify="space-between" w="16">
                                                        <Icon as={IoCheckmarkDoneCircleOutline} w={8} h={8} color='green.500' cursor="pointer" onClick={() => onAcceptOrders(item.id)} />
                                                        <Icon as={IoCloseCircleOutline} w={8} h={8} color='red.500' cursor="pointer" onClick={() => cancelOrders(item.id)} />
                                                    </Flex>
                                                </Td>
                                            </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                ) : (
                    <Box mt="4" bgColor="white" boxShadow="base" borderRadius="2xl">
                        <Center>
                            <TableContainer w="80vw">
                                <Table variant='simple'>
                                    <TableCaption>{data.length === 0 ? "No Item" : "Holistay Transactions Users"}</TableCaption>
                                    <Thead>
                                        <Tr>
                                            <Th>Check In</Th>
                                            <Th>Name Rooms</Th>
                                            <Th >User</Th>
                                            <Th>Status</Th>
                                            <Th>Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {data.map(item => {
                                            return (
                                                <Tr>
                                                    <Td>{new Date(item.checkIn).toLocaleString('en', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}</Td>
                                                    <Td>{item.room.name}</Td>
                                                    <Td>{item.user.fullName}</Td>
                                                    <Td>{item.transactionStatus}</Td>
                                                    <Td>
                                                        <Flex justify="space-between" w="16">
                                                            <Icon as={IoCheckmarkDoneCircleOutline} w={8} h={8} color='green.500' cursor="pointer" onClick={() => onAcceptOrders(item.id)} />
                                                            <Icon as={IoCloseCircleOutline} w={8} h={8} color='red.500' cursor="pointer" onClick={() => cancelOrders(item.id)} />
                                                        </Flex>
                                                    </Td>
                                                </Tr>
                                            )
                                        })}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Center>
                    </Box>
                )}
            </Center>
        </>
    );
}

export default WaitPayment;