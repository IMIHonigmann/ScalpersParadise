import { Screening } from '@/types/Screening';
import { TMDBMovie } from '@/types/TMDB';
import { Fragment } from 'react';

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

async function getThisWeeksScreenings(
  movie: TMDBMovie
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

export default async function MovieDetailsPage({
  params,
}: {
  params: { movieId: string };
}) {
  const { movieId } = await params;
  const movie = await getMovie(movieId);
  const screenings = await getThisWeeksScreenings(movie);

  return (
    <Fragment>
      <h1 className="text-2xl font-bold">{movie.title}</h1>
      <p>{movie.overview}</p>
      <br />
      {typeof screenings === 'string' ? (
        <p>{screenings}</p>
      ) : (
        <CurrentScreeningsComponent screenings={screenings} />
      )}
    </Fragment>
  );
}

function CurrentScreeningsComponent({
  screenings,
}: {
  screenings: Screening[];
}) {
  return (
    <Fragment>
      <p>Screenings this week:</p>
      <br />
      <br />
      {screenings.map(s => {
        return (
          <span key={s.screeningId}>
            Auditorium {s.auditoriumId} ({s.auditoriumType}) <br />
            {new Date(s.screeningTime).toLocaleString([], {
              minute: '2-digit',
              hour: '2-digit',
              day: 'numeric',
              weekday: 'long',
              month: 'long',
              year: 'numeric',
            })}
            <br />
            <br />
          </span>
        );
      })}
    </Fragment>
  );
}
