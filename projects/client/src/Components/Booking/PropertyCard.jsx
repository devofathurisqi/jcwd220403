import React from 'react';
import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  Skeleton,
  HStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useParams } from 'react-router-dom';

function PropertyCard({ day, setDay }) {
  const [data, setData] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const params = useParams();

  function priceInCurrency() {
    const price = data.rooms[params.index].price;

    let priceInRupiah = Intl.NumberFormat('id-ID', {
      currency: `IDR`,
      style: 'currency',
    });
    return priceInRupiah.format(price);
  }

  function totalPrice() {
    const totalPrice = data.rooms[params.index].price * day;

    let priceInRupiah = Intl.NumberFormat('id-ID', {
      currency: `IDR`,
      style: 'currency',
    });

    return priceInRupiah.format(totalPrice);
  }

  const getData = async () => {
    try {
      const res = await axios.get(`/property/detail/${params.propertyId}`);
      setData(res.data);
      setIsloading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isloading]);

  return isloading ? (
    <Skeleton isLoaded={true}> </Skeleton>
  ) : (
    <Skeleton isLoaded={!isloading}>
      <Card maxW='xl' boxShadow={'xl'}>
        <CardBody>
          <Image
            src={
              process.env.REACT_APP_URL_PUBLIC +
              'roomPicture/' +
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
                  {priceInCurrency()} x {day} nights
                </Text>
              ) : (
                <Text>
                  {priceInCurrency()} x {day} night
                </Text>
              )}
              <Text>{totalPrice()}</Text>
            </HStack>
            <Divider />
            <HStack justifyContent={'space-between'}>
              <Heading size='md'>Total</Heading>
              <Text>{totalPrice()}</Text>
            </HStack>
          </Stack>
        </CardBody>
      </Card>
    </Skeleton>
  );
}

export default PropertyCard;
