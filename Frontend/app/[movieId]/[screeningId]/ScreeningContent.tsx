'use client';

import { useReservation } from '@/context/ReservationContext';
import { useEffect } from 'react';

export default function ScreeningContent() {
  const { lastReservation, isConnected } = useReservation();

  useEffect(() => {
    if (isConnected)
      setTimeout(() => alert('Hold down the seat you want to purchase'), 1000);
  }, [isConnected]);

  return (
    <>
      {isConnected
        ? 'Connected: Booking States will be updated in realtime'
        : 'Connecting to Realtime Services...'}
      {lastReservation && <p>Latest reservation: {lastReservation.seatId}</p>}
    </>
  );
}
