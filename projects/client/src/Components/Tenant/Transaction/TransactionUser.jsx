import {
    Text,
    Center,
    useMediaQuery,
    Box,
    Flex,
    Button,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Circle,
    Icon,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    useDisclosure,
  } from '@chakra-ui/react';
  import { useState, useEffect } from 'react';
  import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
  import Swal from 'sweetalert2';
  import useAuth from '../../../hooks/useAuth';
import ProcesTransaction from './ProcessTransaction';
import { IoAlarmOutline, IoBusinessOutline, IoCalendarOutline, IoFolderOpenOutline, IoListOutline } from "react-icons/io5";
import { BiShow, BiHide } from "react-icons/bi";
import ChartLine from '../Report/ChartLine';
import WaitPaymentConfirm from './WaitPaymentConfirm';
import WaitPayment from './WaitPayment';
  
  function TransactionUser() {
    const [isloading, setIsloading] = useState(true);
    const { auth } = useAuth();
    const [data, setData] = useState([])
    console.log(data)
    const [show, setShow] = useState(true)
    const axiosPrivate = useAxiosPrivate();
    const [isMobile] = useMediaQuery('(max-width: 481px)');
    const [active, setActive] = useState("Menunggu Konfirmasi Pembayaran")
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    const getData = async () => {
      try {
        const res = await axiosPrivate.get(`/transactions/tenant/${auth?.tenantId}/total`);
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
            <Box bgColor="gray.50" w="100vw" h="100vh" overflow="scroll"  >
                <Center>
                    <Box w="90vw">
                        <Flex bgColor="white" mt="2" p="3" borderRadius="3xl" boxShadow="base">
                            <Flex ml="4" justify="space-between" w="75vw">
                                <Text fontSize="small" color="gray.500" >{show ? "Transactions Overview" : active}</Text>
                                <Flex>
                                    <Icon onClick={() => show ? setShow(false) : setShow(true)} w={5} h={5} mr="2" as={show ? BiHide : BiShow} />
                                    <Icon onClick={onOpen} w={5} h={5} as={IoListOutline} />
                                </Flex>
                            </Flex>
                        </Flex>
                        {show ? 
                        <>
                            <Flex bgColor="white" mt="2" p="4" borderRadius="3xl" boxShadow="base" onClick={() => setActive("Menunggu Konfirmasi Pembayaran")}>
                                <Circle bgColor={active === "Menunggu Konfirmasi Pembayaran" ? "green.100" : "gray.50"} p="3">
                                    <Icon w={5} h={5} as={IoAlarmOutline}/>
                                </Circle>
                                <Box ml="4">
                                    <Text fontSize="small" color="gray.500" >Menunggu Konfirmasi Pembayaran</Text>
                                    <Text color="green" fontSize="md" fontWeight="bold" >
                                        {data[data.findIndex(item => item.transactionStatus === "Menunggu Konfirmasi Pembayaran")] ? data[data.findIndex(item => item.transactionStatus === "Menunggu Konfirmasi Pembayaran")].Count : 0} Transaksi
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex bgColor="white" mt="2" p="4" borderRadius="3xl" boxShadow="base" onClick={() => setActive("Diproses")}  >
                                <Circle bgColor={active === "Diproses" ? "green.100" : "gray.50"} p="3">
                                    <Icon w={5} h={5} as={IoCalendarOutline}/>
                                </Circle>
                                <Box ml="4">
                                    <Text fontSize="small" color="gray.500" >Diproses</Text>
                                    <Text color="green" fontSize="md" fontWeight="bold" >
                                        {data[data.findIndex(item => item.transactionStatus === "Diproses")] ? data[data.findIndex(item => item.transactionStatus === "Diproses")].Count : 0} Transaksi
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex bgColor="white" mt="2" p="4" borderRadius="3xl" boxShadow="base" onClick={() => setActive("Menunggu Pembayaran")}>
                                <Circle bgColor={active === "Menunggu Pembayaran" ? "green.100" : "gray.50"} p="3">
                                    <Icon w={5} h={5} as={IoBusinessOutline}/>
                                </Circle>
                                <Box ml="4">
                                    <Text fontSize="small" color="gray.500" >Menunggu Pembayaran</Text>
                                    <Text color="green" fontSize="md" fontWeight="bold" >
                                        {data[data.findIndex(item => item.transactionStatus === "Menunggu Pembayaran")] ? data[data.findIndex(item => item.transactionStatus === "Menunggu Pembayaran")].Count : 0} Transaksi
                                    </Text>
                                </Box>
                            </Flex>
                        </>
                        : null
                        }
                        {active === "Menunggu Konfirmasi Pembayaran" ? <WaitPaymentConfirm/> : active === "Diproses" ? <ProcesTransaction/> : <WaitPayment/>}
                    </Box>
                        <Drawer
                            isOpen={isOpen}
                            placement='left'
                            onClose={onClose}
                            // finalFocusRef={btnRef}
                        >
                            <DrawerOverlay />
                            <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerHeader>TRANSAKSI PENGGUNA</DrawerHeader>

                            <DrawerBody>
                                <Box>
                                    <Flex h="40px" align="center" borderRight={active === "Menunggu Konfirmasi Pembayaran" ? "4px" : "none"} borderRightColor={active === "Menunggu Konfirmasi Pembayaran" ? "green" : "black"} color={active === "Menunggu Konfirmasi Pembayaran" ? "green" : "black"} w="70vw"
                                    onClick={() => setActive("Menunggu Konfirmasi Pembayaran")} >
                                        <Text fontSize="sm">
                                            Menunggu Konfirmasi Pembayaran
                                        </Text>
                                    </Flex>
                                    <Flex h="40px" align="center" borderRight={active === "Diproses" ? "4px" : "none"} borderRightColor={active === "Diproses" ? "green" : "black"} color={active === "Diproses" ? "green" : "black"} w="70vw"
                                    onClick={() => setActive("Diproses")} >
                                        <Text fontSize="sm">
                                            Diproses
                                        </Text>
                                    </Flex>
                                    <Flex h="40px" align="center" borderRight={active === "Menunggu Pembayaran" ? "4px" : "none"} borderRightColor={active === "Menunggu Pembayaran" ? "green" : "black"} color={active === "Menunggu Pembayaran" ? "green" : "black"} w="70vw"
                                    onClick={() => setActive("Menunggu Pembayaran")} >
                                        <Text fontSize="sm">
                                            Menunggu Pembayaran
                                        </Text>
                                    </Flex>
                                </Box>

                            </DrawerBody>
                            </DrawerContent>
                        </Drawer>
                </Center>
                
            </Box>
          ) : (
            <Flex >
                <Box h="100vh">
                    <Center>
                        <Box >
                            <Flex h="15vh" m="4" justify="space-between" align="center">
                                <Flex bgColor="white" mt="2" p="4" align="center" h="full" w="30%" borderRadius="3xl" boxShadow="base" >
                                    <Circle size="14" bgColor={active === "Menunggu Konfirmasi Pembayaran" ? "orange.100" : "gray.50"}>
                                        <Icon w={8} h={8} as={IoAlarmOutline}/>
                                    </Circle>
                                    <Box ml="4">
                                        <Text fontSize="small" color="gray.500" >Menunggu Konfirmasi Pembayaran</Text>
                                        <Text color="orange" fontSize="md" fontWeight="bold" >
                                            {data[data.findIndex(item => item.transactionStatus === "Menunggu Konfirmasi Pembayaran")] ? data[data.findIndex(item => item.transactionStatus === "Menunggu Konfirmasi Pembayaran")].Count : 0} Transaksi
                                        </Text>
                                    </Box>
                                </Flex>
                                <Flex bgColor="white" mt="2" p="4" align="center" h="full" w="30%" borderRadius="3xl" boxShadow="base" >
                                    <Circle size="14" bgColor={active === "Diproses" ? "orange.100" : "gray.50"} p="3">
                                        <Icon w={8} h={8} as={IoCalendarOutline}/>
                                    </Circle>
                                    <Box ml="4">
                                        <Text fontSize="small" color="gray.500" >Diproses</Text>
                                        <Text color="orange" fontSize="md" fontWeight="bold" >
                                            {data[data.findIndex(item => item.transactionStatus === "Diproses")] ? data[data.findIndex(item => item.transactionStatus === "Diproses")].Count : 0} Transaksi
                                        </Text>
                                    </Box>
                                </Flex>
                                <Flex bgColor="white" mt="2" p="4" align="center" h="full" w="30%" borderRadius="3xl" boxShadow="base" >
                                    <Circle size="14" bgColor={active === "Menunggu Pembayaran" ? "orange.100" : "gray.50"} p="3">
                                        <Icon w={8} h={8} as={IoBusinessOutline}/>
                                    </Circle>
                                    <Box ml="4">
                                        <Text fontSize="small" color="gray.500" >Menunggu Pembayaran</Text>
                                        <Text color="orange" fontSize="md" fontWeight="bold" >
                                            {data[data.findIndex(item => item.transactionStatus === "Menunggu Pembayaran")] ? data[data.findIndex(item => item.transactionStatus === "Menunggu Pembayaran")].Count : 0} Transaksi
                                        </Text>
                                    </Box>
                                </Flex>
                            </Flex>
                            <Tabs size="sm" mt="8" colorScheme="orange"  >
                                <TabList>
                                    <Tab onClick={() => setActive("Menunggu Konfirmasi Pembayaran")}>                                
                                        <Button size="sm" borderRadius="3xl" colorScheme={active === "Menunggu Konfirmasi Pembayaran" ? "orange" : "gray"} >Menunggu Konfirmasi Pembayaran</Button>
                                    </Tab>
                                    <Tab onClick={() => setActive("Diproses")}>
                                        <Button size="sm" borderRadius="3xl" colorScheme={active === "Diproses" ? "orange" : "gray"} >Diproses</Button>
                                    </Tab>
                                    <Tab onClick={() => setActive("Menunggu Pembayaran")}>
                                        <Button size="sm" borderRadius="3xl" colorScheme={active === "Menunggu Pembayaran" ? "orange" : "gray"} >Menunggu Pembayaran</Button>
                                    </Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <WaitPaymentConfirm />
                                    </TabPanel>
                                    <TabPanel>
                                        <ProcesTransaction/>
                                    </TabPanel>
                                    <TabPanel>
                                        <WaitPayment />
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Box>
                    </Center>
                </Box>
            </Flex>
          )}
        </Center>
      </>
    );
  }
  
  export default TransactionUser;
  