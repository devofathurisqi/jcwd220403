import { Box, Grid, chakra } from '@chakra-ui/react';
import React from 'react';
import Trip from './TripTemplate';

function Declined({ trips }) {
  return (
    <Box>
      <chakra.h3 fontSize='xl' fontWeight='600' mb={5}>
        Declined
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
            trip.transactionStatus === 'Dibatalkan' && (
              <Trip
                key={index}
                image={trip.picture}
                heading={trip.property_name}
                tenant={trip.fullName}
                date={trip.checkIn + ' to ' + trip.CheckOut}
                status={trip.transactionStatus}
              />
            )
        )}
      </Grid>
    </Box>
  );
}

export default Declined;
