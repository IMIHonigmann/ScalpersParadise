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
      <div className="flex justify-center items-center w-1/2 text-7xl">
        <MdNavigateBefore
          onClick={() =>
            setHighlightedIndex(
              prev =>
                (prev - 1 + highlightedMovies.length) % highlightedMovies.length
            )
          }
          className="cursor-pointer"
        />
        <Image
          src={`https://image.tmdb.org/t/p/w1280${highlightedMovies[highlightedIndex].backdrop_path}`}
          width={1280}
          height={720}
          alt={''}
          className="cursor-pointer select-none w-5/6"
        />
        <MdNavigateNext
          onClick={() =>
            setHighlightedIndex(prev => (prev + 1) % highlightedMovies.length)
          }
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
