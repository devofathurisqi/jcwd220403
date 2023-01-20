import {
  Flex,
  Center,
  useMediaQuery,
  Box,
  Heading,
  Text,
  Image,
  Grid,
  GridItem,
  Button,
  HStack,
  VStack,
  Avatar,
  Divider,
  SkeletonText,
  Skeleton,
  SkeletonCircle,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function DetailPage() {
  const [isMobile] = useMediaQuery('(max-width: 481px)');
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const params = useParams();
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const getData = async () => {
    try {
      const res = await axios.get(`/detail/property/${params.id}`);
      setData(res.data);
      setTimeout(() => {
        setIsloading(false);
      }, 1000);
      // console.log(res.data)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {isMobile ? (
        <Center>
          <Box w='80vw' pb='10'>
            <Skeleton isLoaded={!isloading}>
              <Heading fontSize='2xl'>{data?.name}</Heading>
              <Text fontWeight='bold' fontSize='small'>
                {data?.category?.city}, {data?.category?.country}
              </Text>
            </Skeleton>
            <Skeleton isLoaded={!isloading}>
              <Image
                src={'http://localhost:2000/propertyPicture/' + data?.picture}
              />
            </Skeleton>
            <HStack mt='8' mb='4' w='80vw'>
              <SkeletonCircle mr='4' size='10' isLoaded={!isloading}>
                <Avatar
                  size='md'
                  src={
                    'http://localhost:2000/profilePicture/' +
                    data?.tenant?.user.photo
                  }
                />
              </SkeletonCircle>
              <Skeleton isLoaded={!isloading}>
                <Box>
                  <Heading mt='2' fontSize='xl'>
                    Tuan Rumah : {data?.tenant?.user.fullName}
                  </Heading>
                  <Text fontSize='sm' color='gray.600'>
                    {data?.rooms?.length} Room
                  </Text>
                </Box>
              </Skeleton>
            </HStack>
            <Divider />
            <Skeleton isLoaded={!isloading}>
              <Text mt='4' fontWeight='bold'>
                Description
              </Text>
            </Skeleton>
            <SkeletonText isLoaded={!isloading}>
              <Text mb='4' textAlign='justify' color='gray.600'>
                {data?.description}
              </Text>
            </SkeletonText>
            <Divider />
            <Skeleton isLoaded={!isloading}>
              <Text mt='4' fontWeight='bold'>
                Tipe Kamar yang Tersedia di {data?.name}
              </Text>
            </Skeleton>
            <Box w='80w'>
              {data?.rooms?.map((item, i) => {
                return (
                  <Skeleton isLoaded={!isloading}>
                    <Flex
                      key={i}
                      mt='4'
                      borderRadius='md'
                      overflow='hidden'
                      boxShadow='md'
                    >
                      <Box m='2' p='2' w='80vw' borderRadius='2xl'>
                        <Image
                          src={
                            'http://localhost:2000/roomPicture/' + item.picture
                          }
                          objectFit='cover'
                        />
                        <Text mb='2' mt='2' fontWeight='bold'>
                          {item.name}
                        </Text>
                        <Divider />
                        <Text
                          mb='2'
                          h='15vh'
                          textAlign='justify'
                          overflow='scroll'
                        >
                          {item.description}
                        </Text>
                        <Divider />
                        <Text
                          mt='2'
                          fontWeight='bold'
                          fontSize='sm'
                          color='orange'
                        >
                          Rp {new Intl.NumberFormat('en-DE').format(item.price)}{' '}
                          / malam
                        </Text>
                        <Button mt='2' colorScheme='orange'>
                          <Link to={`/book/${data.id}/${i}/${item.id}`}>
                            Pesan sekarang
                          </Link>
                        </Button>
                      </Box>
                    </Flex>
                  </Skeleton>
                );
              })}
            </Box>
          </Box>
        </Center>
      ) : (
        <Center>
          <Box w='80vw' pb='10'>
            <Skeleton isLoaded={!isloading}>
              <Heading fontSize='3xl'>{data?.name}</Heading>
              <Text fontWeight='bold' fontSize='sm'>
                {data?.category?.city}, {data?.category?.country}
              </Text>
            </Skeleton>

            <Grid
              mt='4'
              overflow='hidden'
              borderRadius='2xl'
              templateRows='repeat(2, 1fr)'
              templateColumns='repeat(4, 1fr)'
              gap={2}
            >
              <GridItem rowSpan={2} colSpan={2}>
                <Skeleton isLoaded={!isloading}>
                  <Image
                    src={
                      'http://localhost:2000/propertyPicture/' + data?.picture
                    }
                  />
                </Skeleton>
              </GridItem>
              <GridItem colSpan={1}>
                <Skeleton isLoaded={!isloading}>
                  {' '}
                  <Image
                    src={
                      'http://localhost:2000/propertyPicture/' + data?.picture
                    }
                  />
                </Skeleton>
              </GridItem>
              <GridItem colSpan={1}>
                <Skeleton isLoaded={!isloading}>
                  {' '}
                  <Image
                    src={
                      'http://localhost:2000/propertyPicture/' + data?.picture
                    }
                  />
                </Skeleton>
              </GridItem>
              <GridItem colSpan={1}>
                <Skeleton isLoaded={!isloading}>
                  {' '}
                  <Image
                    src={
                      'http://localhost:2000/propertyPicture/' + data?.picture
                    }
                  />
                </Skeleton>
              </GridItem>
              <GridItem colSpan={1}>
                <Skeleton isLoaded={!isloading}>
                  {' '}
                  <Image
                    src={
                      'http://localhost:2000/propertyPicture/' + data?.picture
                    }
                  />
                </Skeleton>
              </GridItem>
              {isloading ? null : (
                <Button
                  border='1px'
                  borderColor='black'
                  position='absolute'
                  mt='2'
                  ml='2'
                  size='sm'
                >
                  Tampilkan Semua Foto
                </Button>
              )}
            </Grid>

            <HStack mt='8' mb='4' w='40vw'>
              <SkeletonCircle mr='4' size='10' isLoaded={!isloading}>
                <Avatar
                  size='md'
                  src={
                    'http://localhost:2000/profilePicture/' +
                    data?.tenant?.user.photo
                  }
                />
              </SkeletonCircle>
              <Skeleton isLoaded={!isloading}>
                <Box>
                  <Heading mt='2' fontSize='xl'>
                    Tuan Rumah : {data?.tenant?.user.fullName}
                  </Heading>
                  <Text fontSize='sm' color='gray.600'>
                    {data?.rooms?.length} Room
                  </Text>
                </Box>
              </Skeleton>
            </HStack>
            <Divider />
            <Skeleton isLoaded={!isloading}>
              <Text mt='4' fontWeight='bold'>
                Description
              </Text>
            </Skeleton>
            <SkeletonText isLoaded={!isloading}>
              <Text mb='4' textAlign='justify' color='gray.600'>
                {data?.description}
              </Text>
            </SkeletonText>
            <Divider />
            <Skeleton isLoaded={!isloading}>
              <Text mt='4' fontWeight='bold'>
                Tipe Kamar yang Tersedia di {data?.name}
              </Text>
            </Skeleton>
            <Flex w='80w' justify='space-between'>
              <Box w='50w'>
                {data?.rooms?.map((item, i) => {
                  return (
                    <Skeleton isLoaded={!isloading}>
                      <Flex
                        key={i}
                        mt='4'
                        borderRadius='md'
                        overflow='hidden'
                        boxShadow='md'
                      >
                        <Flex w='15vw'>
                          <Image
                            src={
                              'http://localhost:2000/roomPicture/' +
                              item.picture
                            }
                            boxSize='full'
                            objectFit='cover'
                          />
                        </Flex>
                        <Box m='2' p='2' w='35vw' borderRadius='2xl'>
                          <Flex
                            justify='space-between'
                            overflowWrap='break-word'
                          >
                            <Text mb='2' fontWeight='bold'>
                              {item.name}
                            </Text>
                            <Text mb='2' fontWeight='bold' color='orange'>
                              Rp{' '}
                              {new Intl.NumberFormat('en-DE').format(
                                item.price
                              )}{' '}
                              / malam
                            </Text>
                          </Flex>
                          <Divider />
                          <Text h='15vh' textAlign='justify' overflow='scroll'>
                            {item.description}
                          </Text>
                          <Divider />
                          <Button mt='2' colorScheme='orange'>
                            <Link to={`/book/${data.id}/${i}/${item.id}`}>
                              Pesan sekarang
                            </Link>
                          </Button>
                        </Box>
                      </Flex>
                    </Skeleton>
                  );
                })}
              </Box>
              <Box w='30w'>{/* iklan apa ajah nanti */}</Box>
            </Flex>
          </Box>
        </Center>
      )}
    </>
  );
}

export default DetailPage;
