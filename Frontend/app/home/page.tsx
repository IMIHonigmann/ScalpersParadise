import { getCurrentMovies } from '@/actions/APIGetCurrentMovies';
import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { BoxCanvas } from './MovieBox';
import HeroSlider from './HeroSlider';
import { MdOutlinePlayCircle } from 'react-icons/md';

export default async function Home() {
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
            <div className="relative overflow-hidden w-[200px] h-[300px] mx-auto flex items-center justify-center">
              <Image
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/Sotenboori3DFallback.png'
                }
                alt={''}
                width={500}
                height={500}
                priority={index === 0}
                className="rounded-md transition-all transform-gpu duration-300 group-hover:scale-110 group-hover:blur-sm group-hover:rotate-1"
              />
              <MdOutlinePlayCircle className="absolute transition-all duration-500 inset-0 m-auto text-8xl opacity-0 group-hover:opacity-100 -translate-x-1 translate-y-3 rotate-[360deg] scale-150 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:-rotate-12 group-hover:scale-100 origin-center pointer-events-none" />
            </div>
            <div>{movie.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
