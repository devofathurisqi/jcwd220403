import React from 'react'
import { Box, Text, Image } from "@chakra-ui/react"
import Footer from '../Footer'
import NavBot from '../NavBot'
import empty from "../../Assets/empty.jpg"



const EmptyDashboard = () => {
    return (    
        <Box>
            <Box width="500px" margin="auto">
                <Image src={empty}/>
            </Box>
            <Footer />
            <NavBot />
        </Box>
    )
}

export default EmptyDashboard
