'use server';

import { Reservation, UserDetails } from '@/types/UserDetails';
import { getMovieById } from './TMDBGetMovieById';

export async function getUserUserDetails(): Promise<UserDetails> {
  const JWT = ``;
  let URL = process.env.DEV_SERVER_ADDRESS;
  if (process.env.NODE_ENV === 'production')
    URL = process.env.DEPLOYED_SERVER_ADDRESS;
  const res = await fetch(`${URL}/User/profile/reservations`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${JWT}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: Error Code: ${res.status}`);
  }

  const userDetails: UserDetails = await res.json();

  const reservationsWithMovies: Reservation[] = await Promise.all(
    userDetails.reservations.map(async reservation => ({
      ...reservation,
      movieName: (
        await getMovieById(reservation.movieId.toString())
      ).original_title,
    }))
  );

  return {
    userId: userDetails.userId,
    balance: userDetails.balance,
    reservations: reservationsWithMovies,
  };
}
