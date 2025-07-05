'use server';

import { type TMDBVideos } from '@/types/TMDB';

export async function getTrailerByMovieId(
  movieId: number
): Promise<TMDBVideos> {
  if (!movieId) return {} as TMDBVideos;

  const APIKEY = process.env.TMDB_APIKEY;
  const RAT = process.env.TMDB_RAT;
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US&api_key=${APIKEY}`;

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
