import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Oswald } from 'next/font/google';
import { FaChevronDown, FaRegCirclePlay } from 'react-icons/fa6';
import { TfiPlus } from 'react-icons/tfi';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { getMovieById } from '@/actions/TMDBGetMovieById';
import { getCreditsByMovieId } from '@/actions/TMDBGetCreditsByMovieId';
import { getTrailerByMovieId } from '@/actions/TMDBGetTrailerByMovieId';
import { getAgeRatingByMovieId } from '@/actions/TMDBGetAgeRatingByMovieId';
import { getCurrentMovieIds } from '@/actions/APIGetCurrentMovies';
import { Suspense } from 'react';
import { getThisWeeksScreenings } from '@/actions/APIGetScreeningDetails';
import Header from '@/components/Header';
import { SingleMovieCanvas } from './MiniPreview';
import DetailList from './DetailList';
import { MovieDetailsProps } from '@/types/TMDB';

const Background = dynamic(() => import('./Background'));
const PlayButton = dynamic(() => import('./PlayButton'));
const CurrentScreeningsComponent = dynamic(() => import('./CurrentScreenings'));

const oswald = Oswald({
  weight: ['400', '500', '700'], // Add any weights you need
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald', // Creates a CSS variable
  adjustFontFallback: true, // Handles optical sizing
});

const getMovie = await getMovieById;

export async function MovieDetails({
  movieId,
  children,
}: {
  movieId: string;
  children: (data: MovieDetailsProps) => React.ReactNode;
}) {
  const [movie, credits, videos, ageRating, currentMovieIds] =
    await Promise.all([
      await getMovie(movieId),
      getCreditsByMovieId(movieId),
      getTrailerByMovieId(movieId),
      getAgeRatingByMovieId(movieId),
      getCurrentMovieIds(),
    ]);

  const videoId = videos.results.find(video => video.type === 'Trailer')?.key;
  return (
    <>
      {children({
        movie,
        credits,
        videos,
        videoId,
        ageRating,
        currentMovieIds,
      })}
    </>
  );
}

export async function MoviePreview({
  params,
  searchParams,
}: {
  params: { movieId: string };
  searchParams: { playVideo?: string };
}) {
  const { movieId } = await params;
  const { playVideo = 'false' } = await searchParams;
  const shouldPlayVideo = playVideo === 'true';

  const ratingColors = {
    0: '#FFFFFF',
    6: '#FFE500',
    12: '#13A538',
    16: '#00A0DE',
    18: '#E20512',
  };

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
      <Suspense fallback={<h2> Loading... </h2>}>
        <MovieDetails movieId={movieId}>
          {({
            movie,
            credits,
            videoId,
            ageRating,
            currentMovieIds,
          }: MovieDetailsProps) => (
            <>
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
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black via-black/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </>
              )}
              <>
                <Header />
                <div className="absolute bottom-0 left-0 p-12 w-full">
                  <div
                    className="flex flex-col xl:flex-row mb-2 text-yellow-400 font-bold text-9xl text-center md:text-left"
                    style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                  >
                    <h1 className="text-yellow-400 font-bold text-7xl md:text-8xl lg:text-9xl pr-4">
                      {movie.title}
                    </h1>
                    <span
                      className="text-6xl whitespace-nowrap"
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
                    </span>
                  </div>
                  <div className="grid grid-cols-12 grid-rows-[1fr_50px_auto] w-full gap-8 mt-4">
                    <p className="tracking-widest hidden md:inline-block">
                      {keepFirstSentence(movie.tagline)}
                    </p>
                    <p
                      className={`text-sm text-gray-400 ${oswald.className} tracking-normal leading-relaxed col-span-3 md:col-span-2`}
                    >
                      {movie.overview}
                    </p>

                    <div className="grid grid-cols-3 gap-8 col-span-3 md:col-span-2 col-start-1 md:col-start-2 row-start-2">
                      <button className="place-self-center bg-red-600 text-white px-12 py-4 text-sm rounded whitespace-nowrap col-span-2">
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
                    <div className="row-start-2 col-start-6 col-span-2 flex justify-between place-items-center gap-x-5">
                      {credits.cast.slice(0, 3).map(actor => (
                        <span key={actor.id}>
                          <div className="text-lg opacity-60 mb-2" style={{}}>
                            {actor.name.split(' ')[0]}
                          </div>
                          <div className="text-2xl whitespace-nowrap">
                            {actor.name.includes(' ')
                              ? actor.name
                                  .substring(actor.name.indexOf(' '))
                                  .trim()
                              : ''}
                          </div>
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-center p-12 text-3xl row-start-2 col-start-11 col-span-2 place-items-center">
                      <Link
                        href={{
                          pathname: `/${
                            currentMovieIds[
                              Math.max(
                                0,
                                currentMovieIds.indexOf(parseInt(movieId, 10)) -
                                  1
                              )
                            ]
                          }`,
                          query: { playVideo: 'false' },
                        }}
                        className={`${
                          parseInt(movieId, 10) === currentMovieIds.at(0)
                            ? 'inline p-1 text-gray-400 cursor-default'
                            : 'inline ml-4 border border-gray-400 rounded-full p-2 cursor-pointer grow-on-hold'
                        }`}
                        aria-label="Go to the last page"
                      >
                        <MdNavigateBefore />
                      </Link>
                      <Link
                        href={{
                          pathname: `/${
                            currentMovieIds[
                              Math.min(
                                currentMovieIds.indexOf(parseInt(movieId, 10)) +
                                  1,
                                currentMovieIds.length - 1
                              )
                            ]
                          }`,
                          query: { playVideo: 'false' },
                        }}
                        className={`${
                          parseInt(movieId, 10) === currentMovieIds.at(-1)
                            ? 'inline p-1 text-gray-400 ml-4 cursor-default'
                            : 'inline ml-4 border border-gray-400 rounded-full p-2 cursor-pointer grow-on-hold'
                        }`}
                        aria-label="Go to the next page"
                      >
                        <MdNavigateNext />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-1/2 right-8 transform translate-y-1/2 text-5xl text-gray-400">
                  <TfiPlus />
                </div>
              </>
            </>
          )}
        </MovieDetails>
      </Suspense>
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
  const movie = await getMovie(movieId);
  const credits = await getCreditsByMovieId(movieId);
  const director = credits.crew.find(person => person.job === 'Director');
  const detailList = [
    { detail_name: movie.genres[0].name, detail_color: '#F03819' },
    {
      detail_name: movie.genres[1]
        ? movie.genres[1].name
        : movie.genres[0].name,
      detail_color: '#FFFFFF',
    },
    { detail_name: director!.name, detail_color: '#FAD029' },
    { detail_name: movie.release_date, detail_color: '#8142E6' },
  ];

  return (
    <>
      <MoviePreview params={params} searchParams={searchParams} />
      <div className="bg-zinc-900">
        <div
          className="flex justify-center items-center w-full bg-black pb-48"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 10%, 0 100%)',
          }}
        >
          <FaChevronDown className="text-3xl flex-grow-1 mt-3" />
        </div>

        <div className="bg-background">
          <div
            className="grid grid-cols-1 grid-rows-1 min-h-[40em] relative place-items-center w-full overflow-x-hidden overflow-y-hidden pb-60 pt-4 bg-zinc-900 z-0"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)',
            }}
          >
            <div className="col-start-1 row-start-1 w-full relative">
              <SingleMovieCanvas movie={movie} />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="col-start-1 row-start-1 -rotate-3 pointer-events-none">
              <DetailList items={detailList} heading={''} />
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={<h2>Loading...</h2>}>
        <ScreeningsOrNothing params={params} />
      </Suspense>
    </>
  );
}

export async function ScreeningsOrNothing({
  params,
}: {
  params: { movieId: string };
}) {
  const { movieId } = await params;
  const screenings = await getThisWeeksScreenings(movieId);

  return typeof screenings === 'string' ? (
    <p>No screenings for this week</p>
  ) : (
    <div className="min-h-[90vh]">
      <CurrentScreeningsComponent screenings={screenings} />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { movieId: string };
}) {
  const { movieId } = await params;
  const movie = await getMovie(movieId);
  return {
    title: `Watch ${movie.title} together | ScalpersParadise`,
    description: `Showtimes, cast, and details for "${movie.title}" at ScalpersParadise.`,
  };
}
