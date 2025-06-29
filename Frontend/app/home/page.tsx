import { getCurrentMoviesByName } from '@/actions/APIGetCurrentMovies';
import Image from 'next/image';

type Props = {};

export default async function Home({}: Props) {
  const currentMovies = await getCurrentMoviesByName();
  console.log('bruh', currentMovies);
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex gap-4">
        {currentMovies.map((movie, index: number) => (
          <div className="text-center" key={index}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={''}
              width={500}
              height={500}
            />
            <div>{movie.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
