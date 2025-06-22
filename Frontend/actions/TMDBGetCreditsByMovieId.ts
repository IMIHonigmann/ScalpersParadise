export async function getCreditsByMovieId(movieId: number) {
  if (!movieId) return {};

  const APIKEY = process.env.TMDB_APIKEY;
  const RAT = process.env.TMDB_RAT;
  const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US&api_key=${APIKEY}`;

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

  const data = await res.json();
  console.log(data);

  return data;
}
