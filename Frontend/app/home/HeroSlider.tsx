'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TMDBMovieDetails } from '@/types/TMDB';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

type Props = {
  highlightedMovies: TMDBMovieDetails[];
};

export default function HeroSlider({ highlightedMovies }: Props) {
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-[50px_0.7fr_0.3fr_50px] items-center w-1/2 text-3xl">
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
          className="cursor-pointer select-none w-full"
        />
        <div className="grid grid-rows-[100px_50px] gap-4 place-self-start">
          <span>{highlightedMovies[highlightedIndex].title}</span>
          <span>BRRRRRRRRR</span>
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
