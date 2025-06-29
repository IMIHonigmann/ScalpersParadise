'use server';

import { type TMDBMovieDetails } from '@/types/TMDB';
import { getMovieById } from './TMDBGetMovieById';

export async function getCurrentMoviesByName(movieName?: string) {
  const JWT = ``;
  const res = await fetch(
    `http://localhost:5118/CurrentMovies/getCurrentMoviesByName${
      movieName ? `?movieName=${movieName}` : ''
    }`,
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

  const currentMovies = await res.json();

  const movieDetailsResults = await Promise.allSettled(
    currentMovies.map(async movie => await getMovieById(movie.movieId))
  );
  const TMDBMovieDetails: TMDBMovieDetails[] = movieDetailsResults
    .filter(result => result.status === 'fulfilled')
    .map(result => (result as PromiseFulfilledResult<TMDBMovieDetails>).value);

  return TMDBMovieDetails;
}
