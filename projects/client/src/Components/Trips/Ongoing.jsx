import { Box, chakra } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import NoOngoingTrip from './NoOngoingTrip';
import OngoingList from './OngoingList';

function Ongoing({ data }) {
  const [ongoingtransaction, setOngoingTransaction] = useState([]);

  const checkData = useCallback(() => {
    data.map((trip) => {
      if (
        trip.transactionStatus === 'Menunggu Konfirmasi Pembayaran' ||
        trip.transactionStatus === 'Menunggu Pembayaran'
      ) {
        setOngoingTransaction((ongoingtransaction) => [
          ...ongoingtransaction,
          trip,
        ]);
      }

      return null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    checkData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box mb={12}>
      <chakra.h3 fontSize='xl' fontWeight='600' mb={5}>
        Ongoing
      </chakra.h3>
      {ongoingtransaction.length === 0 ? (
        <NoOngoingTrip />
      ) : (
        <OngoingList trips={ongoingtransaction} />
      )}
    </Box>
  );
}

export default Ongoing;
