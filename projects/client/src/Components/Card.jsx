import { Box, Text, Image, Flex, Center, Button, Skeleton, SkeletonText, Spacer } from '@chakra-ui/react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import useSearch from '../hooks/useSeacrh';
import Slider from 'react-slick';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { getPreciseDistance } from 'geolib';
import 'swiper/css';

function HomeCard() {
  const [currentData, setCurrentData] = useState();
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { search } = useSearch();

  const getdata = async () => {
    try {
      const response = await axios.post('/landingpage', search);
      setCurrentData(response.data);
      setTimeout(() => {
        setLoading(false);
      }, 3000)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // ----------------------------------------------------------------------

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <Button
        bg='white'
        onClick={onClick}
        onMouseEnter={() => setActiveIndex(activeIndex)}
        style={{
          position: 'absolute',
          right: '5px',
          top: 'calc(50% - 20px)',
          color: 'black',
          borderRadius: '100%',
          width: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
          opacity: 1,
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
        bg='white'
        onClick={onClick}
        style={{
          position: 'absolute',
          left: '5px',
          top: 'calc(50% - 20px)',
          color: 'black',
          borderRadius: '100%',
          width: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
          opacity: 1,
        }}
      >
        <FaArrowLeft />
      </Button>
    );
  };

  return (
    <Flex flexDirection="column" gap="10px" justifyContent="center" alignItems="center" p={2}>
      <Flex flexWrap="Wrap" justifyContent="center" alignItems="center" gap="10px">
        {currentData && currentData.map((item, index) => (
          <Box key={index} width="280px" height="320px" boxShadow={activeIndex === index ? "dark-lg" : "md"}
            borderRadius="10px" p={1} cursor="pointer" as={Link} to={'/detailpage/' + item.id} position="relative">
            <Box>
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                nextArrow={
                  activeIndex === index ? <NextArrow /> : null
                }
                prevArrow={
                  activeIndex === index ? <PrevArrow /> : null
                }
              >
                {item.propertypictures.map((image, i) => (
                  <Box
                    key={i}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseOut={() => setActiveIndex(-1)}
                  >
                    <Skeleton isLoaded={!loading}>
                      <Image
                        objectFit='cover'
                        src={
                          process.env.REACT_APP_URL_PUBLIC +
                          'propertyPicture/' +
                          image.picture
                        }
                        width="100%"
                        height="150px"
                        borderRadius="10px"
                      />
                    </Skeleton>
                  </Box>
                ))}
              </Slider>
            </Box>
            <Box>
              <Text mt='8' fontWeight='bold' fontSize='sm' textAlign="center">
                <Skeleton isLoaded={!loading}>
                  {item.name}
                </Skeleton>
              </Text>
              <Text fontSize='sm' fontWeight='bold' color='gray.400' textAlign="center" marginTop="2px">
                <Skeleton isLoaded={!loading}>
                  {item.category.country}, {item.category.province},{' '}
                  {item.category.city}
                </Skeleton>
              </Text>
              <Text fontWeight='bold' fontSize='sm' color='gray.400' textAlign="center" marginTop="2px">
                <Skeleton isLoaded={!loading}>
                  Located{' '}
                  {(
                    getPreciseDistance(
                      { latitude: -6.201148, longitude: 106.950827 },
                      {
                        latitude:
                          item.category.locationDetail.coordinates[0],
                        longitude:
                          item.category.locationDetail.coordinates[1],
                      }
                    ) / 1000
                  ).toFixed(2)}{' '}
                  Km from Jakarta
                </Skeleton>
              </Text>
              <Text fontWeight='bold' fontSize='sm' position="absolute" bottom="2" left="50%" transform="translateX(-50%)">
                <Skeleton isLoaded={!loading} noOfLines={1}>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(item.rooms[0].price)}
                </Skeleton>
              </Text>
            </Box>
          </Box>
        ))
        }
      </Flex >
      <br />
      <br />
    </Flex >
  );
}
export default HomeCard;
