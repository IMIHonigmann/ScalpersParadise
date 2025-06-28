'use server';

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

  return res.json();
}
