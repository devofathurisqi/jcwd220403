import React, { useState } from 'react';
import {
  Box,
  Center,
  Text,
  Flex,
  Card,
  CardBody,
  Heading,
  useBreakpointValue,
  Button,
  Spinner,
  Icon
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { DataFasility } from '../../Data/DataFasility';
import { useDispatch } from 'react-redux';
import { submitClicked } from '../../Redux/ButtonSlice';
import { BsCheckLg } from 'react-icons/bs';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import axios from '../../api/axios';

const InputFasility = () => {
  const [clickedItem, setClickedItem] = useState([]);
  const [load, setLoad] = useState(false);
  const [checklis, setChecklist] = useState(false);
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();

  const handleItemClick = (item) => {
    if (clickedItem.includes(item)) {
      setClickedItem(clickedItem.filter((i) => i !== item));
    } else {
      setClickedItem([...clickedItem, item]);
    }
  };

  const handleSubmit = async () => {
    try {
      const DataFacilityString = clickedItem
        .map((facility) => facility.title)
        .join(', ');
      await axios.post('/betenant', {
        name: DataFacilityString,
      });
      setLoad(true);
      setTimeout(() => {
        setLoad(false);
        setChecklist(true);
        dispatch(submitClicked());
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  const Setting = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
      },
    },
  };

  //everything for responsive

  const fontSize = useBreakpointValue({
    base: '16px',
    md: '34px',
    lg: '42px',
  });

  const textAlign = useBreakpointValue({
    base: 'center',
    md: '',
    lg: '',
  });
  const width = useBreakpointValue({
    base: '150px',
    md: '200px',
    lg: '200px',
  });

  return (
    <Box>
      <Center>
        <Box width='650px'>
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Text
              fontFamily='Uniform Pro Medium'
              fontSize={fontSize}
              fontWeight='bold'
              textAlign={textAlign}
            >
              Fasilitas apa saja yang
            </Text>
            <Text
              fontFamily='Uniform Pro Medium'
              fontSize={fontSize}
              fontWeight='bold'
              textAlign={textAlign}
            >
              ada di tempat Anda?
            </Text>
            <Center>
              {load ? (
                <Button
                  onClick={handleSubmit}
                  backgroundColor='white'
                  color='black'
                  padding='15px'
                  _hover={{ fontWeight: 'bold' }}
                  isDisabled={true}
                >
                  <Spinner color='black' />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  backgroundColor='white'
                  color='black'
                  padding='15px'
                  _hover={{ fontWeight: 'bold' }}
                  style={{ border: checklis ? '' : '2px solid black' }}
                  borderRadius='20px'
                  isDisabled={checklis}
                >
                  {checklis ? <BsCheckLg /> : 'Submit'}
                </Button>
              )}
            </Center>
          </motion.div>
          <motion.div variants={Setting} initial='hidden' animate='visible'>
            <Flex
              flexWrap='wrap'
              marginTop='10px'
              gap='10px'
              cursor='pointer'
              justifyContent='center'
            >
              {DataFasility.map((item, index) => (
                <Card
                  key={index}
                  width={width}
                  onClick={() => handleItemClick(item)}
                  style={
                    clickedItem.includes(item)
                      ? { border: '2px solid black', fontWeight: 'bold' }
                      : null
                  }
                  _hover={{ border: '2px solid black' }}
                >
                  <CardBody>
                    <Box>
                      <Icon as={item.img} boxSize="25px"/>
                      <Text pt='2' fontSize='md'>
                        {item.title}
                      </Text>
                    </Box>
                  </CardBody>
                </Card>
              ))}
            </Flex>
          </motion.div>
          <br />
          <br />
          <br />
          <br />
        </Box>
      </Center>
    </Box>
  );
};

export default InputFasility;
