import { Box, chakra, Grid } from '@chakra-ui/react';
import React from 'react';
import Trip from './TripTemplate';

export default function Finished({ trips }) {
  return (
    <Box>
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
    </Box>
  );
}
