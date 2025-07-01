import { getCurrentMovies } from '@/actions/APIGetCurrentMovies';
import Image from 'next/image';
import Link from 'next/link';

type Props = {};

export default async function Home({}: Props) {
  const currentMovies = await getCurrentMovies();
  console.log('bruh', currentMovies);
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex gap-4">
        {currentMovies.map((movie, index: number) => (
          <Link href={`/${movie.id}`} key={index} className="text-center">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={''}
              width={500}
              height={500}
            />
            <div>{movie.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
