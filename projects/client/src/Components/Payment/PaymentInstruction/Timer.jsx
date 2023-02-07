import { Box, Heading, Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

function Timer({ payment }) {
  const trasactionCreated = new Date(payment.createdAt);

  const expiredTime = new Date(
    trasactionCreated.setHours(trasactionCreated.getHours() + 2)
  );

  const expiredTimeString = expiredTime.toLocaleTimeString();

  const calculateTimeLeft = () => {
    const difference = +expiredTime - +new Date();

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval, index) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={index}>
        {timeLeft[interval]} {interval}{' '}
      </span>
    );
  });
  return (
    <Box>
      <Heading size='md' mb='15px'>
        Make A Payment Before
      </Heading>
      <Box
        border='1px'
        borderRadius='5px'
        padding='10px'
        borderColor='lightgray'
      >
        <Box
          display='flex'
          justifyContent='center'
          marginBottom='10px'
          backgroundColor='gray.100'
          padding='10px 0'
          borderRadius='4px'
        >
          <Text fontWeight='semibold'>{expiredTimeString}</Text>
        </Box>
        <Box display='flex' gap='5px' justifyContent='center'>
          {timerComponents.length ? (
            timerComponents
          ) : (
            <span
              style={{
                color: 'red',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              Expired
            </span>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Timer;
