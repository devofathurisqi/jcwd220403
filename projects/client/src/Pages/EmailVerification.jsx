import {
  Button,
  FormControl,
  Flex,
  Input,
  Stack,
  Center,
  Heading,
  Spacer,
} from '@chakra-ui/react';
import axios from '../api/axios';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, Navigate } from 'react-router-dom';

export default function VerifyEmailForm() {
  const [verified, setVerified] = useState(false);
  const [OTP, setOTP] = useState('');
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const getTokenFromParams = useParams();

  function handleRedirect() {
    setInterval(() => {
      setVerified(true);
    }, 3000);
  }

  const handleOTP = (e) => {
    setOTP(e.target.value);
    // console.log(OTP);
  };

  const resendOTP = async () => {
    setMinutes(1);
    setSeconds(0);
    try {
      const cookie = document.cookie;
      const emailFromCookie = cookie.split('=')[1];
      const decodeEmailFromCookie = decodeURIComponent(emailFromCookie);
      const res = axios.post(`/resendOTP`, { email: decodeEmailFromCookie });
      await toast.promise(
        res,
        {
          pending: 'Resending OTP...',
          success: 'Resend OTP Success! Please check your email',
          error: 'Resend OTP Fail fail 😢',
        },
        { position: toast.POSITION.TOP_CENTER }
      );
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = axios.post(
        `/verification?token=${getTokenFromParams.token}`,
        { otp: OTP }
      );

      await toast.promise(
        res,
        {
          pending: 'verification on progress...',
          success: 'Verification Success!',
          error: 'Verification fail 😢',
        },
        { position: toast.POSITION.TOP_CENTER }
      );
      handleRedirect();
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  return verified ? (
    <Navigate to='/login' />
  ) : (
    <section>
      <ToastContainer theme='colored' />
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={
          'url(https://source.unsplash.com/random/1920x1080/?house) center/cover no-repeat'
        }
      >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'sm'}
          bg={'white'}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={10}
        >
          <Center>
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
              Verify your Email
            </Heading>
          </Center>
          <Center fontSize={{ base: 'sm', sm: 'md' }} color={'black'}>
            Enter your OTP code here
          </Center>
          <FormControl>
            <Center>
              <Input
                type='number'
                name='otp'
                textAlign={'center'}
                onChange={handleOTP}
              />
            </Center>
          </FormControl>
          <Stack spacing={6}>
            <Button
              onClick={handleSubmit}
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
            >
              Verify
            </Button>
          </Stack>
          <Flex align={'center'}>
            {seconds > 0 || minutes > 0 ? (
              <p>
                Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
                {seconds < 10 ? `0${seconds}` : seconds}
              </p>
            ) : (
              <p>Didn't recieve code?</p>
            )}
            <Spacer />
            <button
              disabled={seconds > 0 || minutes > 0}
              style={
                seconds > 0 || minutes > 0
                  ? {
                      border: '1px solid grey',
                      background: 'grey',
                      padding: '4px',
                      borderRadius: '5px',
                      color: 'darkgrey',
                    }
                  : {
                      border: '1px solid orange',
                      background: 'orange',
                      padding: '4px',
                      borderRadius: '5px',
                      color: 'white',
                    }
              }
              onClick={resendOTP}
            >
              Resend OTP
            </button>
          </Flex>
        </Stack>
      </Flex>
    </section>
  );
}
