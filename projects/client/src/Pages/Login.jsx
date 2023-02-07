import {
  Flex,
  Box,
  Checkbox,
  Stack,
  Button,
  Heading,
  Divider,
  Text,
  HStack,
} from '@chakra-ui/react';

import { useState } from 'react';
import axios from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { FaFacebook, FaGoogle, FaTwitter } from 'react-icons/fa';
import { Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '../Components/TextField';
import useAuth from '../hooks/useAuth';

export default function LoginCard() {
  const { setAuth } = useAuth();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  function handleRedirect() {
    setInterval(() => {
      setLoginSuccess(true);
    }, 3000);
  }

  const handleSubmit = async (loginData) => {
    setDisableSubmitBtn(true);
    try {
      const res = axios.post('/login', loginData, {
        withCredentials: true,
        headers: { 'content-Type': 'application/json' },
      });

      const toastify = await toast.promise(
        res,
        {
          pending: 'Login on progress...',
          success: {
            render({ data }) {
              return `Login success, welcome ${data.data.name}`;
            },
          },
          error: {
            render({ data }) {
              return `${data.response.data.message}`;
            },
          },
        },
        { position: toast.POSITION.TOP_CENTER }
      );
      const { accessToken, userId, isTenant, name } = toastify.data;
      setAuth({
        email: loginData.email,
        userId,
        isTenant,
        name,
        accessToken,
      });
      handleRedirect();
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    setDisableSubmitBtn(false);
  };

  return loginSuccess ? (
    <Navigate to={from} replace={true} />
  ) : (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={Yup.object({
        password: Yup.string()
          .required('Password required')
          .min(8, 'Password is too short'),
        email: Yup.string().email('invalid email').required('email required'),
      })}
      onSubmit={async (values, actions) => {
        handleSubmit(values);
        actions.resetForm();
      }}
    >
      {(formik) => (
        <section>
          <ToastContainer />
          <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={
              'url(https://source.unsplash.com/random/1920x1080/?house) center/cover no-repeat'
            }
          >
            <Stack
              as='form'
              spacing={8}
              mx={'auto'}
              maxW={'xl'}
              py={5}
              px={6}
              onSubmit={formik.handleSubmit}
            >
              <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
                <Stack align={'center'} marginBottom={10}>
                  <Heading fontSize={'4xl'}>Login</Heading>
                </Stack>
                <Stack spacing={4}>
                  <TextField
                    require={true}
                    label='Email'
                    name='email'
                    placeholder='enter email'
                    type='email'
                  />

                  <TextField
                    require={true}
                    label='Password'
                    name='password'
                    type='password'
                    placeholder='enter password'
                  />
                  <Stack spacing={5}>
                    <Stack
                      direction={{ base: 'column', sm: 'row' }}
                      align={'start'}
                      justify={'space-between'}
                      gap={10}
                    >
                      <Checkbox>Remember me</Checkbox>
                      <Text color={'blue.400'}>
                        <RouterLink to='/forgotPassword'>
                          Forgot password?
                        </RouterLink>
                      </Text>
                    </Stack>
                    <Button
                      type='submit'
                      colorScheme='teal'
                      disabled={disableSubmitBtn}
                    >
                      Login
                    </Button>
                    <Divider />
                    <HStack>
                      <Button colorScheme='red' leftIcon={<FaGoogle />}>
                        Google
                      </Button>
                      <Button colorScheme='facebook' leftIcon={<FaFacebook />}>
                        Facebook
                      </Button>
                      <Button colorScheme='twitter' leftIcon={<FaTwitter />}>
                        Twitter
                      </Button>
                    </HStack>
                    <Stack direction={'horizontal'}>
                      <Text align={'center'} marginRight={2}>
                        Need an account?
                      </Text>
                      <Text color={'blue.400'} fontWeight={'bold'}>
                        <RouterLink to={'/register'}>Register here</RouterLink>
                      </Text>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Flex>
        </section>
      )}
    </Formik>
  );
}
