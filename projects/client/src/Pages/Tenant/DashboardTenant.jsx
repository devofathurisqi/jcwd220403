import React from 'react'
import { Box } from "@chakra-ui/react"

//import component
import NavbarDashboard from '../../Components/TenantDashboard/NavbarDashboard'
import SideBarDashboardAndRenderComponent from '../../Components/TenantDashboard/SideBarDashboardAndRenderComponent'

const DashboardTenant = () => {
    return (
        <Box>
            <NavbarDashboard/>
            <SideBarDashboardAndRenderComponent/>
        </Box>
    )
}

export default DashboardTenant
