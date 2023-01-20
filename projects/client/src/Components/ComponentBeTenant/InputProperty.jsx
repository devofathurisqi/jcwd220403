import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Box,
  Text,
  useBreakpointValue,
  Center,
  Button,
  Spinner,
  useMediaQuery,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { submitClicked } from '../../Redux/ButtonSlice';
import { BsCheckLg } from 'react-icons/bs';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const InputProperty = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null);
  const [msg, setMsg] = useState('');
  const [load, setLoad] = useState(false);
  const [checklis, setChecklist] = useState(false);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  //validasi property
  const isErrorName = name === '';
  const isErrorDesc = description === '';

  const handlePictureChange = (e) => {
    setPicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('file', picture);
      formData.append('tenantId', auth.tenantId);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      await axiosPrivate.post(
        'http://localhost:2000/api/properties',
        formData,
        config
      );
      setLoad(true);
      setTimeout(() => {
        setLoad(false);
        setChecklist(true);
        dispatch(submitClicked());
      }, 3000);
    } catch (err) {
      if (err.response) {
        setMsg(err.response.data);
        setLoad(false);
      }
    }
  };

  //everything for responsive
  const width = useBreakpointValue({
    base: '300px',
    md: '500px',
    lg: '500px',
  });
  const [MobileToTablet] = useMediaQuery('(max-width: 820px)');

  return (
    <Box marginTop='30px'>
      <Box textAlign='center'>
        <Text
          fontFamily='Uniform Pro Medium'
          fontSize='32px'
          fontWeight='bold'
          textAlign='center'
        >
          Property detail
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
            textAlign='center'
            width={width}
            borderRadius='30px'
            border='2px solid white'
            padding='20px'
          >
            <Box marginTop='20px'>
              <form onSubmit={handleSubmit}>
                <Text color='red'>{msg}</Text>
                <FormControl isInvalid={isErrorName}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    id='name'
                    type='text'
                    value={name}
                    variant='flushed'
                    placeholder='Enter your name property'
                    onChange={(e) => setName(e.target.value)}
                  />
                  {isErrorName ? (
                    <FormHelperText color='red'>
                      Name is required
                    </FormHelperText>
                  ) : (
                    <FormHelperText color='#478fd3'>
                      Create name success
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl isInvalid={isErrorDesc}>
                  <FormLabel>Description</FormLabel>
                  <Input
                    type='text'
                    value={description}
                    variant='flushed'
                    placeholder='Enter your description property'
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  {isErrorDesc ? (
                    <FormHelperText color='red'>
                      Description is required
                    </FormHelperText>
                  ) : (
                    <FormHelperText color='#478fd3'>
                      Create description success
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Picture</FormLabel>
                  <Input
                    type='file'
                    variant='flushed'
                    onChange={handlePictureChange}
                  />
                </FormControl>
                <Center>
                  {load ? (
                    <Button
                      onClick={handleSubmit}
                      backgroundColor='white'
                      color='black'
                      marginTop='10px'
                      marginBottom='10px'
                      _hover={{ fontWeight: 'bold' }}
                      isDisabled='true'
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
                      _hover={{ fontWeight: 'bold' }}
                      style={{ border: checklis ? '' : '2px solid black' }}
                      borderRadius='20px'
                      isDisabled={checklis}
                    >
                      {checklis ? <BsCheckLg /> : 'Submit'}
                    </Button>
                  )}
                </Center>
              </form>
            </Box>
            {MobileToTablet ? (
              <Box>
                <br />
                <br />
              </Box>
            ) : (
              <Box>
                <br />
                <br />
                <br />
                <br />
              </Box>
            )}
          </Box>
        </motion.div>
      </Center>
    </Box>
  );
};

export default InputProperty;
