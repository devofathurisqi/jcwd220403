import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Divider,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  IconButton,
  Button,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import BookingPolicy from '../../Components/Booking/BookingPolicy';
import BookingDate from '../../Components/Booking/BookingDate';
import GuestList from '../../Components/Booking/GuestList';
import PropertyCard from '../../Components/Booking/PropertyCard';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import toISOLocal from '../../hooks/useLocalISOString';

export default function BookingDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [adultGuest, setAdultGuest] = useState(1);
  const [childrenGuest, setChildrenGuest] = useState(0);
  const [infantGuest, setInfantGuest] = useState(0);
  const [date, setDate] = useState();
  const [day, setDay] = useState(0);
  const [submittedData, setSubmittedData] = useState();
  const userId = auth.userId;

  const numberOfDays = () => {
    date !== undefined && date[1]
      ? setDay(
          Math.floor(
            (date[1].getTime() - date[0].getTime()) / (1000 * 3600 * 24)
          )
        )
      : setDay(0);
  };

  const totalGuest = () => {
    const totalGuestList = adultGuest + childrenGuest + infantGuest;
    return totalGuestList;
  };

  function handleRedirect() {
    setInterval(() => {
      setSubmitSuccess(true);
    }, 3000);
  }

  const submitBookingForm = async (e) => {
    e.preventDefault();
    setDisableSubmitBtn(true);
    try {
      const data = new FormData();
      data.append('userId', userId);
      data.append('roomId', params.roomId);
      data.append('checkIn', toISOLocal(date[0]).slice(0, 10));
      data.append('checkOut', toISOLocal(date[1]).slice(0, 10));
      data.append('adultGuest', adultGuest);
      data.append('childrenGuest', childrenGuest);
      data.append('infantGuest', infantGuest);
      const res = axiosPrivate.post('/transaction', data);
      const toastify = await toast.promise(
        res,
        {
          pending: 'Booking on progress...',
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
      setSubmittedData(toastify.data.roomDetail.id);
      setDisableSubmitBtn(false);
      handleRedirect();
    } catch (error) {
      console.log(error);
      toast.error('error: please check your data', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  useEffect(() => {
    numberOfDays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // console.log(date[0]);
  // console.log(toISOLocal(date[0]).slice(0, 10));
  // console.log(toISOLocal(date[1]).slice(0, 10));

  return submitSuccess ? (
    <Navigate to={`/payment/${submittedData}`} />
  ) : (
    <Stack
      minH={'100vh'}
      direction={{ base: 'column', md: 'row' }}
      justifyContent={'space-between'}
    >
      <ToastContainer />
      <Flex p={8} flex={1} justify={'center'}>
        <Stack spacing={6} maxW={'xl'}>
          <HStack>
            <IconButton
              colorScheme='teal'
              aria-label='Back to Property'
              icon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            />
            <Heading fontSize={'3xl'}>
              <Text color={'teal.400'} as={'span'}>
                Booking{' '}
              </Text>
              <Text color={'orange.400'} as={'span'}>
                Detail
              </Text>
            </Heading>
          </HStack>
          <Divider />
          <BookingDate inputDate={date} setInputDate={setDate} />
          <GuestList
            adultGuest={adultGuest}
            setAdultGuest={setAdultGuest}
            childrenGuest={childrenGuest}
            setChildrenGuest={setChildrenGuest}
            infantGuest={infantGuest}
            setInfantGuest={setInfantGuest}
            totalGuest={totalGuest}
          />
          <Divider />
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            {auth?.accessToken ? (
              <Stack spacing={6}>
                <BookingPolicy />
                <Button
                  colorScheme={'orange'}
                  w={'full'}
                  onClick={submitBookingForm}
                  disabled={disableSubmitBtn}
                >
                  Choose Payment Method
                </Button>
              </Stack>
            ) : (
              <Stack w={'full'} spacing={5}>
                <Button color={'teal.400'} onClick={() => navigate('/login')}>
                  Log in or sign up to book
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1} p={8}>
        <PropertyCard day={day} setDay={setDay} />
      </Flex>
    </Stack>
  );
}
