import React, { useState } from 'react'
import {
    Box,
    Flex,
    Stack,
    Text,
    Icon,
    useColorMode,
    useMediaQuery,
    Divider,
    Center,
    Spacer,
    useBreakpointValue
} from '@chakra-ui/react';
import { RxDashboard } from "react-icons/rx"
import { MdOutlineApartment } from "react-icons/md"
import { BsPersonPlus } from "react-icons/bs"
import { AiOutlineIdcard, AiOutlineMessage, AiOutlineTransaction, AiFillSetting } from "react-icons/ai"
import { TbReport } from "react-icons/tb"
import { RiAdminLine } from "react-icons/ri"
import { ImFeed } from "react-icons/im"
import { GiHouse } from "react-icons/gi"
import { useSelector } from "react-redux"
import TransactionUser from '../Tenant/Transaction/TransactionUser';

//import component
import Property from './Property';
import Room from './Room';
import ReportPages from '../../Pages/Tenant/Report';
import ChartLine from '../Tenant/Report/ChartLine';
import AgendaCalender from '../Tenant/Report/CalenderAgenda';
import DashboardHomeTenant from '../../Pages/Tenant/DashboardHomeTenant';
import Settings from './Settings';

const SideBarDashboardAndRenderComponent = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const [activeIndexTwo, setActiveIndexTwo] = useState(-1)
    const activeIndexFromMobile = useSelector((state) => state.PropertySlice.value.index)
    console.log(activeIndexFromMobile)
    const items = [
        {
            title: "Dashboard",
            icon: RxDashboard
        },
        {
            title: "Properties",
            icon: MdOutlineApartment
        },
        {
            title: "Room List",
            icon: GiHouse
        },
        {
            title: "Resident & Leases",
            icon: AiOutlineIdcard
        },
        {
            title: "Messages",
            icon: AiOutlineMessage
        },
        {
            title: "Transactions",
            icon: AiOutlineTransaction
        },
        {
            title: "Report",
            icon: TbReport
        },
        {
            title: "Setting",
            icon: AiFillSetting
        },
    ];

    const itemsTwo = [
        {
            title: "Help Center",
            icon: RiAdminLine
        },
        {
            title: "Provide Feedback",
            icon: ImFeed
        }
    ]

    const handleClick = (index) => {
        if (activeIndex >= 0) {
            setActiveIndexTwo(-1)
        }
        setActiveIndex(index);
    }
    const handleClickTwo = (index) => {
        if (activeIndexTwo >= 0) {
            setActiveIndex(-1)
        }
        setActiveIndexTwo(index);
    }

    const displayMobile = useBreakpointValue({
        base: "none",
        md: "block",
        lg: "block"
    })

    const widthSideNavbar = useBreakpointValue({
        base: "",
        md: "25%",
        lg: "15%"
    })
    const widthRenderComponent = useBreakpointValue({
        base: "100%",
        md: "75%",
        lg: "85%"
    })

    const RenderComponent = () => {
        if (activeIndex === 0 || activeIndexFromMobile === 0) {
            return (
                <Box>
                    <DashboardHomeTenant/>
                </Box>
            )
        } else if (activeIndex === 1 || activeIndexFromMobile === 1) {
            return (
                <Box>
                    <Property />
                </Box>
            )
        } else if (activeIndex === 2 || activeIndexFromMobile === 2) {
            return (
                <Box>
                    <Room />
                </Box>
            )
        }
        else if (activeIndex === 5 || activeIndexFromMobile === 5){
            return (
                <Box>
                    <TransactionUser/> 
                </Box>
            )
        }
        else if (activeIndex === 6 || activeIndexFromMobile === 6){
            return (
                <Box>
                    <ReportPages/> 
                </Box>
            )
        } else if (activeIndex === 7 || activeIndexFromMobile === 7){
            return (
                <Box>
                    <Settings/>
                </Box>
            )
        }
    }

    return (
        <Box display="flex">
            <Box display={displayMobile} width={widthSideNavbar}>
                <Flex
                    direction="column"
                    backgroundColor="#edeff1"
                    width="auto"
                    gap="5px"
                    height="100%"
                >
                    {items.map((item, index) => (
                        <Box key={index} p={2}>
                            <Flex gap="10px" alignItems="center" onClick={() => handleClick(index)} cursor="pointer">
                                <Icon as={item.icon} boxSize="20px" color={index === activeIndex ? "#1e6fc2" : "#75787b"} />
                                <Text color={index === activeIndex ? "black" : "#757b7b"} fontFamily="sans-serif">{item.title}</Text>
                            </Flex>
                        </Box>
                    ))}
                    <Box p={2}>
                        <Divider orientation='horizontal' borderColor="black" />
                    </Box>
                    {itemsTwo.map((item, index) => (
                        <Box key={index} p={2} onClick={() => handleClickTwo(index)} cursor="pointer">
                            <Flex gap="10px"  >
                                <Icon as={item.icon} boxSize="20px" color={index === activeIndexTwo ? "#1e6fc2" : "#75787b"} />
                                <Text color={index === activeIndexTwo ? "black" : "#75787b"} fontFamily="sans-serif" >{item.title}</Text>
                            </Flex>
                        </Box>
                    ))}
                    <Spacer />
                    <Box p={2}>
                        <Divider borderColor="black" />
                        <Text color="#75787b" fontSize="12px">Terms of Service</Text>
                        <Text color="#75787b" fontSize="12px">Privacy Policy</Text>
                        <Divider borderColor="black" />
                        <Text color="#75787b" fontSize="12px">@ 2022 Openrent. inc</Text>
                    </Box>
                </Flex>
            </Box>
            <Box width={widthRenderComponent}>
                <RenderComponent />
            </Box>
        </Box>
    )
}

export default SideBarDashboardAndRenderComponent
