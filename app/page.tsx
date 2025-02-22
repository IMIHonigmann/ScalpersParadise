'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [movieQuery, setMovieQuery] = useState('');

  useEffect(() => {
    const RAT = process.env.NEXT_PUBLIC_TMDB_RAT;
    const APIKEY = process.env.NEXT_PUBLIC_TMDB_APIKEY;
    const params = {
      query: movieQuery,
      include_adult: 'true',
      language: 'en-US',
      primary_release_year: '', // Empty
      page: '1',
      region: '',
      year: '',
      api_key: APIKEY,
    };

    const queryString = Object.entries(params)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const url = `https://api.themoviedb.org/3/search/movie?${queryString}`;
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
        console.log(url);
        setMovies(json.results || []);
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
          <li key={movie.id} className="mb-2">
            {movie.title} ({movie.release_date.substring(0, 4)})
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
