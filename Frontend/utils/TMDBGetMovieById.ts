import { TMDBMovie } from '@/types/TMDB';

export async function getMovieById(movieId: number): Promise<TMDBMovie> {
  if (!movieId) return {} as TMDBMovie;

  const APIKEY = process.env.TMDB_APIKEY;
  const RAT = process.env.TMDB_RAT;
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${APIKEY}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${RAT}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: Error Code: ${res.status}`);
  }

  return res.json();
}
