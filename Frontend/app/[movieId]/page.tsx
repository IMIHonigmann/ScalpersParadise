import { Screening } from '@/types/Screening';
import { TMDBCredits, TMDBMovieDetails, TMDBVideos } from '@/types/TMDB';
import { Fragment } from 'react';
import { Bebas_Neue } from 'next/font/google';
import { Oswald } from 'next/font/google';
import { CiSearch } from 'react-icons/ci';
import { PiTextAlignLeft } from 'react-icons/pi';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { TfiPlus } from 'react-icons/tfi';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { getMovieById } from '@/actions/TMDBGetMovieById';
import { getCreditsByMovieId } from '@/actions/TMDBGetCreditsByMovieId';
import { HomeLogo } from '@/components/HomeLogo';
import Link from 'next/link';
import { getTrailerByMovieId } from '@/actions/TMDBGetTrailerByMovieId';
import Background from './Background';
import { getAgeRatingByMovieId } from '@/actions/TMDBGetAgeRatingByMovieId';
import MovieSearcher from './MovieSearcher';

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

const getMovie = await getMovieById;

async function getThisWeeksScreenings(
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

export default async function TestLayoutComponent({
  params,
}: {
  params: { movieId: string };
}) {
  const { movieId } = await params;
  const movie = await getMovie(parseInt(movieId, 10));
  const credits: TMDBCredits = await getCreditsByMovieId(parseInt(movieId, 10));
  const videos: TMDBVideos = await getTrailerByMovieId(parseInt(movieId, 10));
  const ageRating = await getAgeRatingByMovieId(parseInt(movieId, 10));
  const screenings = await getThisWeeksScreenings(movie);
  const navItems = [
    { label: 'Shop', path: '/shop' },
    { label: 'Unlimited', path: '/unlimited' },
    { label: 'Lucky', path: '/random' },
    { label: 'Rent', path: '/rent' },
  ];
  const ratingColors = {
    0: '#000000',
    6: '#FFE500',
    12: '#13A538',
    16: '#00A0DE',
    18: '#E20512',
  };
  const videoId = videos.results.find(video => video.type === 'Trailer')?.key;

  return (
    <>
      <div className={`${bebasNeue.className} tracking-widest`}>
        <div
          className={`flex justify-between text-right items-start w-full p-8`}
        >
          <HomeLogo />
          <nav className="w-[10%]">
            <ul className="flex flex-col space-y-0 text-xl uppercase">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className="hover:opacity-70 transition-opacity cursor-pointer"
                >
                  <Link href={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex-[2]" />
          <span
            className="w-3/4
            flex justify-between items-center relative
          after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-[98%] after:h-px after:bg-current"
          >
            <span className="flex items-center">
              <CiSearch className="text-3xl mr-[0.5em]" />
              <MovieSearcher />
            </span>
            <PiTextAlignLeft className="text-3xl" />
          </span>
        </div>
        <div className="absolute bottom-0 left-0 px-16 py-12 w-full md:w-1/2 xl:w-1/3">
          <div
            className="flex justify-between mb-2 text-yellow-400 font-bold text-9xl"
            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
          >
            {movie.title.split('').map((char: string, index: number) => (
              <span key={index} className="scale-x-[80%]">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
            <span
              className="text-6xl px-4"
              style={{
                color:
                  ratingColors[
                    ageRating.certification as keyof typeof ratingColors
                  ] || '#FFFFFF',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
              }}
            >
              FSK{ageRating.certification}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-8 mt-4">
            <div>
              <p className="uppercase tracking-widest">{movie.tagline}</p>
            </div>
            <div className="col-span-2">
              <p
                className={`text-sm text-gray-400 ${oswald.className} tracking-normal leading-relaxed`}
              >
                {movie.overview}
              </p>
            </div>
            <div
              className="col-span-2 col-start-2 row-start-2
            grid grid-cols-3 gap-8"
            >
              <button
                className="place-self-center bg-red-600 text-white px-12 py-4 text-sm rounded whitespace-nowrap
              col-span-2"
              >
                Take a Ticket
              </button>

              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <FaRegCirclePlay className="text-3xl" /> Trailer
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-1/3  w-1/5 flex justify-between items-center p-4 py-8 gap-16 uppercase">
          {credits.cast.slice(0, 3).map(actor => (
            <span key={actor.id}>
              <div className="text-lg opacity-60 mb-2">
                {actor.name.split(' ')[0]}
              </div>
              <div className="text-2xl whitespace-nowrap">
                {actor.name.includes(' ')
                  ? actor.name.substring(actor.name.indexOf(' ')).trim()
                  : ''}
              </div>
            </span>
          ))}
        </div>
        <div className="absolute bottom-1/2 right-8 transform translate-y-1/2 text-5xl text-gray-400">
          <TfiPlus />
        </div>
        <div className="absolute bottom-0 right-0 p-12 text-3xl">
          <MdNavigateBefore className="inline p-1 text-gray-400" />
          <MdNavigateNext className="inline ml-4 border border-gray-400 rounded-full p-1 cursor-pointer" />
        </div>
      </div>
      <div
        className="pointer-events-none absolute top-0 left-0 h-[98vh] w-screen opacity-75 border-0 z-[-20] overflow-hidden p-10 md:p-13 lg:p-16
      md:aspect-auto"
      >
        <Background videoId={videoId} movie={movie} />
      </div>
    </>
  );
}
