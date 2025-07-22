'use client';

import { useReservation } from '@/context/ReservationContext';

export default function ScreeningContent() {
  const { lastReservation, isConnected } = useReservation();

  return (
    <>
      {isConnected
        ? 'Connected: Booking States will be updated in realtime'
        : 'Connecting to Realtime Services...'}
      {lastReservation && <p>Latest reservation: {lastReservation.seatId}</p>}
    </>
  );
}
