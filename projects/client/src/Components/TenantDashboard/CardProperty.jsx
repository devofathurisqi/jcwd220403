import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Tooltip,
  ModalFooter,
  Spinner,
  Text,
  useToast,
  Input,
  Image,
  Flex,
  Icon,
  FormControl,
  FormLabel,
  FormHelperText,
  Divider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Textarea,
  Card,
  CardBody,
  Center,
  Skeleton,
  SkeletonCircle,
  useBreakpointValue,
  Alert,
  AlertTitle,
  AlertIcon,
  AlertDescription,
  Select,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import InputMorePictureProperty from '../ComponentBeTenant/InputMorePictureProperty';
import { openDrawerForMorePicture } from '../../Redux/MorePictureProperty';
import { openModal } from '../../Redux/DeleteProperty';
import DeleteProperty from '../ComponentBeTenant/DeleteProperty';
import { FiEdit3 } from 'react-icons/fi';
import { RxDividerVertical } from 'react-icons/rx';
import { DataFasility } from '../../Data/DataFasility';
import { AiOutlineFileImage } from 'react-icons/ai';
import Slider from 'react-slick';
import { FaArrowLeft, FaArrowRight, FaHotel } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import Axios from 'axios';

const CardProperty = () => {
  //for everything
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  console.log(data);
  const [load, setLoad] = useState(false);
  const [descProperty, setDescProperty] = useState();
  const [loadDesc, setLoadDesc] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { auth } = useAuth();
  const [editId, setEditId] = useState(null);
  const toast = useToast();

  //editname
  const [isopenModalName, setIsOpenModalName] = useState(false);
  const [nameProperty, setNameProperty] = useState('');
  const [msgName, setMsgName] = useState('');
  const isErrorNameProperty = nameProperty === '';

  //editpicture
  const [picture, setPicture] = useState(null);
  const [msgPicture, setMsgPicture] = useState('');
  const [indexHover, setIndexHover] = useState(-1);
  const [openModalPicture, setOpanModelPicture] = useState(false);

  //descripsi
  const [alertDialogDesc, setAlertDialogDesc] = useState(false);
  const [editDesc, setEditDesc] = useState(false);
  const [msgNameDesc, setMsgNameDesc] = useState('');
  const [desc, setDesc] = useState('');
  const isErrorDescProperty = desc === '';

  //edit location detail
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('Indonesia');
  const [city, setCity] = useState('');
  const [msgErrorLocation, setMsgErrorLocation] = useState('');
  const [modalOpenLocation, setModalOpenLocation] = useState(false);
  const [dataProvince, setDataProvince] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);

  const isErrorCountry = country === '';
  const isErrorProvince = province === '';
  const isErrorCity = city === '';

  //facility
  const [alertDialogFacility, setAlertDialogFacility] = useState(false);
  const [editFacility, setEditFacility] = useState(false);
  const [clickedItem, setClickedItem] = useState([]);
  const [dataFacility, setDataFacility] = useState();
  const [loadFacility, setLoadFacility] = useState(false);
  const [msgNameFacility, setMsgNameFacility] = useState('');

  //caraousel
  const [caraouselIndexHover, setCaraouselIndexHover] = useState(-1);

  //filteringData
  const activeStatusAll = useSelector(
    (state) => state.FilterProperty.value.statusAll
  );
  const activeBestSeller = useSelector(
    (state) => state.FilterProperty.value.bestSeller
  );
  const activeNotSold = useSelector(
    (state) => state.FilterProperty.value.notSold
  );
  const sorting = useSelector((state) => state.FilterProperty.value.Sort);

  const getData = async () => {
    try {
      const response = await axios.get(`property/${auth.tenantId}`, {
        params: {
          orderByUser: sorting,
        },
      });
      const properties = response.data;
      if (activeStatusAll === true) {
        setData(properties);
      } else if (activeBestSeller === true) {
        properties.sort((a, b) => {
          let aTotal = 0;
          let bTotal = 0;
          a.rooms.forEach((room) => {
            aTotal += room.transactions.length;
          });
          b.rooms.forEach((room) => {
            bTotal += room.transactions.length;
          });
          return bTotal - aTotal;
        });
        setData([properties[0]]);
      } else if (activeNotSold === true) {
        setData(
          properties.filter(
            (property) =>
              property.rooms.length > 0 &&
              property.rooms.every((room) => room.transactions.length === 0)
          )
        );
      }
      setTimeout(() => {
        setLoadingData(false);
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  const getDataDesc = async () => {
    try {
      setLoadDesc(true);
      const response = await axios.get(`/descProperty/${editId}`);
      setDescProperty(response.data);
      setTimeout(() => {
        setLoadDesc(false);
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  const getDataFacility = async () => {
    try {
      setLoadFacility(true);
      const response = await axios.get(`/getFacilityById/${editId}`);
      setDataFacility(response.data);
      setTimeout(() => {
        setLoadFacility(false);
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDataFacility();
  }, [editId]);

  useEffect(() => {
    getDataDesc();
  }, [editId]);

  useEffect(() => {
    getData();
  }, []);

  // editpicture ............................................................................................
  const isOpenModalPicture = (item) => {
    setOpanModelPicture(true);
    setEditId(item.id);
  };
  const isCloseModalPicture = () => {
    setOpanModelPicture(false);
    setEditId(null);
  };

  const editPicture = async () => {
    try {
      if (!picture) {
        setMsgPicture('Picture is Required');
      }
      const formData = new FormData();
      formData.append('file', picture);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      await axios.patch(`/editpicture/${editId}`, formData, config);
      setLoad(true);
      setTimeout(() => {
        setLoad(false);
        isCloseModalPicture();
        setPicture(null);
        getData();
        toast({
          title: 'Success',
          description: 'Picture has been updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }, 3000);
    } catch (err) {
      console.log(err);
      if (err.response) {
        setMsgPicture(err.response.data);
      }
    }
  };
  // edit picture ..................................................................
  const openPopoverName = (item) => {
    setIsOpenModalName(true);
    setEditId(item.id);
  };
  const closePopoverName = () => {
    setIsOpenModalName(false);
    setEditId(null);
  };
  const editName = async () => {
    try {
      await axios.patch(`/editname/${editId}`, {
        name: nameProperty,
      });
      setLoad(true);
      setTimeout(() => {
        setLoad(false);
        getData();
        setNameProperty('');
        toast({
          title: 'Success',
          description: 'Edit name has been updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        closePopoverName();
      }, 3000);
    } catch (err) {
      console.log(err);
      if (err.response) {
        setMsgName(err.response.data);
      }
    }
  };
  // edit desc......................................................................
  const openAlertDialogDesc = (item) => {
    setAlertDialogDesc(true);
    setEditId(item.id);
    setEditDesc(false);
  };
  const closeAlertDialogDesc = async () => {
    setAlertDialogDesc(false);
    setEditId(null);
    setEditDesc(false);
  };
  const openEditDesc = () => {
    setEditDesc(true);
  };

  const editDescription = async () => {
    try {
      await axios.patch(
        `/editdescription/${editId}`,
        {
          description: desc,
        },
        {
          withCredentials: true,
        }
      );
      setLoad(true);
      setTimeout(() => {
        setLoad(false);
        getData();
        getDataDesc();
        closeAlertDialogDesc();
        setDesc('');
        toast({
          title: 'Success',
          description: 'Description has been updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }, 3000);
    } catch (err) {
      if (err.response) {
        setMsgNameDesc(err.response.data);
      }
    }
  };

  //edit location detail
  const editLocationDetail = async () => {
    try {
      await axios.patch(
        `/editlocation/${editId}`,
        {
          country,
          province,
          city,
        },
        {
          withCredentials: true,
        }
      );
      setLoad(true);
      setTimeout(() => {
        setLoad(false);
        getData();
        handleModalCloseLocation();
        setCountry('');
        setProvince('');
        setCity('');
        toast({
          title: 'Success',
          description: 'Location Detail has been updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }, 3000);
    } catch (err) {
      console.log(err);
      if (err.response) {
        setMsgErrorLocation(err.response.data);
      }
    }
  };

  const getDataProvince = async () => {
    try {
      const response = await Axios.get(
        'https://dev.farizdotid.com/api/daerahindonesia/provinsi'
      );
      setDataProvince(response.data.provinsi);
    } catch (err) {
      console.log(err);
    }
  };

  const getDataCity = async () => {
    try {
      const response = await Axios.get(
        `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${selectedProvince}`
      );
      setDataCity(response.data.kota_kabupaten);
    } catch (err) {
      console.log(err);
    }
  };

  const convertNameProvince = () => {
    const result = dataProvince.find((item) => item.nama === province);
    setSelectedProvince(result ? result.id : null);
  };

  useEffect(() => {
    getDataCity();
  }, [selectedProvince]);

  useEffect(() => {
    convertNameProvince();
  }, [province]);

  useEffect(() => {
    getDataProvince();
  }, []);

  const handleModalOpenLocation = (item) => {
    setModalOpenLocation(true);
    setEditId(item.id);
  };

  const handleModalCloseLocation = () => {
    setModalOpenLocation(false);
    setEditId(null);
  };

  //facility
  const openAlertDialogFacility = (item) => {
    setAlertDialogFacility(true);
    setEditId(item.id);
    getDataFacility();
  };
  const closeAlertDialogFacility = () => {
    setAlertDialogFacility(false);
    setEditId(null);
    setEditFacility(false);
    setMsgNameFacility('');
  };
  const openEditFacility = () => {
    setEditFacility(true);
  };
  const editFacilities = async (e) => {
    e.preventDefault();
    try {
      const nameFacility = clickedItem
        .map((facility) => facility.title)
        .join(', ');
      await axios.patch(
        `/editfacility/${editId}`,
        {
          name: nameFacility,
        },
        {
          withCredentials: true,
        }
      );
      setLoad(true);
      setTimeout(() => {
        setLoad(false);
        closeAlertDialogFacility();
        getDataFacility();
        setClickedItem([]);
        toast({
          title: 'Success',
          description: 'Facility has been updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }, 3000);
    } catch (err) {
      console.log(err);
      if (err.response) {
        setMsgNameFacility(err.response.data);
      }
    }
  };
  const handleItemClick = (item) => {
    if (clickedItem.includes(item)) {
      setClickedItem(clickedItem.filter((i) => i !== item));
    } else {
      setClickedItem([...clickedItem, item]);
    }
  };
  function countFacilities(facilities) {
    let count = 0;
    facilities.forEach((facility) => {
      count += facility.name.split(', ').length;
    });
    return count;
  }

  //responsive
  const widthFontSize = useBreakpointValue({
    base: '8px',
    md: '10px',
    lg: '12px',
  });
  const widthResponsive = useBreakpointValue({
    base: '100%',
    md: '100%',
    lg: '50%',
  });

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <Button
        onMouseEnter={() => setCaraouselIndexHover(caraouselIndexHover)}
        onMouseOut={() => setCaraouselIndexHover(-1)}
        bg='white'
        onClick={onClick}
        style={{
          position: 'absolute',
          right: '5px',
          top: 'calc(50% - 20px)',
          color: 'black',
          borderRadius: '100%',
          width: '20px',
          display: caraouselIndexHover >= 0 ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
          opacity: 1,
        }}
      >
        <FaArrowRight />
      </Button>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <Button
        bg='white'
        onClick={onClick}
        onMouseEnter={() => setCaraouselIndexHover(caraouselIndexHover)}
        onMouseOut={() => setCaraouselIndexHover(-1)}
        style={{
          position: 'absolute',
          left: '5px',
          top: 'calc(50% - 20px)',
          color: 'black',
          borderRadius: '100%',
          width: '20px',
          display: caraouselIndexHover >= 0 ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
          opacity: 1,
        }}
      >
        <FaArrowLeft />
      </Button>
    );
  };

  const BestSeller = () => {
    if (activeBestSeller === true) {
      return (
        <Box width={widthResponsive} p={4} boxShadow='md'>
          {data &&
            data.map((item, index) => (
              <Box>
                <Box>
                  <Center>
                    <Icon as={FaHotel} boxSize='40px' mr={0} />
                  </Center>
                  <Text textAlign='center' fontWeight='bold'>
                    Congratulations!
                  </Text>
                  <Text
                    borderBottom='1px solid black'
                    paddingBottom='5px'
                    textAlign='center'
                  >
                    Selamat atas pencapaian property anda yang bernama{' '}
                    {item.name}
                  </Text>
                  <Text marginTop='5px'>
                    Berikut adalah detail transaksi property {item.name} :
                  </Text>
                  <UnorderedList>
                    {item.rooms.map((Roomtransactions, i) => (
                      <ListItem>
                        Room {Roomtransactions.name} memiliki{' '}
                        {Roomtransactions.transactions.length} Transaksi
                      </ListItem>
                    ))}
                  </UnorderedList>
                </Box>
              </Box>
            ))}
        </Box>
      );
    }
  };
  const NotSold = () => {
    if (activeNotSold === true) {
      return (
        <Center>
          <Box>
            {data.length === 0 ? (
              <Box width='100%' p={4} boxShadow='md'>
                <Center>
                  <Icon as={FaHotel} boxSize='40px' mr={0} />
                </Center>
                <Text textAlign='center' fontWeight='bold'>
                  Congratulations!
                </Text>
                <Text
                  borderBottom='1px solid black'
                  paddingBottom='5px'
                  textAlign='center'
                >
                  Tidak ada property yang tidak pernah ada transaksi
                </Text>
                <Text
                  marginTop='5px'
                  textAlign='center'
                  fontFamily='sans-serif'
                  fontWeight='bold'
                >
                  Terus sukses bersama holistay!
                </Text>
              </Box>
            ) : null}
          </Box>
        </Center>
      );
    }
  };

  return (
    <Box
      marginTop='10px'
      display={activeBestSeller ? 'flex' : 'block'}
      justifyContent='center'
      alignItems='center'
      gap='40px'
      flexWrap='wrap'
    >
      <BestSeller />
      <NotSold />
      <Flex
        gap='10px'
        justifyContent='center'
        alignItems='center'
        flexWrap='wrap'
      >
        {data &&
          data.map((item, index) => (
            <Box
              width='320px'
              height='450px'
              border='4px solid #f1f1f1'
              borderRadius='15px'
            >
              <Box position='relative' margin='0' p={1} height='70%'>
                <Skeleton isLoaded={!loadingData}>
                  <Box
                    onMouseEnter={() => setCaraouselIndexHover(index)}
                    onMouseLeave={() => setCaraouselIndexHover(-1)}
                  >
                    <Slider
                      dots={true}
                      infinite={true}
                      speed={500}
                      slidesToShow={1}
                      slidesToScroll={1}
                      nextArrow={
                        caraouselIndexHover === index ? <NextArrow /> : null
                      }
                      prevArrow={
                        caraouselIndexHover === index ? <PrevArrow /> : null
                      }
                    >
                      {item.propertypictures &&
                        item.propertypictures.map((image, i) => (
                          <Box key={i}>
                            <Image
                              cursor='pointer'
                              height='150px'
                              width='100%'
                              objectFit='cover'
                              borderRadius='5px'
                              style={{
                                filter:
                                  index === indexHover
                                    ? 'brightness(30%)'
                                    : 'none',
                              }}
                              src={
                                process.env.REACT_APP_URL_PUBLIC +
                                'propertyPicture/' +
                                image.picture
                              }
                            />
                          </Box>
                        ))}
                    </Slider>
                    <Tooltip
                      label='Change Picture?'
                      fontSize='md'
                      placement='top'
                      openDelay={300}
                      color='black'
                      bg='white'
                    >
                      <Button
                        onClick={() => isOpenModalPicture(item)}
                        style={{
                          position: 'absolute',
                          top: '0',
                          left: '20%',
                          right: '0',
                          bottom: '0',
                          width: '60%',
                          height: '50%',
                          opacity: '0',
                          cursor: 'pointer',
                          zIndex: 1,
                        }}
                        onMouseOver={() => setIndexHover(index)}
                        onMouseOut={() => setIndexHover(-1)}
                      >
                        Open Modal
                      </Button>
                    </Tooltip>
                    <Modal
                      closeOnOverlayClick={false}
                      isOpen={openModalPicture}
                      onClose={isCloseModalPicture}
                    >
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Change Picture</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                          <form onSubmit={editPicture}>
                            <Input
                              type='file'
                              onChange={(e) => setPicture(e.target.files[0])}
                              variant='flushed'
                              color='red.400'
                            />
                          </form>
                          <Text textAlign='center' color='red'>
                            {msgPicture}
                          </Text>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            colorScheme='blue'
                            mr={3}
                            type='submit'
                            onClick={editPicture}
                          >
                            {load ? <Spinner /> : 'Save'}
                          </Button>
                          <Button onClick={isCloseModalPicture}>Cancel</Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                    <InputMorePictureProperty />
                  </Box>
                </Skeleton>
                <Box marginLeft='4' marginTop='20px'>
                  <Flex gap='5px' alignItems='center'>
                    <Skeleton isLoaded={!loadingData}>
                      <Text fontWeight='bold' fontFamily='sans-serif'>
                        {item.name}
                      </Text>
                    </Skeleton>
                    <SkeletonCircle isLoaded={!loadingData}>
                      <Icon
                        as={FiEdit3}
                        cursor='pointer'
                        boxSize='22px'
                        color='#4e90d3'
                        onClick={() => openPopoverName(item)}
                      />
                    </SkeletonCircle>
                  </Flex>
                  <Modal
                    closeOnOverlayClick={false}
                    isOpen={isopenModalName}
                    onClose={closePopoverName}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Edit your name property</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody pb={6}>
                        <FormControl isInvalid={isErrorNameProperty}>
                          <FormLabel color='red' fontSize='12px'>
                            {msgName}
                          </FormLabel>
                          <Input
                            id='name'
                            type='text'
                            value={nameProperty}
                            variant='flushed'
                            placeholder='Your name property?'
                            onChange={(e) => setNameProperty(e.target.value)}
                          />
                          {isErrorNameProperty ? (
                            <FormHelperText color='red' textAlign='center'>
                              Name is required
                            </FormHelperText>
                          ) : (
                            <FormHelperText color='#478fd3' textAlign='center'>
                              Create name success
                            </FormHelperText>
                          )}
                        </FormControl>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          colorScheme='blue'
                          mr={3}
                          variant='outline'
                          onClick={editName}
                        >
                          {load ? <Spinner /> : 'Submit'}
                        </Button>
                        <Button onClick={closePopoverName}>Cancel</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                  <Flex gap='5px' alignItems='center' color='#9a9a9a'>
                    <Skeleton isLoaded={!loadingData}>
                      <Text fontSize='14px'>
                        {item.category.country}, {item.category.province},{' '}
                        {item.category.city}
                      </Text>
                    </Skeleton>
                    <SkeletonCircle isLoaded={!loadingData}>
                      <Icon
                        as={FiEdit3}
                        cursor='pointer'
                        boxSize='15px'
                        color='#4e90d3'
                        onClick={() => handleModalOpenLocation(item)}
                      />
                    </SkeletonCircle>
                  </Flex>
                  <Modal
                    closeOnOverlayClick={false}
                    isOpen={modalOpenLocation}
                    onClose={handleModalCloseLocation}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Edit location Detail</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody pb={6}>
                        <form onSubmit={editLocationDetail}>
                          <Text fontSize='14px' textAlign='center' color='red'>
                            {msgErrorLocation}
                          </Text>
                          <FormControl isInvalid={isErrorCountry} width='auto'>
                            <FormLabel>Country</FormLabel>
                            <Input
                              variant='flushed'
                              placeholder='Country?'
                              value='Indonesia'
                              onChange={(e) => setCountry(e.target.value)}
                            />
                            {isErrorCountry ? (
                              <FormHelperText color='red'>
                                Country is required
                              </FormHelperText>
                            ) : (
                              <FormHelperText color='#478fd3'>
                                Update country success
                              </FormHelperText>
                            )}
                          </FormControl>
                          <FormControl isInvalid={isErrorProvince} width='auto'>
                            <FormLabel>Province</FormLabel>
                            <Select
                              variant='flushed'
                              type='text'
                              placeholder='Province?'
                              value={province}
                              onChange={(e) => setProvince(e.target.value)}
                            >
                              {dataProvince.map((item, index) => (
                                <option key={index} value={item.nama}>
                                  {item.nama}
                                </option>
                              ))}
                            </Select>
                            {isErrorProvince ? (
                              <FormHelperText color='red'>
                                Province is required
                              </FormHelperText>
                            ) : (
                              <FormHelperText color='#478fd3'>
                                Create province success
                              </FormHelperText>
                            )}
                          </FormControl>
                          <FormControl isInvalid={isErrorCity} width='auto'>
                            <FormLabel>City</FormLabel>
                            <Select
                              placeholder='Pilih Opsi'
                              width='auto'
                              variant='flushed'
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                            >
                              {dataCity.map((item, index) => (
                                <option key={index}>{item.nama}</option>
                              ))}
                            </Select>
                            {isErrorCity ? (
                              <FormHelperText color='red'>
                                City is required
                              </FormHelperText>
                            ) : (
                              <FormHelperText color='#478fd3'>
                                Create city success
                              </FormHelperText>
                            )}
                          </FormControl>
                        </form>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          colorScheme='blue'
                          mr={3}
                          onClick={editLocationDetail}
                        >
                          {load ? <Spinner /> : 'Submit'}
                        </Button>
                        <Button onClick={handleModalCloseLocation}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                  <Flex alignItems='center' gap='5px' marginTop='5px'>
                    <Skeleton isLoaded={!loadingData}>
                      <Text fontSize='12px' fontFamily='sans-serif'>
                        Made on :{' '}
                      </Text>
                    </Skeleton>
                    <Skeleton isLoaded={!loadingData}>
                      <Text
                        fontSize='12px'
                        fontFamily='sans-serif'
                        color='#67a0d9'
                      >
                        {new Date(item.createdAt).toLocaleString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </Skeleton>
                  </Flex>
                  <Divider borderColor='#808080' width='90%' marginTop='10px' />
                  <Flex marginTop='10px' alignItems='center'>
                    <Box bg='#d9efe4' width='70px' borderRadius='5px'>
                      <Skeleton isLoaded={!loadingData}>
                        <Text
                          color='#539372'
                          textAlign='center'
                          fontWeight='bold'
                          fontFamily='sans-serif'
                        >
                          Active
                        </Text>
                      </Skeleton>
                    </Box>
                    <Skeleton isLoaded={!loadingData} marginLeft='5px'>
                      <Text
                        color='#a8a8a8'
                        marginLeft='5px'
                        fontSize={widthFontSize}
                      >
                        Updated Nov 29
                      </Text>
                    </Skeleton>
                    <Skeleton isLoaded={!loadingData} marginLeft='5px'>
                      <Text
                        cursor='pointer'
                        color='#5a93c9'
                        marginLeft='20px'
                        fontWeight='bold'
                        onClick={() => openAlertDialogDesc(item)}
                      >
                        View Desc
                      </Text>
                    </Skeleton>
                    <AlertDialog
                      motionPreset='slideInBottom'
                      onClose={closeAlertDialogDesc}
                      isOpen={alertDialogDesc}
                      isCentered
                    >
                      <AlertDialogOverlay />
                      <AlertDialogContent>
                        <AlertDialogHeader>Description</AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody>
                          {loadDesc ? (
                            <Center>
                              <Spinner />
                            </Center>
                          ) : editDesc ? (
                            <Box p={5} rounded='lg' shadow='md' width='100%'>
                              <FormControl isInvalid={isErrorNameProperty}>
                                <FormLabel
                                  color='red'
                                  fontSize='12px'
                                  textAlign='center'
                                >
                                  {msgNameDesc}
                                </FormLabel>
                                <Textarea
                                  id='name'
                                  type='text'
                                  variant='flushed'
                                  defaultValue={descProperty.description}
                                  placeholder='Edit your Description'
                                  onChange={(e) => setDesc(e.target.value)}
                                />
                                {isErrorDescProperty ? (
                                  <FormHelperText
                                    color='red'
                                    textAlign='center'
                                  >
                                    Desc is required
                                  </FormHelperText>
                                ) : (
                                  <FormHelperText
                                    color='#478fd3'
                                    textAlign='center'
                                  >
                                    Update desc success
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Box>
                          ) : (
                            <Box p={5} rounded='lg' shadow='md' width='100%'>
                              <Text textAlign='center'>
                                {descProperty.description}
                              </Text>
                            </Box>
                          )}
                        </AlertDialogBody>
                        <AlertDialogFooter>
                          <Button
                            onClick={closeAlertDialogDesc}
                            marginRight='10px'
                          >
                            Cancel
                          </Button>
                          {editDesc ? (
                            <Button
                              colorScheme='facebook'
                              variant='outline'
                              onClick={editDescription}
                            >
                              {load ? <Spinner /> : 'Save'}
                            </Button>
                          ) : (
                            <Button
                              colorScheme='facebook'
                              variant='outline'
                              onClick={openEditDesc}
                            >
                              Edit?
                            </Button>
                          )}
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </Flex>
                </Box>
              </Box>
              <Box
                bg='#f7f7f7'
                width='100%'
                marginTop='21.5px'
                height='25%'
                borderBottomRadius='10px'
              >
                <Box p={2}>
                  <Skeleton isLoaded={!loadingData}>
                    <Text
                      textAlign='center'
                      fontFamily='sans-serif'
                      color='#787878'
                      fontWeight='bold'
                    >
                      Settings
                    </Text>
                  </Skeleton>
                  <Flex
                    marginTop='10px'
                    alignItems='center'
                    justifyContent='center'
                  >
                    <Flex
                      flexDirection='column'
                      alignItems='center'
                      cursor='pointer'
                      onClick={() => dispatch(openModal(item))}
                    >
                      <DeleteProperty />
                      <Skeleton isLoaded={!loadingData}>
                        <Text color='#6a9dc7' fontWeight='bold'>
                          Delete
                        </Text>
                        <Center>
                          <Icon
                            as={MdDeleteForever}
                            boxSize='25px'
                            color='#3b3a3e'
                          />
                        </Center>
                      </Skeleton>
                    </Flex>
                    <Icon
                      as={RxDividerVertical}
                      boxSize='40px'
                      color='#eaeaea'
                    />
                    <Flex flexDirection='column' alignItems='center'>
                      <Skeleton isLoaded={!loadingData}>
                        <Text
                          color='#6a9dc7'
                          fontWeight='bold'
                          cursor='pointer'
                          onClick={() => openAlertDialogFacility(item)}
                        >
                          Facility
                        </Text>
                        <Text color='#3b3a3e' textAlign='center'>
                          {countFacilities(item.facilities)}
                        </Text>
                      </Skeleton>
                    </Flex>
                    <AlertDialog
                      motionPreset='slideInBottom'
                      onClose={closeAlertDialogFacility}
                      isOpen={alertDialogFacility}
                      isCentered
                    >
                      <AlertDialogOverlay />
                      <AlertDialogContent>
                        <AlertDialogHeader>Facility</AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody
                          style={{ overflowY: 'scroll', maxHeight: '70vh' }}
                        >
                          <Text textAlign='center' color='red.400'>
                            {msgNameFacility}
                          </Text>
                          {loadFacility ? (
                            <Center>
                              <Spinner />
                            </Center>
                          ) : editFacility ? (
                            <Box p={5} rounded='lg' shadow='md' width='100%'>
                              {DataFasility.map((item) => (
                                <Card
                                  width='100%'
                                  height='110px'
                                  p={2}
                                  onClick={() => handleItemClick(item)}
                                  style={
                                    clickedItem.includes(item)
                                      ? {
                                          border: '2px solid black',
                                          fontWeight: 'bold',
                                        }
                                      : null
                                  }
                                  _hover={{ border: '2px solid black' }}
                                >
                                  <CardBody>
                                    <Box>
                                      <Icon as={item.img} boxSize='25px' />
                                      <Text pt='2' fontSize='md'>
                                        {item.title}
                                      </Text>
                                    </Box>
                                  </CardBody>
                                </Card>
                              ))}
                            </Box>
                          ) : (
                            <Box p={5} rounded='lg' shadow='md' width='100%'>
                              <Text textAlign='center'>
                                {dataFacility &&
                                  dataFacility.facilities[0].name}
                              </Text>
                            </Box>
                          )}
                        </AlertDialogBody>
                        <AlertDialogFooter>
                          <Button
                            onClick={closeAlertDialogFacility}
                            marginRight='10px'
                          >
                            Cancel
                          </Button>
                          {editFacility ? (
                            <Button
                              colorScheme='facebook'
                              variant='outline'
                              onClick={editFacilities}
                            >
                              {load ? <Spinner /> : 'Save'}
                            </Button>
                          ) : (
                            <Button
                              colorScheme='facebook'
                              variant='outline'
                              onClick={openEditFacility}
                            >
                              Edit?
                            </Button>
                          )}
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Icon
                      as={RxDividerVertical}
                      boxSize='40px'
                      color='#eaeaea'
                    />
                    <Flex
                      flexDirection='column'
                      alignItems='center'
                      justifyContent='center'
                      cursor='pointer'
                      onClick={() =>
                        dispatch(openDrawerForMorePicture(item.id))
                      }
                    >
                      <Skeleton isLoaded={!loadingData}>
                        <Text color='#6a9dc7' fontWeight='bold'>
                          Picture
                        </Text>
                        <Center>
                          <Icon as={AiOutlineFileImage} boxSize='25px' />
                        </Center>
                      </Skeleton>
                    </Flex>
                  </Flex>
                </Box>
              </Box>
            </Box>
          ))}
      </Flex>
    </Box>
  );
};

export default CardProperty;
