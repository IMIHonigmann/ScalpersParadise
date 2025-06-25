'use client';

import { useRef } from 'react';
import Image from 'next/image';

import { TMDBMovieDetails } from '@/types/TMDB';

type BackgroundProps = {
  videoId: string | undefined;
  movie: TMDBMovieDetails;
};

export default function Background({ videoId, movie }: BackgroundProps) {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Image
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={`${movie.title} backdrop`}
        fill
        className="object-cover opacity-100"
        quality={90}
        priority
      />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 transition-opacity duration-500"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
        ref={divRef}
      />
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&playsinline=1&start=15`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute w-[135%] h-[135%] left-1/2 top-1/2 transition-opacity duration-500"
        onLoad={() => {
          setTimeout(() => {
            if (!iFrameRef.current || !divRef.current || !videoId) return;
            iFrameRef.current.style.opacity = '1';
            divRef.current.style.opacity = '0';
          }, 750);
        }}
        style={{ transform: 'translate(-50%, -50%)', opacity: 0 }}
        ref={iFrameRef}
      ></iframe>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
    </>
  );
}
