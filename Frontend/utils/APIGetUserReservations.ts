'use server';

import { Reservation } from '@/types/Reservation';
import { getMovieById } from './TMDBGetMovieById';

export async function getUserReservations(): Promise<Reservation[]> {
  const JWT = ``;
  const res = await fetch(`http://localhost:5118/User/profile/reservations`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${JWT}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: Error Code: ${res.status}`);
  }

  const reservations: Reservation[] = await res.json();

  return reservations.map(async reservation => ({
    ...reservation,
    movieName: (await getMovieById(reservations[0].movieId)).original_title,
  })) as unknown as Reservation[];
}
