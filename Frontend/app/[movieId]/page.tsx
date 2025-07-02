import { Screening } from '@/types/Screening';
import { TMDBMovieDetails } from '@/types/TMDB';
import { Bebas_Neue } from 'next/font/google';
import { Oswald } from 'next/font/google';
import { FaChevronDown, FaRegCirclePlay } from 'react-icons/fa6';
import { TfiPlus } from 'react-icons/tfi';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { getMovieById } from '@/actions/TMDBGetMovieById';
import { getCreditsByMovieId } from '@/actions/TMDBGetCreditsByMovieId';
import Link from 'next/link';
import Image from 'next/image';
import { getTrailerByMovieId } from '@/actions/TMDBGetTrailerByMovieId';
import Background from './Background';
import { getAgeRatingByMovieId } from '@/actions/TMDBGetAgeRatingByMovieId';
import PlayButton from './PlayButton';
import { getCurrentMovieIds } from '@/actions/APIGetCurrentMovies';
import Header from '@/components/Header';

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
    <>
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
    </>
  );
}

export async function MoviePreview({
  params,
  searchParams,
  movie,
}: {
  params: { movieId: string };
  searchParams: { playVideo?: string };
  movie: TMDBMovieDetails;
}) {
  const { movieId } = await params;
  const { playVideo = 'false' } = await searchParams;
  const shouldPlayVideo = playVideo === 'true';
  const [credits, videos, ageRating, currentMovieIds] = await Promise.all([
    await getCreditsByMovieId(parseInt(movieId, 10)),
    await getTrailerByMovieId(parseInt(movieId, 10)),
    await getAgeRatingByMovieId(parseInt(movieId, 10)),
    await getCurrentMovieIds(),
  ]);

  const ratingColors = {
    0: '#FFFFFF',
    6: '#FFE500',
    12: '#13A538',
    16: '#00A0DE',
    18: '#E20512',
  };
  const videoId = videos.results.find(video => video.type === 'Trailer')?.key;

  function keepFirstSentence(text: string) {
    const idx = text.indexOf('.');
    if (idx === -1) return text;

    const firstSentence = text.substring(0, idx + 1);
    return idx + 1 < text.length ? firstSentence + '..' : firstSentence;
  }

  return (
    <div
      className="relative top-0 left-0 h-[95vh] border-0 overflow-hidden
      md:aspect-auto object-cover"
    >
      {shouldPlayVideo ? (
        <Background videoId={videoId} movie={movie} />
      ) : (
        <>
          <PlayButton />
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={`${movie.title} backdrop`}
            fill
            className="object-cover"
            quality={80}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </>
      )}
      <div className={`${bebasNeue.className} tracking-widest`}>
        <Header />
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
              className="text-6xl px-4 whitespace-nowrap"
              style={{
                color:
                  ratingColors[
                    ageRating.certification as keyof typeof ratingColors
                  ] || '#FFFFFF',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
              }}
            >
              FSK{' '}
              {ageRating.certification !== 'Not Rated'
                ? ageRating.certification
                : 'NR'}
              {console.log(
                ageRating.certification,
                typeof ageRating.certification
              )}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-8 mt-4">
            <div>
              <p className="tracking-widest">
                {keepFirstSentence(movie.tagline)}
              </p>
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
        <div className="absolute bottom-0 right-1/3  w-1/5 flex justify-between items-center p-4 py-8 gap-16">
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
        <div className="flex justify-center absolute bottom-0 right-0 p-12 text-3xl">
          <Link
            href={{
              pathname: `/${
                currentMovieIds[
                  Math.max(
                    0,
                    currentMovieIds.indexOf(parseInt(movieId, 10)) - 1
                  )
                ]
              }`,
              query: { playVideo: 'false' },
            }}
            className={`${
              parseInt(movieId, 10) === currentMovieIds.at(0)
                ? 'inline p-1 text-gray-400 cursor-default'
                : 'inline ml-4 border border-gray-400 rounded-full p-1 cursor-pointer grow-on-hold'
            }`}
          >
            <MdNavigateBefore />
          </Link>
          <Link
            href={{
              pathname: `/${
                currentMovieIds[
                  Math.min(
                    currentMovieIds.indexOf(parseInt(movieId, 10)) + 1,
                    currentMovieIds.length - 1
                  )
                ]
              }`,
              query: { playVideo: 'false' },
            }}
            className={`${
              parseInt(movieId, 10) === currentMovieIds.at(-1)
                ? 'inline p-1 text-gray-400 ml-4 cursor-default'
                : 'inline ml-4 border border-gray-400 rounded-full p-1 cursor-pointer grow-on-hold'
            }`}
          >
            <MdNavigateNext />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { movieId: string };
  searchParams: { playVideo?: string };
}) {
  const { movieId } = await params;
  const movie = await getMovie(parseInt(movieId, 10));
  const screenings = await getThisWeeksScreenings(movie);

  return (
    <>
      <MoviePreview params={params} searchParams={searchParams} movie={movie} />
      <div className="bg-zinc-900">
        <div className="flex justify-center items-center w-full">
          <FaChevronDown className="text-5xl flex-grow-1" />
        </div>
        {typeof screenings === 'string' ? (
          <p>No screenings for this week</p>
        ) : (
          <div className="min-h-screen">
            <CurrentScreeningsComponent screenings={screenings} />
          </div>
        )}
      </div>
    </>
  );
}
