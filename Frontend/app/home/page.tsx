import { getCurrentMovies } from '@/actions/APIGetCurrentMovies';
import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { BoxCanvas } from './MovieBox';

type Props = {};

export default async function Home({}: Props) {
  const currentMovies = await getCurrentMovies();
  return (
    <>
      <Header />
      <BoxCanvas />
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex gap-4">
          {currentMovies.map((movie, index: number) => (
            <Link href={`/${movie.id}`} key={index} className="text-center">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={''}
                width={500}
                height={500}
                priority={index === 0}
              />
              <div>{movie.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
