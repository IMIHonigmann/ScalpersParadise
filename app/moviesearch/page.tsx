'use client';
import { getSearchURLResponse } from '@/utils/TMDBSearchByName';
import { TMDBMovie } from '@/types/TMDB';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [movieQuery, setMovieQuery] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    async function fetchMovies() {
      try {
        const json = await getSearchURLResponse(movieQuery);
        setMovies(json.results);
      } catch (err) {
        console.error(err);
      }
    }

    fetchMovies();
  }, [movieQuery]);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Popular Movies</h1>
      <input
        type="text"
        placeholder="Search for movies"
        value={movieQuery}
        onChange={e => setMovieQuery(e.target.value)}
        className="border p-2 mb-4 text-black"
      />
      <ul>
        {movies.map(movie => (
          <li key={movie.id} className="mb-2 hover:bg-sky-700">
            <Link
              href={{
                pathname: `${pathname}/${movie.id}`,
              }}
            >
              {movie.title} ({movie.release_date.substring(0, 4)})
            </Link>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Enter a parameter"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        className="border p-2 mb-4 text-black"
      />
      <Link href={`/intermediate/${inputValue}`}>
        <button className="mt-4 p-2 bg-blue-500 text-white rounded">
          Go to Intermediate/{inputValue || '...'}
        </button>
      </Link>
    </main>
  );
}
