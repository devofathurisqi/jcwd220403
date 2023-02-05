import { Box, Text, Image, Flex, Center, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import useSearch from '../hooks/useSeacrh';
import Slider from 'react-slick';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { getPreciseDistance } from 'geolib';
import 'swiper/css';

function HomeCard() {
  const [currentData, setCurrentData] = useState();
  console.log(currentData)
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1)
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
  }


  // ----------------------------------------------------------------------

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <Button
        bg="white"
        onClick={onClick}
        onMouseEnter={() => setActiveIndex(activeIndex)}
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
        onMouseEnter={() => setActiveIndex(activeIndex)}
        bg="white"
        onClick={onClick}
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
                currentData.map((item, index) => {
                  return (
                    <Box
                      as={Link}
                      key={index}
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
                        <Slider
                          dots={true}
                          infinite={true}
                          speed={500}
                          slidesToShow={1}
                          slidesToScroll={1}
                          nextArrow={activeIndex === index ? <NextArrow /> : null}
                          prevArrow={activeIndex === index ? <PrevArrow /> : null}
                        >
                          {item.propertypictures.map((image, i) => (
                            <Box key={i} onMouseEnter={() => setActiveIndex(index)}
                              onMouseOut={() => (setActiveIndex(-1))}>
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
                        </Slider>
                      </Box>
                      <Box px='10px' h='90px'>
                        <Text mt='2' fontWeight='bold' fontSize='sm'>
                          {item.name}
                        </Text>
                        <Text
                          fontSize='sm'
                          fontWeight='bold'
                          color='gray.400'
                        >
                          {item.category.country}, {item.category.province},{' '}
                          {item.category.city}
                        </Text>
                        <Text fontWeight='bold' fontSize='sm' color="gray.400">
                          Located {(getPreciseDistance(
                            { latitude: -6.201148, longitude: 106.950827 },
                            { latitude: item.category.locationDetail.coordinates[0], longitude: item.category.locationDetail.coordinates[1] }
                          ) / 1000).toFixed(2)} Km from Jakarta
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