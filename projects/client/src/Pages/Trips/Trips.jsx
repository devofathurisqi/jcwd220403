import {
  Box,
  Divider,
  Grid,
  GridItem,
  Container,
  Text,
  Heading,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Ongoing from '../../Components/Trips/Ongoing';
import useAuth from '../../hooks/useAuth';
import Declined from '../../Components/Trips/Declined';
import Finished from '../../Components/Trips/Finished';

export default function Trips() {
  const axiosPrivate = useAxiosPrivate();
  const [trips, setTrips] = useState();
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();

  const getTrips = async () => {
    try {
      const tripsData = await axiosPrivate.get(`/trips/${auth.userId}`);
      setTrips(tripsData.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
  // console.log(trips);
  return loading ? null : (
    <Box as={Container} maxW='7xl' mt={14} p={4}>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        gap={4}
      >
        <GridItem colSpan={1}>
          <Heading>Trips</Heading>
        </GridItem>
        <GridItem>
          <Text>
            Here is the list of places that you've been and going to visit.
          </Text>
          <Text>
            Manage your booking history through our filter and links that
            available on each booking card.
          </Text>
        </GridItem>
      </Grid>
      <Divider mt={12} mb={12} />
      <Ongoing data={trips} />
      <Divider mt={12} mb={12} />
      {/* <Box>
        <chakra.h3 fontSize='xl' fontWeight='600' mb={5}>
          Where you've been
        </chakra.h3>

        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          }}
          gap={{ base: '8', sm: '12', md: '16' }}
        >
          {trips.map(
            (trip, index) =>
              trip.transactionStatus === 'Diproses' && (
                <Trip
                  key={index}
                  image={trip.picture}
                  heading={trip.property_name}
                  tenant={trip.fullName}
                  date={trip.checkIn + ' to ' + trip.CheckOut}
                  review={trip.review}
                />
              )
          )}
        </Grid>
      </Box> */}
      <Finished trips={trips} />
      <Divider mt={12} mb={12} />
      <Declined trips={trips} />
    </Box>
  );
}
