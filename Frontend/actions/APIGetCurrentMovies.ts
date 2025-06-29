'use server';

import { type TMDBMovieDetails } from '@/types/TMDB';
import { getMovieById } from './TMDBGetMovieById';

export async function getCurrentMovies() {
  const JWT = ``;
  const res = await fetch(
    `http://localhost:5118/CurrentMovies/GetCurrentMovieIds`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${JWT}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch: Error Code: ${res.status}`);
  }

  const currentMovieIds: number[] = await res.json();

  const movieDetailsResults = await Promise.allSettled(
    currentMovieIds.map(async id => await getMovieById(id))
  );
  const TMDBMovieDetails: TMDBMovieDetails[] = movieDetailsResults
    .filter(result => result.status === 'fulfilled')
    .map(result => (result as PromiseFulfilledResult<TMDBMovieDetails>).value);

  return TMDBMovieDetails;
}
