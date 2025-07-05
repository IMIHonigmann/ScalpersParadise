'use server';

import { TMDBMovieDetails } from '@/types/TMDB';

export async function getSearchURLResponse(
  query: string
): Promise<{ results: TMDBMovieDetails[] }> {
  if (!query) return { results: [] };

  const APIKEY = process.env.TMDB_APIKEY;
  const RAT = process.env.TMDB_RAT;

  const params = {
    query,
    include_adult: 'false',
    language: 'en-US',
    page: '1',
    api_key: APIKEY,
  };

  const queryString = Object.entries(params)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
    .join('&');

  const url = `https://api.themoviedb.org/3/search/movie?${queryString}`;

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

  const data = res.json();

  return data;
}
