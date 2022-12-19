import React from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Spacer,
    Text,
    Flex,
    Image,
    Icon,
    ListItem,
    UnorderedList,
    useMediaQuery,
    useBreakpointValue
} from '@chakra-ui/react'
import Logo from "../Asset/Logo.png"
import { FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi"

const Footer = () => {
    const [isMobile] = useMediaQuery("(max-width: 481px)")
    const display = useBreakpointValue({
        base: 'none',
        md: "block"
    });
    const FooterMobile = () => {
        if (isMobile) {
            return (
                <Flex flexDirection="column">
                    <Box flex="1" display="flex" flexDirection="column" padding="20px">
                        <Image src={Logo} width="20%" />
                        <Text margin="20px 0px" fontSize="sm">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Enim eos ipsa illo voluptatibus voluptatem tempore
                            quae iste recusandae commodi qui,
                            veniam nihil dignissimos blanditiis eveniet natus
                            fugit provident inventore facilis.
                        </Text>
                        <Box display="flex" >
                            <Icon as={FiTwitter} color="white"
                                width="30px"
                                height="30px"
                                borderRadius="30%"
                                alignItems="center"
                                justifyContent="center"
                                marginRight="20px"
                                backgroundColor="#00acee" />
                            <Icon as={FiInstagram} color="white"
                                width="30px"
                                height="30px"
                                borderRadius="30%"
                                alignItems="center"
                                justifyContent="center"
                                marginRight="20px"
                                backgroundColor="#FF9E9E" />
                            <Icon as={FiLinkedin} color="white"
                                width="30px"
                                height="30px"
                                borderRadius="30%"
                                alignItems="center"
                                justifyContent="center"
                                marginRight="20px"
                                backgroundColor="#0e76a8" />
                        </Box>
                    </Box>
                    <Box flex="1" padding="20px" display="none">
                        <Text marginBottom="30px" fontWeight="bold">Useful Links</Text>
                        <Box margin="0" padding="0" display="flex" flexWrap="wrap">
                            <UnorderedList marginRight="40px">
                                <ListItem>Home</ListItem>
                                <ListItem>Tennant</ListItem>
                                <ListItem>Profile</ListItem>
                                <ListItem>Order Tracking</ListItem>
                            </UnorderedList>
                            <UnorderedList>
                                <ListItem>Wishlist</ListItem>
                                <ListItem>Terms</ListItem>
                                <ListItem>Setting</ListItem>
                                <ListItem>Category</ListItem>
                            </UnorderedList>
                        </Box>
                    </Box>
                    <Box flex="1" padding="20px" backgroundColor="#fff8f8">
                        <Text marginBottom="30px" fontWeight="bold">Contact</Text>
                        <Box marginBottom="20px" display="flex" alignItems="center">
                            <Text marginRight="10px">Jakarta Selatan, Gedung Sinarmas Lt.13</Text>
                        </Box>
                        <Box marginBottom="20px" display="flex" alignItems="center">
                            <Text marginRight="10px">0892 2346 7621</Text>
                        </Box>
                        <Box marginBottom="20px" display="flex" alignItems="center">
                            <Text marginRight="10px">Securesally@gmail.com</Text>
                        </Box>
                        <Image src='https://i.ibb.co/Qfvn4z6/payment.png' width="50%" />
                    </Box>
                </Flex>
            )
        }
    }

    return (
        <div>
            <Box position="fixed" zIndex={1} style={{minWidth:"100%"}} p={0} bottom={0} bg="white" >
               <Accordion defaultIndex={[1]} allowMultiple display={display}>
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box as="span" flex='1' textAlign='center'>
                                    <Text fontWeight="Bold" fontFamily="sans-serif" fontSize="14px">
                                        @2022 Holistay,Inc . Privasi . Ketentuan . Peta Situs
                                    </Text>
                                </Box>
                                <Spacer />
                                <Box as="span" flex='1' textAlign='center'>
                                    <Text fontWeight="bold" fontFamily="sans-serif" fontSize="14px">
                                        Indonesia $USD Dukungan $ sumber Informasi
                                    </Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <Flex>
                                <Box flex="1" display="flex" flexDirection="column" padding="20px">
                                    <Image src={Logo} width="25%" />
                                    <Text margin="20px 0px">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                        Enim eos ipsa illo voluptatibus voluptatem tempore
                                        quae iste recusandae commodi qui,
                                        veniam nihil dignissimos blanditiis eveniet natus
                                        fugit provident inventore facilis.
                                    </Text>
                                    <Box display="flex" >
                                        <Icon as={FiTwitter} color="white"
                                            width="30px"
                                            height="30px"
                                            borderRadius="30%"
                                            alignItems="center"
                                            justifyContent="center"
                                            marginRight="20px"
                                            backgroundColor="#00acee" />
                                        <Icon as={FiInstagram} color="white"
                                            width="30px"
                                            height="30px"
                                            borderRadius="30%"
                                            alignItems="center"
                                            justifyContent="center"
                                            marginRight="20px"
                                            backgroundColor="#FF9E9E" />
                                        <Icon as={FiLinkedin} color="white"
                                            width="30px"
                                            height="30px"
                                            borderRadius="30%"
                                            alignItems="center"
                                            justifyContent="center"
                                            marginRight="20px"
                                            backgroundColor="#0e76a8" />
                                    </Box>
                                </Box>
                                <Box flex="1" padding="20px">
                                    <Text marginBottom="30px" fontWeight="bold">Useful Links</Text>
                                    <Box margin="0" padding="0" display="flex" flexWrap="wrap">
                                        <UnorderedList marginRight="40px">
                                            <ListItem>Home</ListItem>
                                            <ListItem>Tennant</ListItem>
                                            <ListItem>Profile</ListItem>
                                            <ListItem>Order Tracking</ListItem>
                                        </UnorderedList>
                                        <UnorderedList>
                                            <ListItem>Wishlist</ListItem>
                                            <ListItem>Terms</ListItem>
                                            <ListItem>Setting</ListItem>
                                            <ListItem>Category</ListItem>
                                        </UnorderedList>
                                    </Box>
                                </Box>
                                <Box flex="1" padding="20px">
                                    <Text marginBottom="30px" fontWeight="bold">Contact</Text>
                                    <Box marginBottom="20px" display="flex" alignItems="center">
                                        <Text marginRight="10px">Jakarta Selatan, Gedung Sinarmas Lt.13</Text>
                                    </Box>
                                    <Box marginBottom="20px" display="flex" alignItems="center">
                                        <Text marginRight="10px">0892 2346 7621</Text>
                                    </Box>
                                    <Box marginBottom="20px" display="flex" alignItems="center">
                                        <Text marginRight="10px">Securesally@gmail.com</Text>
                                    </Box>
                                    <Image src='https://i.ibb.co/Qfvn4z6/payment.png' width="50%" />
                                </Box>
                            </Flex>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                </Box>
            <FooterMobile />
        </div>
    )
}

export default Footer