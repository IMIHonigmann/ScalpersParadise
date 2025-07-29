import { FaChevronDown } from 'react-icons/fa6';
import { getMovieById } from '@/actions/TMDBGetMovieById';
import { getCreditsByMovieId } from '@/actions/TMDBGetCreditsByMovieId';
import { Suspense } from 'react';
import { SingleMovieCanvas } from './MiniPreview';
import DetailList from './DetailList';
import { MoviePreview, ScreeningsOrNothing } from './MovieDetails';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ movieId: string }>;
  searchParams: Promise<{ playVideo?: string }>;
}) {
  const { movieId } = await params;
  const { playVideo = 'false' } = await searchParams;
  const movie = await getMovieById(movieId);
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
      <MoviePreview params={params} playVideo={playVideo} />
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
              <SingleMovieCanvas movie={movie} className="h-[30em]" />
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
