import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Divider,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  IconButton,
} from '@chakra-ui/react';
import DatesAndGuest from '../../Components/Booking/DatesAndGuest';
import LoginToBook from '../../Components/Booking/LoginToBook';
import PropertyCard from '../../Components/Booking/PropertyCard';

export default function BookingDetail() {
  return (
    <Stack
      minH={'100vh'}
      direction={{ base: 'column', md: 'row' }}
      justifyContent={'space-between'}
    >
      <Flex p={6} flex={1} justify={'center'}>
        <Stack spacing={6} w={'full'} maxW={'lg'}>
          <HStack>
            <IconButton
              colorScheme='teal'
              aria-label='Back to Property'
              icon={<ArrowBackIcon />}
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
          <DatesAndGuest />
          <Divider />
          <LoginToBook />
        </Stack>
      </Flex>
      <Flex flex={1}>
        <PropertyCard />
      </Flex>
    </Stack>
  );
}
