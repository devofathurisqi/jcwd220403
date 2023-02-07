import React from 'react';
import {
  Heading,
  HStack,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  FormControl,
  FormLabel,
  Stack,
} from '@chakra-ui/react';

function GuestList({
  adultGuest,
  setAdultGuest,
  childrenGuest,
  setChildrenGuest,
  infantGuest,
  setInfantGuest,
  totalGuest,
}) {
  const setAdult = (value) => {
    value === 'decrement'
      ? setAdultGuest(adultGuest - 1)
      : setAdultGuest(adultGuest + 1);
  };
  const setChildren = (value) => {
    value === 'decrement'
      ? setChildrenGuest(childrenGuest - 1)
      : setChildrenGuest(childrenGuest + 1);
  };
  const setInfant = (value) => {
    value === 'decrement'
      ? setInfantGuest(infantGuest - 1)
      : setInfantGuest(infantGuest + 1);
  };
  return (
    <div>
      <HStack justifyContent={'space-between'}>
        <Heading size={'md'}>Guests</Heading>
        <Popover>
          <PopoverTrigger>
            <Button colorScheme={'teal'}>Edit</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader bg={'teal.50'} paddingLeft='42%' fontWeight={'bold'}>
              Guests
            </PopoverHeader>
            <PopoverBody>
              <FormControl>
                <Stack spacing={9} mb={5} mt={5}>
                  <HStack className='adults' justifyContent={'space-between'}>
                    <FormLabel>Adults</FormLabel>
                    <HStack>
                      <Button
                        onClick={() => setAdult('decrement')}
                        isDisabled={adultGuest <= 1}
                      >
                        -
                      </Button>
                      <Text>{adultGuest}</Text>
                      <Button onClick={() => setAdult('increment')}>+</Button>
                    </HStack>
                  </HStack>
                  <HStack className='children' justifyContent={'space-between'}>
                    <Stack spacing={0}>
                      <FormLabel>Children</FormLabel>
                      <Text fontSize={9}>Age 2-12</Text>
                    </Stack>
                    <HStack>
                      <Button
                        onClick={() => setChildren('decrement')}
                        isDisabled={childrenGuest < 1}
                      >
                        -
                      </Button>
                      <Text>{childrenGuest}</Text>
                      <Button onClick={() => setChildren('increment')}>
                        +
                      </Button>
                    </HStack>
                  </HStack>
                  <HStack className='infant' justifyContent={'space-between'}>
                    <Stack spacing={0}>
                      <FormLabel>Infant</FormLabel>
                      <Text fontSize={9}>Under 2</Text>
                    </Stack>
                    <HStack>
                      <Button
                        onClick={() => setInfant('decrement')}
                        isDisabled={infantGuest < 1}
                      >
                        -
                      </Button>
                      <Text>{infantGuest}</Text>
                      <Button onClick={() => setInfant('increment')}>+</Button>
                    </HStack>
                  </HStack>
                </Stack>
              </FormControl>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </HStack>
      {totalGuest() > 1 ? (
        <Text>{totalGuest()} guests</Text>
      ) : (
        <Text>{totalGuest()} guest</Text>
      )}
    </div>
  );
}

export default GuestList;
