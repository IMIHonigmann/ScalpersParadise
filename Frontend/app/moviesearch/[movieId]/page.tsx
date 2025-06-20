import { Screening } from '@/types/Screening';
import { TMDBMovie } from '@/types/TMDB';
import { Fragment } from 'react';
import Image from 'next/image';
import { Bebas_Neue } from 'next/font/google';
import { Oswald } from 'next/font/google';
import { CiSearch } from 'react-icons/ci';
import { PiTextAlignLeft } from 'react-icons/pi';
import { FaRegCirclePlay } from 'react-icons/fa6';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const oswald = Oswald({
  weight: ['400', '500', '700'], // Add any weights you need
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald', // Creates a CSS variable
  adjustFontFallback: true, // Handles optical sizing
});

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

/*export default*/ async function MovieDetailsPage({
  params,
}: {
  params: { movieId: string };
}) {
  const { movieId } = await params;
  const movie = await getMovie(movieId);
  const screenings = await getThisWeeksScreenings(movie);

  return (
    <Fragment>
      <h1 className={`text-4xl tracking-wider ${bebasNeue.className}`}>
        COOLLOGO BRUH
      </h1>
      <h1
        className={`text-2xl font-bold uppercase font-serif tracking-[0.15em] ${oswald.className}`}
      >
        {movie.title}
      </h1>
      {/* <Image
        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
        alt="Logo"
        width={200}
        height={100}
      /> */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 opacity-50"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      />
      <p>{movie.tagline}</p>
      <br />
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

export default function TestLayoutComponent() {
  return (
    <>
      <div className="flex justify-between text-right items-start w-full p-5">
        <span className="font-bold text-5xl p-2 relative group cursor-pointer">
          <span className="transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 duration-300 absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-300" />
          <span className="transition-transform group-hover:-translate-x-2 group-hover:translate-y-2 duration-300 absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-300" />
          <span className="transition-all group-hover:opacity-100 group-hover:translate-x-2 group-hover:translate-y-2 delay-300 duration-150 absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-300" />
          CO0
          <br />
          0OL
        </span>
        <nav className="w-1/6">
          <ul className="flex flex-col space-y-1 text-xs uppercase tracking-wider">
            <li>
              <span className="hover:opacity-70 transition-opacity cursor-pointer">
                Home
              </span>
            </li>
            <li>
              <span className="hover:opacity-70 transition-opacity cursor-pointer">
                Movies
              </span>
            </li>
            <li>
              <span className="hover:opacity-70 transition-opacity cursor-pointer">
                Screenings
              </span>
            </li>
            <li>
              <span className="hover:opacity-70 transition-opacity cursor-pointer">
                About
              </span>
            </li>
            <li>
              <span className="hover:opacity-70 transition-opacity cursor-pointer">
                Contact
              </span>
            </li>
          </ul>
        </nav>
        <div className="flex-[2]" />
        <span
          className="w-3/5
          flex justify-between items-center relative
        after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-[98%] after:h-px after:bg-current"
        >
          <span>
            <CiSearch className="text-3xl inline mr-[0.5em]" />
            <span>
              {' '}
              <input
                type="text"
                placeholder="Search movies..."
                className="bg-transparent border-none outline-none text-inherit placeholder-gray-400"
              />
            </span>
          </span>
          <PiTextAlignLeft className="text-3xl" />
        </span>
      </div>

      <div className="absolute bottom-0 left-0 p-16 w-full md:w-1/2 xl:w-1/3">
        <div className="flex justify-between mb-2">
          <span className="text-6xl font-bold opacity-30">J</span>
          <span className="text-6xl font-bold opacity-30">O</span>
          <span className="text-6xl font-bold opacity-30">K</span>
          <span className="text-6xl font-bold opacity-30">E</span>
          <span className="text-6xl font-bold opacity-30">R</span>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-4">
          <div>
            <p className="text-xs uppercase tracking-widest">
              Origin Story of the Iconic Villain
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-400">
              Joker is a 2019 American psychological thriller film directed by
              Todd Phillips, who co-wrote the screenplay with Scott Silver. The
              film, based on DC Comics characters, stars Joaquin Phoenix as the
              Joker and provides an alternative origin story for the character.
            </p>
          </div>
          <div
            className="col-span-2 col-start-2 row-start-2
          grid grid-cols-3 gap-8"
          >
            <button
              className="place-self-center bg-red-600 text-white px-8 py-3 text-sm rounded whitespace-nowrap
            col-span-2"
            >
              Take a Ticket
            </button>
            <a
              href="#"
              className="place-self-center text-sm underline
              flex items-center gap-2"
            >
              <FaRegCirclePlay className="text-3xl" /> Trailer
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
