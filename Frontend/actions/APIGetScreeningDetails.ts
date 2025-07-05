'use server';

import { type Screening } from '@/types/Screening';
import { type ScreeningDetails } from '@/types/ScreeningDetails';
import { type TMDBMovieDetails } from '@/types/TMDB';

export async function getScreeningDetails(
  screeningId: number
): Promise<ScreeningDetails> {
  if (!screeningId) return {} as ScreeningDetails;

  const JWT = ``;
  const res = await fetch(
    `http://localhost:5118/Screening/getScreeningSeatingDetails?screeningId=${screeningId}`,
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

  return res.json();
}

export async function getThisWeeksScreenings(
  movie: TMDBMovieDetails
): Promise<Screening[] | string> {
  const JWT = ``; // Authentication isn't implemented yet
  const url = `http://localhost:5118/Screening/getScreeningsByMovieId?movieId=${movie.id}`;
  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${JWT}`,
    },
  });

  if (res.status === 404) {
    return 'This movie has no screenings scheduled this week';
  }

  if (!res.ok) {
    throw new Error(
      `Failed to fetch screenings for the movie ${movie.title} with id: ${movie.id}`
    );
  }

  return res.json();
}
