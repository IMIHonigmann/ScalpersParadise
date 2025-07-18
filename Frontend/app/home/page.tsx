import { getCurrentMovies } from '@/actions/APIGetCurrentMovies';
import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { BoxCanvas } from './MovieBox';
import HeroSlider from './HeroSlider';

type Props = {};

export default async function Home({}: Props) {
  const currentMovies = await getCurrentMovies();
  const highlightedMovies = [
    currentMovies[0],
    currentMovies[1],
    currentMovies[2],
  ];
  return (
    <div className="bg-zinc-900">
      <Header />
      <HeroSlider highlightedMovies={highlightedMovies} />
      <BoxCanvas currentMovies={currentMovies} />
      <div className="grid grid-cols-7 gap-12 min-h-screen p-32">
        {currentMovies.map((movie, index: number) => (
          <Link href={`/${movie.id}`} key={index} className="text-center group">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={''}
              width={500}
              height={500}
              priority={index === 0}
              className="rounded-md transition-transform transform-gpu duration-100 group-hover:scale-x-0"
            />
            <div>{movie.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
