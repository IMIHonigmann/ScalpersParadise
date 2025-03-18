'use client';

import { useReservation } from '@/context/ReservationContext';
import BoxGrid from './BoxGrid';

export default function ScreeningPage() {
  const { lastReservation, isConnected } = useReservation();

  return (
    <>
      <BoxGrid />
      <div>
        {isConnected
          ? 'Connected: Booking States will be updated in realtime'
          : 'Connecting to Realtime Services...'}
        {lastReservation && <p>Latest reservation: {lastReservation.seatId}</p>}
      </div>
    </>
  );
}
