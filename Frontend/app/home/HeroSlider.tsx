'use client';

import { useState } from 'react';
import {
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlinePlayCircle,
} from 'react-icons/md';
import { SliderCartridgeCanvas } from './SliderCartridgePreview';
import Image from 'next/image';
import Link from 'next/link';
import { TMDBMovieDetails } from '@/types/TMDB';

type props = {
  highlightedMovies: TMDBMovieDetails[];
};

export default function HeroSlider({ highlightedMovies }: props) {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [rotationDirection, setRotationDirection] = useState(0);
  const [fade, setFade] = useState(true);

  // Handle fade out/in on index change
  const handleChange = (nextIndex: number, direction: number) => {
    setRotationDirection(prev => prev + direction);
    setHighlightedIndex(nextIndex);

    setFade(false);
    setTimeout(() => {
      setFade(true);
    }, 100);
  };

  return (
    <div className="flex justify-center h-full w-full">
      <div className="grid grid-cols-[50px_0.7fr_0.3fr_50px] gap-x-4 items-center text-3xl h-1/4 mx-auto">
        <MdNavigateBefore
          onClick={() =>
            handleChange(
              (highlightedIndex - 1 + highlightedMovies.length) %
                highlightedMovies.length,
              -1
            )
          }
          className="cursor-pointer flex-shrink-0 text-7xl transition-transform scale-100 hover:scale-150"
        />
        {/* Hover group for image and play icon */}
        <Link
          href={`/${highlightedMovies[highlightedIndex].id}`}
          className="relative group flex items-center justify-center h-full"
          tabIndex={-1}
        >
          <Image
            key={highlightedMovies[highlightedIndex].backdrop_path}
            src={`https://image.tmdb.org/t/p/w1280${highlightedMovies[highlightedIndex].backdrop_path}`}
            width={1280}
            height={720}
            alt={''}
            className={`cursor-pointer select-none object-contain h-full transition-all duration-300 transform-gpu group-hover:scale-90 group-hover:blur-sm group-hover:-rotate-1 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <MdOutlinePlayCircle
            className="absolute inset-0 m-auto text-[8rem] text-white opacity-0 group-hover:opacity-80 scale-75 group-hover:scale-100  transition-all duration-300 pointer-events-none drop-shadow-lg"
            style={{ pointerEvents: 'none' }}
          />
        </Link>
        <div className="text-3xl grid grid-rows-[0.1fr_0.9fr] gap-4 h-full text-center">
          <span
            key={highlightedMovies[highlightedIndex].title}
            className={`transition-opacity duration-300 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {highlightedMovies[highlightedIndex].title}
          </span>
          <SliderCartridgeCanvas
            className="h-full w-full"
            movie={highlightedMovies[highlightedIndex]}
            rotationDirection={rotationDirection}
            setRotationDirection={setRotationDirection}
          />
        </div>
        <MdNavigateNext
          onClick={() =>
            handleChange((highlightedIndex + 1) % highlightedMovies.length, 1)
          }
          className="cursor-pointer flex-shrink-0 text-7xl transition-transform scale-100 hover:scale-150"
        />
      </div>
    </div>
  );
}
