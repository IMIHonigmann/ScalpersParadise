import { getCurrentMoviesByName } from '@/actions/APIGetCurrentMovies';
import React from 'react';

type Props = {};

export default async function Home({}: Props) {
  const currentMovies = await getCurrentMoviesByName();
  console.log(currentMovies);
  return (
    <>
      {currentMovies.map((movie, index: number) => (
        <div key={index}>{movie.movieName ? movie.movieName : 'No Name'}</div>
      ))}
    </>
  );
}
