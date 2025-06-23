export async function getAgeRatingByMovieId(movieId: number) {
  if (!movieId) return {};

  const APIKEY = process.env.TMDB_APIKEY;
  const RAT = process.env.TMDB_RAT;
  const url = `https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=${APIKEY}`;

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

  const countryRating = data.results?.find(
    country => country.iso_3166_1 === 'DE'
  );
  const certification =
    countryRating?.release_dates?.[0]?.certification || 'Not Rated';

  return { certification, fullData: data };
}
