import React, { useState, useEffect } from 'react'
import {
    Box, Button, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalCloseButton, ModalBody, Text, ModalFooter,
    useToast, Spinner, Drawer, Center, Flex, Heading, Select, Image,
    InputLeftAddon, Input, InputGroup, useDisclosure, AlertDialogCloseButton,
    Icon, VisuallyHidden, InputRightAddon, useMediaQuery, DrawerBody, DrawerFooter,
    DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
    InputLeftElement, AlertDialog, AlertDialogBody, AlertDialogFooter,
    AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, InputRightElement,
    useBreakpointValue
} from "@chakra-ui/react"

import { useDispatch, useSelector } from "react-redux"
import { closeModalCertainDate } from '../../Redux/CertainDate'
import Calendar from 'react-calendar';
import "../../Styles/reactCalendar.css"
import axios from "../../api/axios"
import useAuth from '../../hooks/useAuth';
import { Carousel } from 'react-responsive-carousel';
import { IoPricetagsOutline, IoHomeOutline } from "react-icons/io5"
import { BsArrowBarRight, BsArrowBarDown } from "react-icons/bs"
import { AiOutlineFileDone, AiOutlinePercentage } from "react-icons/ai"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { VscServerProcess } from "react-icons/vsc"
import { GiPriceTag } from "react-icons/gi"
import { CgArrowLongDownR } from "react-icons/cg"
import { MdOutlineAutoDelete } from "react-icons/md"
import Axios from "axios"
import Slider from 'react-slick';

const InputCertainDate = () => {
    const isOpenModalCertainDate = useSelector((state) => state.CertainDate.isOpen)
    let room = useSelector((state) => state.CertainDate.room)
    const disableData = room && room.unavailableDates
    const highSeasonsData = room && room.highSeasons
    const dispatch = useDispatch()
    const [dataHoliday, setDataHoliday] = useState()
    const [loadingData, setLoadingData] = useState(false)
    const [persentase, setPersentase] = useState(0)
    const [result, setResult] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    const [load, setLoad] = useState(false)
    const [msgDisable, setMsgDisable] = useState("")
    const [msgHighSeason, setMsgHighSeason] = useState("")
    const toast = useToast()

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [option, setOption] = useState('');
    const [optionSpecialPrice, setOptionSpecialPrice] = useState('')
    const [price, setPrice] = useState()

    const handleDateChange = (date) => {
        if (startDate) {
            setEndDate(date)
        } else {
            setStartDate(date)
        }
    }

    const convertToPersentase = () => {
        setResult(room && room.price * persentase / 100 + room.price)
    }

    useEffect(() => {
        convertToPersentase()
    }, [persentase])

    const getDataHoliday = async () => {
        try {
            setLoadingData(true)
            const response = await Axios.get("https://holidayapi.com/v1/holidays", {
                params: {
                    key: "21e1f885-892d-473d-b0c8-dae944c80515",
                    country: "id",
                    year: 2022
                }
            })
            const updateDataResponse = response.data.holidays.map((item) => {
                const date = new Date(item.date)
                date.setFullYear(2023)
                return {
                    ...item,
                    date: date.toISOString().slice(0, 10)
                }
            })
            setDataHoliday(updateDataResponse)
            setLoadingData(false)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getDataHoliday()
    }, [])

    const AlertDataHoliday = () => {
        return (
            <>
                <AlertDialog
                    motionPreset='slideInBottom'
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                    isOpen={isOpen}
                    isCentered
                >
                    <AlertDialogOverlay />
                    <AlertDialogContent>
                        <AlertDialogHeader>High Season</AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody style={{ overflowY: 'scroll', maxHeight: '70vh' }}>
                            {loadingData ? <Spinner /> : (
                                <Flex flexWrap='wrap'>
                                    {dataHoliday.map((holiday, index) => {
                                        const date = new Date(holiday.date)
                                        const today = new Date()
                                        return (
                                            <Box key={index} p={5} m={5} rounded='lg' shadow='md' width="100%"
                                                opacity={date < today ? 0.3 : 1}
                                                cursor={date < today ? "not-allowed" : "pointer"}
                                                onClick={() => {
                                                    if (date >= today) {
                                                        setStartDate(date)
                                                        onClose()
                                                    }
                                                }}
                                                _hover={{ border: "2px solid black" }}
                                            >
                                                <Heading as='h4' size='md'>{holiday.name}</Heading>
                                                <Text>{holiday.date}</Text>
                                            </Box>
                                        )
                                    })}
                                </Flex>
                            )}
                        </AlertDialogBody>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        )
    }

    const EmptyDate = () => {
        setStartDate(null)
        setEndDate(null)
        setMsgDisable("")
        setMsgHighSeason("")
    }


    const handleSubmit = async () => {
        try {
            await axios.post(`/disableCertainDate/${room.id}`, {
                start_date: startDate,
                end_date: endDate
            })
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                dispatch(closeModalCertainDate())
                setMsgDisable("")
                setStartDate(null)
                setEndDate(null)
                toast({
                    title: 'Success',
                    description: 'Room has been disable',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }, 3000)
        } catch (err) {
            console.log(err)
            if (err.response) {
                setMsgDisable(err.response.data)
            }
        }
    }

    const handleSubmitHighSeason = async () => {
        try {
            await axios.post(`/highSeason/${room.id}`, {
                start_date: startDate,
                end_date: endDate,
                price: result ? result : price
            })
            setLoad(true)
            setTimeout(() => {
                setStartDate(null)
                setEndDate(null)
                setPrice(null)
                setLoad(false)
                dispatch(closeModalCertainDate())
                setMsgDisable("")
                setMsgHighSeason("")
                toast({
                    title: 'Success',
                    description: 'High season is updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }, 3000)
        } catch (err) {
            console.log(err)
            if (err.response) {
                setMsgHighSeason(err.response.data)
            }
        }
    }

    const RenderComponentAfterOption = () => {
        if (option === "disable") {
            return (
                <Box>
                    <Text color="red.400" textAlign="center">{msgDisable}</Text>
                    <Text fontWeight="bold" textAlign="center">Announchement</Text>
                    <Text>
                        Opsi disable akan tidak memperbolehkan user untuk menyewa
                        room anda pada tanggal yang anda sudah tentukan , room akan tersedia
                        kembali saat End Date selesai
                    </Text>
                    <Center>
                        <Button colorScheme='blue' variant="outline" onClick={handleSubmit} marginTop="20px" width="100%">
                            {load ? <Spinner /> : "Save"}
                        </Button>
                    </Center>
                </Box>
            )
        } else if (option === "Set Special Price") {
            return (
                <Box>
                    <Flex justifyContent="center" gap="10px" borderBottom="1px solid gray">
                        <Icon as={IoHomeOutline} boxSize="25px" paddingBottom="5px" />
                        <Text textAlign="center" fontWeight="bold" paddingBottom="5px">{room.name}</Text>
                    </Flex>
                    <Center>
                        <Button onClick={onOpen} colorScheme="facebook" variant="outline" marginTop="10px">Ingin holistay membantu anda?</Button>
                    </Center>
                </Box>
            )
        }
    }

    const deleteCertainDate = async (d) => {
        try {
            await axios.delete(`/deleteCertainDate/${d.id}`)

            toast({
                title: 'Success',
                description: 'Disable room is deleted',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            console.log(err)
        }
    }
    const deleteHighSeason = async (d) => {
        try {
            await axios.delete(`/deleteHighSeason/${d.id}`)

            toast({
                title: 'Success',
                description: 'High season is deleted',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            console.log(err)
        }
    }

    //eveything for responsive
    const flexDirection = useBreakpointValue({
        base: 'column',
        md: 'column',
        lg: 'row',
    });
    const widthCalendarComponent = useBreakpointValue({
        base: '100%',
        md: '100%',
        lg: '70%',
    });
    const widthResultComponent = useBreakpointValue({
        base: "100%",
        md: "80%",
        lg: "30%"
    })
    const heightImage = useBreakpointValue({
        base: "220px",
        md: "400px",
        lg: "230px"
    })

    const NextArrow = (props) => {
        const { onClick } = props;
        return (
            <Button
                bg="white"
                onClick={onClick}
                style={{
                    position: "absolute",
                    right: "5px",
                    top: "calc(50% - 20px)",
                    color: "black",
                    borderRadius: "100%",
                    width: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1,
                    opacity: 1
                }}
            >
                <FaArrowRight />
            </Button>
        );
    };

    const PrevArrow = (props) => {
        const { onClick } = props;
        return (
            <Button
                bg="white"
                onClick={onClick}
                // display = {indexImages === index? "block" : "none"}
                style={{
                    position: "absolute",
                    left: "5px",
                    top: "calc(50% - 20px)",
                    color: "black",
                    borderRadius: "100%",
                    width: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1,
                    opacity: 1
                }}
            >
                <FaArrowLeft />
            </Button>
        );
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <Box>
            <Drawer
                isOpen={isOpenModalCertainDate}
                placement='right'
                size="full"
                onClose={() => dispatch(closeModalCertainDate())}
            >
                <DrawerOverlay />
                <DrawerContent p={4}>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <Flex flexDirection={flexDirection}>
                            <Box width={widthCalendarComponent}>
                                <Flex mb={4} className="room-calendar-container">
                                    {option === "disable" ? (
                                        <Box width="100%" textAlign="center">
                                            <Calendar
                                                onChange={(date) => handleDateChange(date)}
                                                value={selectedDate}
                                                minDate={startDate ? startDate : new Date()}
                                                maxDate={endDate}
                                                tileClassName={({ date, view }) => {
                                                    if (view === "month" && date >= startDate && date <= endDate) {
                                                        return "marked-date"
                                                    }
                                                }}
                                                tileDisabled={({ date }) => disableData.map(d => date >= new Date(d.start_date) && date <= new Date(d.end_date)).includes(true)}

                                            />
                                        </Box>
                                    ) : (
                                        <Box width="100%" textAlign="center">
                                            <Calendar
                                                onChange={(date) => handleDateChange(date)}
                                                value={selectedDate}
                                                minDate={startDate ? startDate : new Date()}
                                                maxDate={endDate}
                                                tileClassName={({ date, view }) => {
                                                    if (view === "month" && date >= startDate && date <= endDate) {
                                                        return "marked-date"
                                                    }
                                                }}
                                                tileDisabled={({ date }) => highSeasonsData.map(d => date >= new Date(d.start_date) && date <= new Date(d.end_date)).includes(true)}

                                            />
                                        </Box>
                                    )}
                                </Flex>
                                <Text fontWeight="bold" textAlign="center" borderBottom="1px solid black" onClick={EmptyDate} cursor="pointer">Kosongkan Tanggal</Text>
                                {option === "" ? null :
                                    (
                                        <Flex flexDirection="column" alignItems="center">
                                            <Text marginTop="10px" fontFamily='sans-serif' fontStyle="italic">{option === "disable" ? "Perjalanan tanggal anda untuk disable room" :
                                                "Perjalanan tanggal anda untuk high seasons"}</Text>
                                            <Icon as={BsArrowBarDown} boxSize="35px" />
                                        </Flex>
                                    )}
                                {option === "" ? null :
                                    option === "disable" ? (
                                        <Box display="flex" flexWrap="wrap" justifyContent="center">
                                            {room && disableData.map(d => (
                                                <Box key={d.start_date} width="300px" p="10px" m="10px" boxShadow="md" display="flex" justifyContent="space-between">
                                                    <Flex flexDirection="column" gap="5px">
                                                        <Text >Start Date : {new Date(d.start_date).toLocaleDateString()}</Text>
                                                        <Text >End Date : {new Date(d.end_date).toLocaleDateString()}</Text>
                                                        <Icon as={MdOutlineAutoDelete} boxSize="25px" cursor="pointer" onClick={() => deleteCertainDate(d)} />
                                                    </Flex>
                                                    <Box boxShadow="md" p="5px">
                                                        <Flex flexDirection="column" gap="5px" justifyContent="center" alignItems="center">
                                                            <Icon as={new Date(d.end_date) <= new Date() ? AiOutlineFileDone : VscServerProcess} color={new Date(d.end_date) <= new Date() ? "green.500" : "red.500"} boxSize="25px" />
                                                            <Text color={new Date(d.end_date) <= new Date() ? "green.500" : "red.500"}>
                                                                {new Date(d.end_date) <= new Date() ? "Done" : "On Proses"}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Box display="flex" flexWrap="wrap" justifyContent="center">
                                            {room && room.highSeasons.map(d => (
                                                <Box key={d.start_date} width="300px" p="10px" m="10px" boxShadow="md" display="flex" justifyContent="space-between">
                                                    <Flex flexDirection="column" gap="5px">
                                                        <Text >Start Date: {new Date(d.start_date).toLocaleDateString()}</Text>
                                                        <Text >End Date: {new Date(d.end_date).toLocaleDateString()}</Text>
                                                        <Text color={new Date(d.end_date) <= new Date() ? "green.500" : "red.500"}>Status : On Proses</Text>
                                                        <Icon as={MdOutlineAutoDelete} boxSize="25px" cursor="pointer" onClick={() => deleteHighSeason(d)} />
                                                    </Flex>
                                                    <Box boxShadow="md" p="5px">
                                                        <Flex flexDirection="column" gap="5px" justifyContent="center" alignItems="center">
                                                            <Icon as={GiPriceTag} color={new Date(d.end_date) <= new Date() ? "green.500" : "red.500"} boxSize="25px" />
                                                            <Text color={new Date(d.end_date) <= new Date() ? "green.500" : "red.500"}>
                                                                Rp. {room.price}
                                                            </Text>
                                                            <Icon as={CgArrowLongDownR} color={new Date(d.end_date) <= new Date() ? "green.500" : "red.500"} boxSize="25px" />
                                                            <Text color={new Date(d.end_date) <= new Date() ? "green.500" : "red.500"}>
                                                                Rp. {d.price}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    )
                                }
                            </Box>
                            <Box width={widthResultComponent} p={5} boxShadow="2xl" height="max-content" margin="auto">
                                <Text mb={2}>Start Date: {startDate && startDate.toLocaleDateString()}</Text>
                                <Text mb={2}>End Date: {endDate && endDate.toLocaleDateString()}</Text>
                                <Select
                                    placeholder="Pilih Opsi"
                                    mb={4}
                                    onChange={(e) => setOption(e.target.value)}>
                                    <option value="Set Special Price">Set Special Price</option>
                                    <option value="disable">Disable</option>
                                </Select>
                                <Slider {...settings}>
                                    {room && room.images.map((image) => (
                                        <Box borderRadius="10px">
                                            <Image height={heightImage} borderRadius="10px" src={`http://localhost:2000/roomPicture/${image.picture}`} />
                                        </Box>
                                    ))}
                                </Slider>
                                {/* </Carousel> */}
                                <RenderComponentAfterOption />
                                <AlertDataHoliday />
                                {option === "Set Special Price" ? (
                                    <Box>
                                        <Select
                                            mb={4}
                                            mt={4}
                                            variant="flushed"
                                            value={optionSpecialPrice}
                                            display={option === "disable" ? "none" : "block"}
                                            onChange={(e) => setOptionSpecialPrice(e.target.value)}>
                                            <option value="manual">Manual</option>
                                            <option value="persentase">Persentase</option>
                                        </Select>
                                        {optionSpecialPrice === "persentase" ? (
                                            <Box>
                                                <Text textAlign="center">Masukan jumlah persentase anda</Text>
                                                <Box display="flex" justifyContent="center" alignItems="center" gap="10px" marginTop="10px">
                                                    <Box flex="1">
                                                        <Flex gap="10px">
                                                            <Icon as={IoPricetagsOutline} boxSize="25px" />
                                                            <Text fontWeight="bold">Rp.{room && room.price}</Text>
                                                        </Flex>
                                                    </Box>
                                                    <Box flex="1">
                                                        <Icon as={BsArrowBarRight} boxSize="25px" />
                                                    </Box>
                                                    <Box>
                                                        <InputGroup margin="0">
                                                            <Input placeholder='.....' type="number" variant="flushed" onChange={(e) => setPersentase(e.target.value)} />
                                                            <InputRightElement pointerEvents="none"
                                                                children={<AiOutlinePercentage color='black' />}
                                                            />
                                                        </InputGroup>
                                                    </Box>
                                                </Box>
                                                <Flex gap="10px" justifyContent="center" marginTop="10px">
                                                    <Icon as={IoPricetagsOutline} boxSize="25px" />
                                                    <Text fontWeight="bold">Rp. {result}</Text>
                                                </Flex>
                                                <Text textAlign="center" color="red.400">{msgHighSeason}</Text>
                                                <Center>
                                                    <Button disabled={!persentase} colorScheme="facebook" variant="outline" width="100%" marginTop="10px" onClick={handleSubmitHighSeason}>
                                                        {load ? <Spinner /> : "Save"}
                                                    </Button>
                                                </Center>
                                            </Box>
                                        ) : (
                                            <Box>
                                                <Box display="flex" justifyContent="center" alignItems="center" gap="10px" marginTop="10px">
                                                    <Box flex="1">
                                                        <Flex gap="10px">
                                                            <Icon as={IoPricetagsOutline} boxSize="25px" />
                                                            <Text fontWeight="bold">Rp.{room && room.price}</Text>
                                                        </Flex>
                                                    </Box>
                                                    <Box flex="1">
                                                        <Icon as={BsArrowBarRight} boxSize="25px" />
                                                    </Box>
                                                    <Box>
                                                        <InputGroup margin="0">
                                                            <InputLeftElement pointerEvents="none"
                                                                children={<IoPricetagsOutline color='black' />}
                                                            />
                                                            <Input placeholder='.....' type="number" variant="flushed" onChange={(e) => setPrice(e.target.value)} />
                                                        </InputGroup>
                                                    </Box>
                                                </Box>
                                                <Text textAlign="center" color="red.400">{msgHighSeason}</Text>
                                                <Center>
                                                    <Button colorScheme='blue' variant="outline" onClick={handleSubmitHighSeason} marginTop="20px" width="100%">
                                                        {load ? <Spinner /> : "Save"}
                                                    </Button>
                                                </Center>
                                            </Box>
                                        )}
                                    </Box>
                                ) : null}
                            </Box>
                        </Flex>
                    </DrawerBody>
                    <DrawerFooter>
                        <Button onClick={() => dispatch(closeModalCertainDate())}>Cancel</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}

export default InputCertainDate
