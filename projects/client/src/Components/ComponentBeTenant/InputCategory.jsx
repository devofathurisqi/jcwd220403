import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  Input,
  Center,
  Text,
  Button,
  Spinner,
  useBreakpointValue,
  List,
  ListItem,
  Stack,
  InputGroup,
  InputLeftElement,
  Icon
} from '@chakra-ui/react';
// import axios from 'axios';
import axios from '../../api/axios';
import { useDispatch } from 'react-redux';
import { submitClickedToFalse } from '../../Redux/ButtonSlice';
import { BsCheckLg } from 'react-icons/bs';
import { motion } from 'framer-motion';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { AiOutlineSearch } from "react-icons/ai"
import Axios from "axios"

const InputCategory = () => {
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const [dataProvince, setDataProvince] = useState([]);
  const [dataCity, setDataCity] = useState([])
  const [selectedProvince, setSelectedProvince] = useState(null)

  //localstate untuk formdata
  const [country, setCountry] = useState('Indonesia');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [msg, setMsg] = useState('');

  const [load, setLoad] = useState(false);
  const [checklis, setChecklist] = useState(false);

  //validasi category
  const isErrorCountry = country === ''
  const isErrorProvince = province === ''
  const isErrorCity = city === '';

  const width = useBreakpointValue({
    base: '300px',
    md: '500px',
    lg: '500px',
  });

  const getDataProvince = async () => {
    try {
      const response = await Axios.get("https://dev.farizdotid.com/api/daerahindonesia/provinsi")
      setDataProvince(response.data.provinsi)
    } catch (err) {
      console.log(err)
    }
  }

  const getDataCity = async () => {
    try {
      const response = await Axios.get(`https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${selectedProvince}`)
      setDataCity(response.data.kota_kabupaten)
    } catch (err) {
      console.log(err)
    }
  }

  const convertNameProvince = () => {
    const result = dataProvince.find(item => item.nama === province)
    setSelectedProvince(result ? result.id : null)
  }

  useEffect(() => {
    getDataCity()
  }, [selectedProvince])

  useEffect(() => {
    convertNameProvince()
  }, [province])

  useEffect(() => {
    getDataProvince();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/category', {
        country,
        province,
        city,
      });
      setLoad(true);
      setTimeout(() => {
        setLoad(false);
        setChecklist(true);
        dispatch(submitClickedToFalse());
      }, 3000);
    } catch (err) {
      console.log(err);
      if (err.response) {
        setMsg(err.response.data);
        setLoad(false);
      }
    }
  };

  return (
    <Box>
      <Box>
        <Text
          fontFamily='Uniform Pro Medium'
          fontSize='32px'
          fontWeight='bold'
          textAlign='center'
        >
          Lokasi detail
        </Text>
        <Text
          fontFamily='Uniform Pro Medium'
          fontSize='32px'
          fontWeight='bold'
          textAlign='center'
        >
          untuk properti anda
        </Text>
      </Box>
      <Center>
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Box
            boxShadow='lg'
            border='2px solid white'
            borderRadius='30px'
            width={width}
            padding='20px'
          >
            <form onSubmit={handleSubmit}>
              <FormControl
                isInvalid={isErrorCountry}
                width='auto'
                marginTop='20px'
              >
                <FormLabel>Country</FormLabel>
                <Input
                  variant='flushed'
                  type="text"
                  value="Indonesia"
                />

                {isErrorCountry ? (
                  <FormHelperText color='red'>
                    Country is required
                  </FormHelperText>
                ) : (
                  <FormHelperText color='#478fd3'>
                    Select country success
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl isInvalid={isErrorProvince} width='auto'>
                <FormLabel>Province</FormLabel>
                <Select
                  variant='flushed'
                  type="text"
                  placeholder='Province?'
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                >
                  {dataProvince.map((item, index) => (
                    <option key={index} value={item.nama}>{item.nama}</option>
                  ))}
                </Select>
                {isErrorProvince ? (
                  <FormHelperText color='red'>
                    Province is required
                  </FormHelperText>
                ) : (
                  <FormHelperText color='#478fd3'>
                    Create province success
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl isInvalid={isErrorCity} width='auto'>
                <FormLabel>City</FormLabel>
                <Select
                  placeholder='Pilih Opsi'
                  width="auto"
                  variant="flushed"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  {dataCity.map((item, index) => (
                    <option key={index}>{item.nama}</option>
                  ))}
                </Select>
                {isErrorCity ? (
                  <FormHelperText color='red'>City is required</FormHelperText>
                ) : (
                  <FormHelperText color='#478fd3'>
                    Create city success
                  </FormHelperText>
                )}
              </FormControl>
              <Text color='red' marginTop='10px' textAlign='center'>
                {msg}
              </Text>
              <Center>
                <Center>
                  {load ? (
                    <Button
                      onClick={handleSubmit}
                      backgroundColor='white'
                      color='black'
                      padding='25px'
                      _hover={{ fontWeight: 'bold' }}
                      marginTop='10px'
                      marginBottom='10px'
                      isDisabled={true}
                    >
                      <Spinner color='black' />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      backgroundColor='white'
                      color='black'
                      marginTop='10px'
                      marginBottom='10px'
                      padding='25px'
                      _hover={{ fontWeight: 'bold' }}
                      style={{ border: checklis ? '' : '2px solid black' }}
                      borderRadius='20px'
                      isDisabled={checklis}
                    >
                      {checklis ? <BsCheckLg /> : 'Submit'}
                    </Button>
                  )}
                </Center>
              </Center>
              <br />
              <br />
              <br />
            </form>
          </Box>
        </motion.div>
      </Center>
    </Box>
  );
};

export default InputCategory;
