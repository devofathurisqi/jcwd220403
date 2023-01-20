import { Stack, Heading, Text, Link, Divider } from '@chakra-ui/react';
import React from 'react';

function BookingPolicy() {
  return (
    <Stack fontSize={11}>
      <Heading size={'md'}>Cancellation policy</Heading>
      <Text>
        This reservation is non-refundable.{' '}
        <Link textDecoration={'underline'}>Learn more</Link>
      </Text>
      <Divider />
      <Text>
        By selecting the button below, I agree to the
        <Link textDecoration={'underline'}> Host's House Rules</Link>,{' '}
        <Link textDecoration={'underline'}>Ground rules for guests </Link>,{' '}
        <Link textDecoration={'underline'}>
          Holistay's Rebooking and Refund Policy
        </Link>
        , and that Holistay can{' '}
        <Link textDecoration={'underline'}>charge my payment method</Link> if
        I'm responsible for damage.
      </Text>
    </Stack>
  );
}

export default BookingPolicy;
