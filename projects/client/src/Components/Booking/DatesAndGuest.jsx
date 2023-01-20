import { Heading, HStack, Input, Link, Stack, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

function DatesAndGuest() {
  const [date, setDate] = useState([]);
  const [guest, setGuest] = useState(1);

  return (
    <Stack spacing={6}>
      <Heading size={'lg'}>Your Trip</Heading>

      <Heading size={'md'}>Dates</Heading>
      <Input type={'date'}></Input>
      <HStack justifyContent={'space-between'}>
        <Heading size={'md'}>Guests</Heading>
        <Link fontWeight={'bold'} textDecoration={'underline'}>
          Edit
        </Link>
      </HStack>
      {guest > 1 ? <Text>{guest} guests</Text> : <Text>{guest} guest</Text>}
    </Stack>
  );
}

export default DatesAndGuest;
