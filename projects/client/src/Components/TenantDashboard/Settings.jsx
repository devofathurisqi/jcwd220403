import React from 'react'
import { Box, Flex, Image, Text,Button, useBreakpointValue } from "@chakra-ui/react"
import settingsPicture from "../../Assets/settings.jpg"
import useAuth from '../../hooks/useAuth'

const Settings = () => {
    const { auth } = useAuth();
    const createdAt = new Date(auth.createdAt)
    const now = new Date() - createdAt
    const diffDays = Math.ceil(now / (100 * 60 * 60 * 24))

    const directionFlex = useBreakpointValue({
        base: "column",
        md: "column",
        lg: "row"
    })
    const widthFlex = useBreakpointValue({
        base: "100%",
        md: "100%",
        lg: "50%"
    })

    return (
        <Box p={6}>
            <Flex justifyContent="center" alignItems="center" flexDirection={directionFlex}>
                <Flex width={widthFlex}>
                    <Image src={settingsPicture} width="100%" margin="auto" />
                </Flex>
                <Flex width={widthFlex} flexDirection="column" flex="1">
                    <Box borderBottom="1px solid black">
                        <Text color="#3434f4" textAlign="center" fontSize="32px" fontFamily="sans-serif" letterSpacing="4px">Mengakhiri</Text>
                        <Text color="#3434f4" textAlign="center" fontSize="32px" fontFamily="sans-serif" letterSpacing="4px">Sebagai Tenant</Text>
                    </Box>
                    <Text marginTop="30px" color="#3434f4" fontFamily="sans-serif">
                        Halo {auth.name}, kami sangat menyesal jika ada hal yang membuat Anda ingin membatalkan status
                        sebagai tenant di Holistay.
                    </Text>
                    <Text marginTop="10px" color="#3434f4" fontFamily="sans-serif">
                        Sudah {diffDays} hari anda disini, dan holistay sangat berterima kasih atas partisipasi anda
                        untuk mempercayai holistay mengembangkan property anda, kami harap anda akan mempertimbagkan keputusan anda
                    </Text>
                    <Button marginTop="10px" width="100%" colorScheme="facebook">Akhiri Sekarang</Button>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Settings
