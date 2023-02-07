import React, { useState } from 'react';
import {
  Box,
  Text,
  Image,
  Button,
  Center,
  useMediaQuery,
  useBreakpointValue,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { CategorySliders } from '../Data/CategorySliders';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { SettingsIcon } from '@chakra-ui/icons';
// import "~slick-carousel/slick/slick.css";
import { DataFasility } from '../Data/DataFasility';
// import "~slick-carousel/slick/slick-theme.css";

import { AnimatePresence, motion } from 'framer-motion';
import Slider from 'react-slick';

//untuk swipe di mobile
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { BsFilterRight } from 'react-icons/bs';
import useSearch from '../hooks/useSeacrh';

const Category = () => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  // console.log(currentIndex);
  const [isMobile] = useMediaQuery('(max-width: 481px)');
  const [isTablet] = useMediaQuery('(max-width: 868px) and (min-width: 481px)');
  const numCards = isTablet ? 6 : 10;
  const { search, setSearch } = useSearch();

  // console.log(search);

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <Button
        bg='white'
        onClick={onClick}
        sx={{
          position: 'absolute',
          right: '-20px',
          top: 'calc(50% - 20px)',
          color: 'black',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
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
        bg='white'
        onClick={onClick}
        sx={{
          position: 'absolute',
          left: '-20px',
          top: 'calc(50% - 20px)',
          color: 'black',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FaArrowLeft />
      </Button>
    );
  };

  const slidesToShowResponsive = useBreakpointValue({
    base: 4,
    md: 7,
    lg: 10,
  });
  const slidesToScrollResponsinve = useBreakpointValue({
    base: 4,
    md: 3,
    lg: 3,
  });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShowResponsive,
    slidesToScroll: slidesToScrollResponsinve,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const sizeFont = useBreakpointValue({
    base: '8px',
    md: '10px',
    lg: '12px',
  });
  const iconSize = useBreakpointValue({
    base: '25px',
    md: '20px',
    lg: '25px',
  });

  const displayButtonFilter = useBreakpointValue({
    base: 'none',
    md: 'block',
    lg: 'block',
  });

  return (
    <Center>
      <Flex justifyContent='center' alignItems='center' width='90%'>
        <Box p={6} width='90%'>
          <Slider {...settings}>
            {DataFasility.map((item, index) => (
              <Box
                key={item.id}
                cursor='pointer'
                color={index === currentIndex ? 'black' : '#717171'}
                _hover={{ color: 'black' }}
                onClick={() => {
                  setCurrentIndex(currentIndex === index ? -1 : index);
                  setSearch(
                    currentIndex === index
                      ? { ...search, fasilitas: '' }
                      : { ...search, fasilitas: item.title }
                  );
                }}
                borderBottom={index === currentIndex ? '2px solid black' : null}
                width='40px'
              >
                <Flex
                  flexDirection='column'
                  justifyContent='center'
                  alignItems='center'
                >
                  <Icon as={item.img} boxSize={iconSize} />
                  <Text
                    fontSize={sizeFont}
                    fontWeight='bold'
                    fontFamily='sans-serif'
                  >
                    {item.title}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Slider>
        </Box>
        <Box width='10%' display={displayButtonFilter}>
          <Button
            backgroundColor='white'
            border='1px solid #717171'
            leftIcon={<BsFilterRight />}
            width='75px'
          >
            Filter
          </Button>
        </Box>
      </Flex>
    </Center>
  );
};
export default Category;
