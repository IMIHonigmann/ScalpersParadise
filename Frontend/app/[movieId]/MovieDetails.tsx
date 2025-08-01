import { getCurrentMovieIds } from '@/actions/APIGetCurrentMovies';
import { getThisWeeksScreenings } from '@/actions/APIGetScreeningDetails';
import { getAgeRatingByMovieId } from '@/actions/TMDBGetAgeRatingByMovieId';
import { getCreditsByMovieId } from '@/actions/TMDBGetCreditsByMovieId';
import { getMovieById } from '@/actions/TMDBGetMovieById';
import { getTrailerByMovieId } from '@/actions/TMDBGetTrailerByMovieId';
import Header from '@/components/Header';
import { MovieDetailsProps } from '@/types/TMDB';
import dynamic from 'next/dynamic';
import { Oswald } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { TfiPlus } from 'react-icons/tfi';
import ScrollDownButton from './ScrollDownButton';

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

export async function MovieDetails({
  movieId,
  children,
}: {
  movieId: string;
  children: (data: MovieDetailsProps) => React.ReactNode;
}) {
  const [movie, credits, videos, ageRating, currentMovieIds] =
    await Promise.all([
      await getMovieById(movieId),
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

export async function ScreeningsOrNothing({
  params,
}: {
  params: Promise<{ movieId: string }>;
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
  params: Promise<{ movieId: string }>;
}) {
  const { movieId } = await params;
  const movie = await getMovieById(movieId);
  return {
    title: `Watch ${movie.title} together | ScalpersParadise`,
    description: `Showtimes, cast, and details for "${movie.title}" at ScalpersParadise.`,
  };
}

export async function MoviePreview({
  params,
  playVideo,
}: {
  params: Promise<{ movieId: string }>;
  playVideo: string;
}) {
  const { movieId } = await params;
  const shouldPlayVideo = playVideo === 'true';

  const ratingColors = {
    0: '#FFFFFF',
    6: '#FFE500',
    12: '#13A538',
    16: '#00A0DE',
    18: '#E20512',
  };

  function cutAfterNthSentence(text: string, sentencesToKeep: number) {
    let dotIndex = 0;
    let searchStart = -1;

    for (let i = 0; i < sentencesToKeep; i++) {
      dotIndex = text.indexOf('.', searchStart);
      if (dotIndex === -1) return text;
      searchStart = dotIndex + 1;
    }

    const firstSentence = text.substring(0, dotIndex + 1);
    return dotIndex + 1 < text.length ? firstSentence + '..' : firstSentence;
  }

  return (
    <div
      className="relative bottom-0 left-0 h-[100svh] border-0 overflow-hidden
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
                <div className="absolute bottom-[-90px] md:bottom-0 left-0 px-12 lg:py-6 w-full">
                  <div
                    className="flex flex-col font-bold text-9xl text-center md:text-left"
                    style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                  >
                    <h1
                      className={`text-yellow-400 font-bold min-w-3/5 max-w-full pr-4 
                        ${
                          movie.title.length <= 15
                            ? 'text-8xl'
                            : movie.title.length <= 25
                            ? 'text-7xl lg:text-9xl'
                            : movie.title.length <= 40
                            ? 'text-5xl lg:text-7xl 2xl:text-8xl'
                            : movie.title.length <= 60
                            ? 'text-4xl lg:text-6xl 2xl:text-7xl'
                            : 'text-xl md:text-2xl lg:text-4xl 2xl:text-5xl'
                        }`}
                    >
                      {movie.title}
                    </h1>
                    <span
                      className="text-4xl md:text-5xl lg:text-6xl whitespace-nowrap"
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
                  <div className="grid grid-cols-12 grid-rows-[1fr_50px_50px_auto] md:grid-rows-[1fr_50px_auto] w-full gap-8 mt-4">
                    <p className="tracking-widest hidden md:inline-block md:col-span-3 lg:col-span-2 xl:col-span-1">
                      {cutAfterNthSentence(movie.tagline, 1)}
                    </p>
                    <p
                      className={`text-sm text-gray-400 ${oswald.className} tracking-normal leading-relaxed col-span-full md:col-span-6 lg:col-span-6 xl:col-span-3`}
                    >
                      {cutAfterNthSentence(movie.overview, 2)}
                    </p>
                    <div className="col-span-full md:col-span-4 lg:col-span-3 col-start-2 md:col-start-2 lg:col-start-2 row-start-2 grid grid-cols-5 md:grid-cols-3 gap-x-2">
                      <ScrollDownButton />
                      <a
                        href={`https://www.youtube.com/watch?v=${videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors row-start-2 col-start-3 col-span-2 justify-center md:col-start-3"
                      >
                        <FaRegCirclePlay className="text-3xl flex-shrink-0" />{' '}
                        Trailer
                      </a>
                    </div>
                    <div className="row-start-3 md:row-start-2 col-start-1 md:col-start-9 lg:col-start-6 col-span-full md:col-span-2 flex justify-between place-items-center gap-x-5">
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
                    <div className="hidden lg:flex justify-center p-12 text-3xl row-start-2 col-start-11 col-span-2 place-items-center ">
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
                <div className="absolute bottom-1/2 right-8 transform translate-y-1/2 text-5xl text-gray-400 hidden md:block">
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
