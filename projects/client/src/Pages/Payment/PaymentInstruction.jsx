import {
  Flex,
  Heading,
  Stack,
  Text,
  Divider,
  Skeleton,
} from '@chakra-ui/react';
import TransactionCard from '../../Components/Payment/TransactionCard';
import axios from '../../api/axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BankTransfer from '../../Components/Payment/PaymentInstruction/BankTransfer';

export default function PaymentInstruction() {
  const [data, setData] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const params = useParams();

  const getData = async () => {
    try {
      const res = await axios.get(`transaction/${params.transactionId}`);
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
      <Stack
        minH={'100vh'}
        direction={{ base: 'column', md: 'row' }}
        justifyContent={'space-between'}
      >
        <Flex p={8} flex={1} justify={'flex-end'} marginLeft={{ md: '5%' }}>
          <Stack spacing={6} w={'full'} maxW={'xl'}>
            <Heading fontSize={'3xl'}>
              <Text color={'teal.400'} as={'span'}>
                Payment Instructions
              </Text>
            </Heading>
            <Divider />
            <BankTransfer data={data} />
          </Stack>
        </Flex>
        <Flex
          p={8}
          flex={1}
          justifyContent={{ base: 'center', md: 'flex-start' }}
        >
          <TransactionCard data={data} />
        </Flex>
      </Stack>
    </Skeleton>
  );
}
