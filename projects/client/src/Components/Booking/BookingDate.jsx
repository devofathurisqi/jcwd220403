import {
  Heading,
  HStack,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import Calendar from 'react-calendar';
import axios from '../../api/axios';
import '../../Styles/Booking/calendar.css';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';

function BookingDate({ inputDate, setInputDate }) {
  const params = useParams();
  const [dateRange, setDateRange] = useState([]);
  const [checkInDates, setCheckInDates] = useState([]);
  const [checkOutDates, setCheckOutDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seed, setSeed] = useState(1);

  const reset = () => {
    setSeed(Math.random());
    setInputDate(undefined);
  };

  const getPastTrasactionDates = async () => {
    try {
      const res = await axios.get(`/transaction/room/${params.roomId}`);
      const data = res.data;
      setDateRange(data);
      setCheckInDates(data.map((d) => d.checkIn));
      setCheckOutDates(data.map((d) => d.checkOut));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  function dateComparisonCheckIn(a, b) {
    const date1 = new Date(a);
    const date2 = new Date(b);

    return date1 - date2;
  }
  function dateComparisonCheckOut(a, b) {
    const date1 = new Date(a);
    const date2 = new Date(b);

    return date1 - date2;
  }

  const disableDates = ({ date }) => {
    if (inputDate) {
      const after = checkInDates.filter((d) => new Date(d) > inputDate[0]);
      const before = checkOutDates.filter((d) => new Date(d) < inputDate[0]);
      const afterSort = after.sort(dateComparisonCheckIn);
      const beforeSort = before.sort(dateComparisonCheckOut);
      return (
        date < new Date(beforeSort.pop()) ||
        date > new Date(afterSort.shift()) ||
        date <= inputDate[0]
      );
    }
    return dateRange
      .map((d) => date >= new Date(d.checkIn) && date <= new Date(d.checkOut))
      .includes(true);
  };

  useEffect(() => {
    getPastTrasactionDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <Stack spacing={6} key={seed}>
      <Heading size={'lg'}>Your Trip</Heading>
      <HStack justifyContent={'space-between'}>
        <Heading size={'md'}>Dates</Heading>
        <Popover>
          <PopoverTrigger>
            <Button colorScheme={'teal'}>Edit</Button>
          </PopoverTrigger>
          <PopoverContent minW='400px'>
            <PopoverArrow />
            <PopoverCloseButton color={'white'} />
            <PopoverHeader
              bg={'teal.400'}
              paddingLeft='47%'
              fontWeight={'bold'}
              borderRadius='4px'
              color='white'
            >
              Date
            </PopoverHeader>
            <PopoverBody>
              <Calendar
                selectRange={true}
                allowPartialRange={true}
                tileDisabled={disableDates}
                onChange={setInputDate}
                minDate={new Date()}
                nextLabel='>'
                nextAriaLabel='Go to next month'
                next2Label={null}
                prevLabel='<'
                prevAriaLabel='Go to prev month'
                prev2Label={null}
              />
            </PopoverBody>
            <PopoverFooter
              border='0'
              display='flex'
              justifyContent={'flex-end'}
              pb={4}
              gap={5}
            >
              <Button colorScheme='teal' onClick={reset}>
                Clear date
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </HStack>
      {inputDate === undefined && <Text>Add your trip dates</Text>}
      {inputDate?.length === 1 && (
        <Text>
          <b>Check in: </b> {inputDate[0].toDateString()}
        </Text>
      )}
      {inputDate?.length > 1 && (
        <Text>
          <b>Check in: </b>
          {inputDate[0].toDateString()} | <b>Check out: </b>
          {inputDate[1].toDateString()}
        </Text>
      )}
    </Stack>
  );
}

export default BookingDate;
