'use client';
import { getSearchURLResponse } from '@/actions/TMDBSearchByName';
import { TMDBMovieDetails } from '@/types/TMDB';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { debounce } from 'lodash';
import { HighlightMatch } from '@/components/SearchHighlightHelper';
import { FixedSizeList } from 'react-window';

export default function MovieSearcher() {
  const [movies, setMovies] = useState<TMDBMovieDetails[]>([]);
  const [movieQuery, setMovieQuery] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (!query) return;
      const searchMovies = async () => {
        try {
          const json = await getSearchURLResponse(query);
          console.log(json);
          setMovies(json.results);
        } catch (err) {
          console.error(err);
        }
      };
      searchMovies();
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(movieQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [movieQuery, debouncedSearch]);

  return (
    <>
      <input
        type="text"
        placeholder="Search for movies"
        value={movieQuery}
        onChange={e => setMovieQuery(e.target.value)}
        onFocus={e => {
          e.target.select();
        }}
        className="bg-transparent border-none outline-none text-inherit placeholder-gray-400 w-full"
      />
      {movieQuery.length > 0 && movies.length > 0 && (
        <div className="absolute left-3.5 top-full mt-4 z-50 w-[92%]">
          <FixedSizeList
            className="rounded shadow-lg bg-zinc-900 bg-opacity-75 transition-opacity duration-200"
            height={Math.min(600, movies.length * 140)}
            width="100%"
            itemCount={movies.length}
            itemSize={140}
          >
            {({ index, style }) => {
              const movie = movies[index];
              return (
                <div style={style} key={index}>
                  <li className="list-none relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:transition-[colors_width] after:hover:w-full after:rounded after:w-1/4 after:bg-red-900 hover:after:bg-red-300">
                    <Link
                      href={{
                        pathname: `/${movie.id}`,
                        query: { playVideo: 'false' },
                      }}
                      className="mb-2 transition-colors hover:bg-red-950 p-2 flex items-center"
                    >
                      <div className="relative w-24 h-32 mr-4">
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={`${movie.title} poster`}
                            fill
                            loading="lazy"
                            sizes="200px"
                            className="object-cover rounded"
                            onError={e => {
                              e.currentTarget.src = '/placeholder-poster.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs">
                              NO COVER
                            </span>
                          </div>
                        )}
                      </div>
                      <HighlightMatch text={movie.title} query={movieQuery} /> (
                      {movie.release_date?.substring(0, 4)})
                    </Link>
                  </li>
                </div>
              );
            }}
          </FixedSizeList>
        </div>
      )}
    </>
  );
}
