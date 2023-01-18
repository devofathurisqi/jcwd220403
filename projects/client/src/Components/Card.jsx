import { Box, Text, Image, Flex, Center } from '@chakra-ui/react';
import { useState } from 'react';
import Axios from 'axios';
import { useEffect } from 'react';
import { getPreciseDistance } from 'geolib';
import { PulseLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import axios from "../api/axios"
import { Carousel } from 'react-responsive-carousel';


function HomeCard() {
    const [currentData, setCurrentData] = useState()
    const [loading, setLoading] = useState(false);

    const getdata = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/landingpage")
            setCurrentData(response.data)
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getdata();
    }, []);

    const Loadingg = () => {
        return (
            <Center>
                <PulseLoader color='#19b4b5' size={30} margin='50px 0px' />
            </Center>
        );
    };

    return (
        <>
            {loading ? (
                <Loadingg />
            ) : (
                <Center>
                    <motion.div
                        className='card'
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Flex
                            flexWrap={'wrap'}
                            justifyContent='center'
                            position='relative'
                            bgColor='white'
                            mt='3'
                        >
                            {currentData && currentData.map((item) => {
                                return (
                                    <Box
                                        _hover={{ cursor: 'pointer' }}
                                        w='270px'
                                        h='260px'
                                        m='10px'
                                        boxSize='auto'
                                    >
                                        <Box
                                            borderRadius='13px'
                                            borderTopRadius='13px'
                                            overflow='hidden'
                                            width="270px"
                                            height="190px"
                                        >
                                            {/* <Image
                                                objectFit='cover'
                                                src={'http://localhost:2000/propertyPicture/' + item.picture}
                                                width='270px'
                                                height='190px'
                                            /> */}
                                            <Carousel
                                                infiniteLoop
                                                showArrows={true}>
                                                {item.propertypictures.map((image, i) => (
                                                    <Box key={i}>
                                                        <Image
                                                            objectFit='cover'
                                                            src={'http://localhost:2000/propertyPicture/' + image.picture}
                                                            width='270px'
                                                            height='190px'
                                                        />
                                                    </Box>
                                                ))}
                                            </Carousel>
                                        </Box>
                                        <Box px='10px' h='90px'>
                                            <Text mt='2' fontWeight='bold' fontSize='sm'>
                                                {item.name}
                                            </Text>
                                            {/* <Text mr='5px' fontSize='sm'>
                                                Berjarak{' '}
                                                {Math.ceil(
                                                    getPreciseDistance(
                                                        { latitude: cord.lat, longitude: cord.lng },
                                                        {
                                                            latitude: item.fields.geolocation[0],
                                                            longitude: item.fields.geolocation[1],
                                                        }
                                                    ) / 1000
                                                ) + ' km'}
                                            </Text> */}
                                            {/* <Text mr='5px' fontSize='sm'>
                                                <Text fontWeight='bold' display='inline'>
                                                    {item.description}
                                                </Text>
                                            </Text> */}
                                            <Text fontSize="sm" fontWeight="bold" color="gray.400" display="inline">
                                            {item.category.country}, {item.category.province}, {item.category.city}
                                            </Text>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Flex>
                    </motion.div>
                </Center>
            )}
        </>
    );
}
export default HomeCard;