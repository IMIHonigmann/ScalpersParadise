'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const RAT = process.env.NEXT_PUBLIC_TMDB_RAT;
    const APIKEY = process.env.NEXT_PUBLIC_TMDB_APIKEY;

    const url = `https://api.themoviedb.org/3/find/1399?external_source=imdb_id&language=en-US&api_key=${APIKEY}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${RAT}`,
      },
    };
    async function fetchMovies() {
      try {
        const res = await fetch(url, options);
        const json = await res.json();
        console.log(json);
        setMovies(json.results || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchMovies();
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Popular Movies</h1>
      <ul>
        {movies.map(movie => (
          <li key={movie.id} className="mb-2">
            {movie.title}
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
