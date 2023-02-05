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
    Flex,
    Button,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Tag,
    TagLabel,
  } from '@chakra-ui/react';
  import { useState, useEffect } from 'react';
  import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
  import Swal from 'sweetalert2';
  import useAuth from '../../../hooks/useAuth';
  import { IoCheckmarkDoneCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import { SearchIcon } from '@chakra-ui/icons';
import { BiFilter } from 'react-icons/bi';
  
  function WaitPaymentConfirm() {
    const [isloading, setIsloading] = useState(true);
    const { auth } = useAuth();
    const [data, setData] = useState([])
    console.log(data)
    const axiosPrivate = useAxiosPrivate();
    const [isMobile] = useMediaQuery('(max-width: 481px)');
  
    const getData = async () => {
      try {
        const res = await axiosPrivate.get(`/transactions/tenant/${auth?.tenantId}/Menunggu Konfirmasi Pembayaran`);
        setData(res.data)
        setIsloading(false);
      } catch (err) {
        console.log(err);
      }
    };

    const onAccept = async (data) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to confirm transaction with id ${data.id}`,
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
        }).then( async (result) => {
            if (result.isConfirmed) {
                try {
                    Swal.fire({
                        title: 'Loading ..',
                        html: 'Confirmed Transaction In Progress',
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading()
                        },
                        })
                    const res = await axiosPrivate.post('/transactions/accept', data) 
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

    const onReject = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to reject transaction with id ${id}`,
            icon: 'warning',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            },
            showCancelButton: true,
            confirmButtonText: 'Reject it!',
            cancelButtonText: 'No, cancel!',
            confirmButtonColor: '#FE9900',
            reverseButtons: true,
        }).then( async (result) => {
            if (result.isConfirmed) {
                try {
                    Swal.fire({
                        title: 'Loading ..',
                        html: 'Reject Transaction In Progress',
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading()
                        },
                        })
                    const res = await axiosPrivate.post('/transactions/reject', {id}) 
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

      useEffect(() => {
          getData()
      }, [])
  
    return (
      <>
        <Center>
          {isMobile ? (
            <Box w="90vw" mt="2" borderRadius="3xl" p="2" bgColor="white" boxShadow="base" >
                <Flex m="4" w="80vw" justify="space-evenly" align="center">
                    <InputGroup bgColor="gray.50" boxShadow="base" w="80%"  borderRadius="3xl" overflow="hidden">
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
                            return(
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
                                            <Tag size="sm" borderRadius="3xl" bgColor="orange" >
                                                <TagLabel fontSize="xx-small" >
                                                    {item.transactionStatus}
                                                </TagLabel>
                                            </Tag>
                                        </Box>
                                        
                                    </Td>
                                    <Td justifyContent="center">
                                        <Flex justify="space-between" w="16">
                                            <Icon as={IoCheckmarkDoneCircleOutline} w={8} h={8} color='green.500' cursor="pointer" onClick={() => onAccept(item)}/>
                                            <Icon as={IoCloseCircleOutline} w={8} h={8} color='red.500' cursor="pointer" onClick={() => onReject(item.id)}/>
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
                            <TableCaption>Holistay Transactions Users</TableCaption>
                            <Thead>
                            <Tr>
                                <Th>Id</Th>
                                <Th>Check In</Th>
                                <Th>Name Rooms</Th>
                                <Th >User</Th>
                                <Th>Status</Th>
                                <Th>Action</Th>
                            </Tr>
                            </Thead>
                            <Tbody>
                            {data.map(item => {
                                return(
                                    <Tr>
                                        <Td>{item.id}</Td>
                                        <Td>{new Date(item.checkIn).toLocaleString('en', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            })}</Td>
                                        <Td>{item.room.name}</Td>
                                        <Td>{item.user.fullName}</Td>
                                        <Td>
                                            <Tag size="sm" borderRadius="3xl" bgColor="orange" >
                                                <TagLabel fontSize="smaller" >
                                                    {item.transactionStatus}
                                                </TagLabel>
                                            </Tag>
                                        </Td>
                                        <Td>
                                            <Flex>
                                               <Icon as={IoCheckmarkDoneCircleOutline} w={8} h={8} color='green.500' cursor="pointer" onClick={() => onAccept(item)}/>
                                               <Icon as={IoCloseCircleOutline} w={8} h={8} color='red.500' cursor="pointer" onClick={() => onReject(item.id)}/>
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
  
  export default WaitPaymentConfirm;
  