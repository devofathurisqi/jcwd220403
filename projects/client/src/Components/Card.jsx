import { Box, Text, Image, Flex, Center } from '@chakra-ui/react';
import { useState } from 'react';
import { useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import useSearch from '../hooks/useSeacrh';

function HomeCard() {
  const [currentData, setCurrentData] = useState();
  const [loading, setLoading] = useState(false);
  const { search } = useSearch();

  const getdata = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/landingpage', search);
      setCurrentData(response.data);
      setLoading(false);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getdata();
  }, [search]);

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
              {currentData &&
                currentData.map((item) => {
                  return (
                    <Box
                      as={Link}
                      to={'/detailpage/' + item.id}
                      w='270px'
                      h='260px'
                      m='10px'
                      boxSize='auto'
                    >
                      <Box
                        borderRadius='13px'
                        borderTopRadius='13px'
                        overflow='hidden'
                        width='270px'
                        height='190px'
                      >
                        {/* <Image
                                                    objectFit='cover'
                                                    src={'http://localhost:2000/propertyPicture/' + item.picture}
                                                    width='270px'
                                                    height='190px'
                                                /> */}
                        <Carousel infiniteLoop showArrows={true}>
                          {item.propertypictures.map((image, i) => (
                            <Box key={i}>
                              <Image
                                objectFit='cover'
                                src={
                                  'http://localhost:2000/propertyPicture/' +
                                  image.picture
                                }
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
                        <Text
                          fontSize='sm'
                          fontWeight='bold'
                          color='gray.400'
                          display='inline'
                        >
                          {item.category.country}, {item.category.province},{' '}
                          {item.category.city}
                        </Text>
                        <Text mt='2' fontWeight='bold' fontSize='sm'>
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.rooms[0].price)}
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