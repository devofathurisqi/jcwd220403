import { Grid } from '@chakra-ui/react';
import React from 'react';
import Trip from './TripTemplate';

function OngoingList({ trips }) {
  return (
    <Grid
      templateColumns={{
        base: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)',
      }}
      gap={{ base: '8', sm: '12', md: '16' }}
    >
      {trips.map((trip, index) => (
        <Trip
          key={index}
          image={trip.picture}
          heading={trip.property_name}
          tenant={trip.fullName}
          date={trip.checkIn + ' to ' + trip.CheckOut}
          status={trip.transactionStatus}
          transactionId={trip.id}
          paymentId={trip.payment_id}
          paymentmethodId={trip.paymentmethodId}
        />
      ))}
    </Grid>
  );
}

export default OngoingList;
