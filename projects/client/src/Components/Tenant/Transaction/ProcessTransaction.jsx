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
    Tag,
    TagLabel,
  } from '@chakra-ui/react';
  import { useState, useEffect } from 'react';
  import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
  import Swal from 'sweetalert2';
  import useAuth from '../../../hooks/useAuth';
  import { SearchIcon } from '@chakra-ui/icons';
  import { BiFilter } from 'react-icons/bi';
  
  function ProcesTransaction() {
    const [isloading, setIsloading] = useState(true);
    const { auth } = useAuth();
    const [data, setData] = useState([])
    const axiosPrivate = useAxiosPrivate();
    const [isMobile] = useMediaQuery('(max-width: 481px)');
  
    const getData = async () => {
      try {
        const res = await axiosPrivate.get(`/transactions/tenant/${auth?.tenantId}/Diproses`);
        setData(res.data)
        setIsloading(false);
      } catch (err) {
        console.log(err);
      }
    };

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
                         <Th>Status</Th>
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
                                     </Box>
                                     
                                 </Td>
                                 <Td>
                                    <Tag size="sm" borderRadius="3xl" bgColor="green" color="white">
                                        <TagLabel fontSize="smaller" >
                                            {item.transactionStatus}
                                        </TagLabel>
                                    </Tag>
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
                            </Tr>
                            </Thead>
                            <Tbody>
                            {data.map(item => {
                                return(
                                    <Tr>
                                        <Td>{new Date(item.checkIn).toLocaleString('en', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            })}</Td>
                                        <Td>{item.room.name}</Td>
                                        <Td>{item.user.fullName}</Td>
                                        <Td>
                                            <Tag size="sm" borderRadius="3xl" bgColor="green" colorScheme="whiteAlpha">
                                                <TagLabel fontSize="smaller" >
                                                    {item.transactionStatus}
                                                </TagLabel>
                                            </Tag>
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
  
  export default ProcesTransaction;