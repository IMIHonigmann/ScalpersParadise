'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TMDBMovieDetails } from '@/types/TMDB';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { SingleMovieCanvas } from '../[movieId]/MiniPreview';

type Props = {
  highlightedMovies: TMDBMovieDetails[];
};

export default function HeroSlider({ highlightedMovies }: Props) {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  return (
    <div className="flex justify-center h-full w-full">
      <div className="grid grid-cols-[50px_0.7fr_0.3fr_50px] gap-x-4 items-center text-3xl h-1/4 mx-auto">
        <MdNavigateBefore
          onClick={() =>
            setHighlightedIndex(
              prev =>
                (prev - 1 + highlightedMovies.length) % highlightedMovies.length
            )
          }
          className="cursor-pointer flex-shrink-0 text-7xl"
        />
        <Image
          src={`https://image.tmdb.org/t/p/w1280${highlightedMovies[highlightedIndex].backdrop_path}`}
          width={1280}
          height={720}
          alt={''}
          className="cursor-pointer select-none object-contain h-full"
        />
        <div className="grid grid-rows-[0.1fr_0.9fr] gap-4 h-full">
          <span>{highlightedMovies[highlightedIndex].title}</span>
          <SingleMovieCanvas
            className="h-full w-full"
            movie={highlightedMovies[highlightedIndex]}
          />
        </div>
        <MdNavigateNext
          onClick={() =>
            setHighlightedIndex(prev => (prev + 1) % highlightedMovies.length)
          }
          className="cursor-pointer flex-shrink-0 text-7xl"
        />
      </div>
    </div>
  );
}
