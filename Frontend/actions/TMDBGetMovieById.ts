'use server';

import { TMDBMovieDetails } from '@/types/TMDB';

export async function getMovieById(movieId: number): Promise<TMDBMovieDetails> {
  if (!movieId) return {} as TMDBMovieDetails;

  const APIKEY = process.env.TMDB_APIKEY;
  const RAT = process.env.TMDB_RAT;
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${APIKEY}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${RAT}`,
    },
    next: { revalidate: 10 * 86400 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: Error Code: ${res.status}`);
  }

  const data = await res.json();
  console.log(data);

  return data;
}
