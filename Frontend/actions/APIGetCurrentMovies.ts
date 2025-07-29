'use server';

import { type TMDBMovieDetails } from '@/types/TMDB';
import { getMovieById } from './TMDBGetMovieById';

export async function getCurrentMovies() {
  const JWT = ``;
  let URL = process.env.DEV_SERVER_ADDRESS;
  if (process.env.NODE_ENV === 'production')
    URL = process.env.DEPLOYED_SERVER_ADDRESS;
  const res = await fetch(`${URL}/CurrentMovies/GetCurrentMovieIds`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${JWT}`,
    },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: Error Code: ${res.status}`);
  }

  const currentMovieIds: number[] = await res.json();

  const movieDetailsResults = await Promise.allSettled(
    currentMovieIds.map(async id => await getMovieById(id.toString()))
  );
  const TMDBMovieDetails: TMDBMovieDetails[] = movieDetailsResults
    .filter(result => result.status === 'fulfilled')
    .map(result => (result as PromiseFulfilledResult<TMDBMovieDetails>).value);

  return TMDBMovieDetails;
}

export async function getCurrentMovieIds() {
  const JWT = ``;
  let URL = process.env.DEV_SERVER_ADDRESS;
  if (process.env.NODE_ENV === 'production')
    URL = process.env.DEPLOYED_SERVER_ADDRESS;
  const res = await fetch(`${URL}/CurrentMovies/GetCurrentMovieIds`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${JWT}`,
    },
    next: { revalidate: 86400 }, // 24h
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: Error Code: ${res.status}`);
  }

  const currentMovieIds: number[] = await res.json();

  return currentMovieIds;
}
