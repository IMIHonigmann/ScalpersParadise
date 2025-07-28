import { getCurrentMovies } from '@/actions/APIGetCurrentMovies';
import Header from '@/components/Header';
import { BoxCanvas } from './MovieBox';
import HeroSlider from './HeroSlider';

import 'swiper/css';
import 'swiper/css/navigation';
import MovieCarousel from './MovieCarousel';

export default async function Home() {
  const currentMovies = await getCurrentMovies();
  const highlightedMovies = [
    currentMovies[0],
    currentMovies[7],
    currentMovies[17],
    currentMovies[14],
    currentMovies[9],
  ];
  return (
    <div className="bg-zinc-900">
      <Header />
      <HeroSlider highlightedMovies={highlightedMovies} />

      <br />
      <br />
      <br />
      <MovieCarousel movies={currentMovies} />

      {/* You can keep BoxCanvas if you want */}
      <BoxCanvas currentMovies={highlightedMovies} />
    </div>
  );
}
