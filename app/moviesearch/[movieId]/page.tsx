async function getMovie(id: string) {
  const APIKEY = process.env.TMDB_APIKEY;
  const RAT = process.env.TMDB_RAT;

  const url = `https://api.themoviedb.org/3/movie/${id}`;
  const searchParams = new URLSearchParams({
    api_key: APIKEY as string,
  });

  const res = await fetch(`${url}?${searchParams}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${RAT}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch movie ${id}`);
  }

  return res.json();
}

export default async function MovieDetailsPage({
  params,
}: {
  params: { movieId: string };
}) {
  const { movieId } = await params;
  const movie = await getMovie(movieId);

  return (
    <div>
      <h1 className="text-2xl font-bold">{movie.title}</h1>
      <p>{movie.overview}</p>
    </div>
  );
}
