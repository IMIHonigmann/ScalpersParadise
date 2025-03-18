'use client';

import { UserDetails } from '@/types/UserDetails';
import { getUserUserDetails } from '@/actions/APIGetUserDetails';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [userDetails, setUserDetails] = useState<UserDetails>();

  useEffect(() => {
    (async function fetchuserDetails() {
      const reservationPromises = await getUserUserDetails();
      setUserDetails(reservationPromises);
    })();
  }, []);

  return (
    <div>
      <h1>My Profile</h1>
      <br />
      <h2>My Current Balance: {userDetails?.balance}$</h2>
      <br />

      {userDetails?.reservations.map(reservation => (
        <div key={reservation.reservationId}>
          <p>Movie: {reservation.movieName}</p>
          <p>Screening Date: {}</p>
          <p>Bought at: {reservation.boughtAt.toString()}</p>
          <p>Auditorium {reservation.auditoriumId}</p>
          <p>
            Row {reservation.rowNumber} Seat {reservation.seatNumber}
          </p>
          <p>Ticket Value: {reservation.ticketValue.toFixed(2)}$</p>
          <p>Price Paid: {reservation.pricePaid.toFixed(2)}$</p>
          <p>
            Return On Sale:{' '}
            <span
              style={{
                color:
                  reservation.ticketValue - reservation.pricePaid > 0
                    ? 'green'
                    : reservation.ticketValue - reservation.pricePaid < 0
                    ? 'red'
                    : 'inherit',
              }}
            >
              {reservation.ticketValue - reservation.pricePaid > 0 ? '+' : ''}
              {(reservation.ticketValue - reservation.pricePaid).toFixed(2)}$
            </span>
          </p>
          <br />
        </div>
      ))}

      {userDetails?.reservations.length === 0 && <p>No reservations found.</p>}
    </div>
  );
}
