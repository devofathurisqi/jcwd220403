import React from 'react';
import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  CardFooter,
  Button,
  ButtonGroup,
  Skeleton,
  HStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useParams } from 'react-router-dom';

function PropertyCard() {
  const [data, setData] = useState([]);
  const [day, setDay] = useState(1);
  const [isloading, setIsloading] = useState(true);
  const params = useParams();

  const getData = async () => {
    try {
      const res = await axios.get(`/detail/property/${params.propertyId}`);
      setData(res.data);
      //   console.log(data.rooms[params.index]);
      setIsloading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, [isloading]);

  return isloading ? (
    <Skeleton isLoaded={true}> </Skeleton>
  ) : (
    <Skeleton isLoaded={!isloading}>
      <Card maxW='sm'>
        <CardBody>
          <Image
            src={
              'http://localhost:2000/roomPicture/' +
              data.rooms[params.index].picture
            }
            alt='Room picture'
            borderRadius='lg'
          />
          <Stack mt='6' spacing='3'>
            <Heading size='xl'>{data.rooms[params.index].name}</Heading>
            <Divider />

            <Heading size='md'>Price Details</Heading>
            <HStack justifyContent={'space-between'}>
              {day > 1 ? (
                <Text>
                  Rp.{data.rooms[params.index].price} x {day} nights
                </Text>
              ) : (
                <Text>
                  Rp.{data.rooms[params.index].price} x {day} night
                </Text>
              )}
              <Text>Rp.{data.rooms[params.index].price * day}</Text>
            </HStack>
            <Divider />
            <HStack justifyContent={'space-between'}>
              <Heading size='md'>Total</Heading>
              <Text>Rp.{data.rooms[params.index].price * day}</Text>
            </HStack>
          </Stack>
        </CardBody>
      </Card>
    </Skeleton>
  );
}

export default PropertyCard;
