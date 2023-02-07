import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link as RouterLink } from 'react-router-dom';
import * as Yup from 'yup';
import { Field, ErrorMessage, Formik, Form } from 'formik';
import { FaFacebook, FaGoogle, FaTwitter } from 'react-icons/fa';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const registerSchema = Yup.object().shape({
    fullName: Yup.string()
      .required('Please enter your name')
      .min(3, 'Full Name should be at least three characters'),
    email: Yup.string().email().required('Please enter your email address'),
    password: Yup.string()
      .required('Please enter your password')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.,])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number, and One Special Character'
      ),
    repeatPassword: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Password does not matched'
    ),
  });

  const handleSubmit = async (data) => {
    try {
      const res = axios.post('/register', data, {
        withCredentials: true,
      });

      await toast.promise(
        res,
        {
          pending: 'Registration on progress...',
          success: {
            render({ data }) {
              return `${data.data.message}`;
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
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  return (
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
        <Stack spacing={4} mx={'auto'} maxW={'xl'} py={2} px={2} rounded='xl'>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={5}
          >
            <Stack align={'center'} marginBottom={5}>
              <Heading fontSize={'3xl'} textAlign={'center'}>
                Register
              </Heading>
            </Stack>

            <Formik
              initialValues={{
                FullName: '',
                email: '',
                password: '',
                repeatPassword: '',
              }}
              validationSchema={registerSchema}
              onSubmit={(values, action) => {
                handleSubmit(values);
                action.resetForm();
              }}
            >
              {(props) => {
                return (
                  <>
                    <Form>
                      <VStack spacing={4} align='center'>
                        <FormControl isRequired>
                          <FormLabel htmlFor='name'>Full Name</FormLabel>
                          <Field
                            as={Input}
                            type='text'
                            name='fullName'
                            variant='filled'
                          />
                          <ErrorMessage
                            style={{ color: 'red' }}
                            component='div'
                            name='fullName'
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel htmlFor='email'>Email</FormLabel>
                          <Field
                            as={Input}
                            type='email'
                            name='email'
                            variant='filled'
                          />
                          <ErrorMessage
                            style={{ color: 'red' }}
                            component='div'
                            name='email'
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel htmlFor='password'>Password</FormLabel>
                          <InputGroup>
                            <Field
                              as={Input}
                              type={showPassword ? 'text' : 'password'}
                              name='password'
                              variant='filled'
                            />

                            <InputRightElement h={'full'}>
                              <Button
                                variant={'ghost'}
                                onClick={() =>
                                  setShowPassword(
                                    (showPassword) => !showPassword
                                  )
                                }
                              >
                                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                          <ErrorMessage
                            component='div'
                            name='password'
                            style={{ color: 'red' }}
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel htmlFor='repeatPassword'>
                            Confirm Password
                          </FormLabel>
                          <InputGroup>
                            <Field
                              as={Input}
                              type={showRepeatPassword ? 'text' : 'password'}
                              name='repeatPassword'
                              variant='filled'
                            />
                            <InputRightElement h={'full'}>
                              <Button
                                variant={'ghost'}
                                onClick={() =>
                                  setShowRepeatPassword(
                                    (showRepeatPassword) => !showRepeatPassword
                                  )
                                }
                              >
                                {showRepeatPassword ? (
                                  <ViewIcon />
                                ) : (
                                  <ViewOffIcon />
                                )}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                          <ErrorMessage
                            component='div'
                            name='repeatPassword'
                            style={{ color: 'red' }}
                          />
                        </FormControl>
                        <Button type='submit' width='100%' colorScheme={'teal'}>
                          Register
                        </Button>
                        <Divider />
                        <HStack>
                          <Button colorScheme='red' leftIcon={<FaGoogle />}>
                            Google
                          </Button>
                          <Button
                            colorScheme='facebook'
                            leftIcon={<FaFacebook />}
                          >
                            Facebook
                          </Button>
                          <Button
                            colorScheme='twitter'
                            leftIcon={<FaTwitter />}
                          >
                            Twitter
                          </Button>
                        </HStack>
                        <Divider />
                        <Stack direction={'horizontal'}>
                          <Text align={'center'} marginRight={2}>
                            Already a user?
                          </Text>
                          <Text color={'blue.400'} fontWeight={'bold'}>
                            <RouterLink to={'/login'}>Login here</RouterLink>
                          </Text>
                        </Stack>
                      </VStack>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </Box>
        </Stack>
      </Flex>
    </section>
  );
}
