'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { TMDBMovieDetails } from '@/types/TMDB';
import LoadingElement from './LoadingElement';

type BackgroundProps = {
  videoId: string | undefined;
  movie: TMDBMovieDetails;
};

export default function Background({ videoId, movie }: BackgroundProps) {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [showIframe, setShowIframe] = useState(true);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setShowIframe(entry.isIntersecting),
      {
        threshold: 0.1,
        rootMargin: '500px',
      }
    );
    if (divRef.current) observer.observe(divRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={divRef}>
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={`${movie.title} backdrop`}
          fill
          className="object-cover opacity-100 absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 transition-opacity duration-500"
          quality={90}
          priority
        />
        <div className="absolute flex items-center justify-center w-full h-full z-10 text-9xl opacity-75 duration-300 pointer-events-none">
          <div className="absolute flex flex-col">
            <LoadingElement className="scale-[200%]" />
            <div className="p-6" />
          </div>
        </div>
      </div>
      {showIframe && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&playsinline=1&start=15`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute w-[135%] h-[135%] left-1/2 top-1/2 transition-opacity duration-500 pointer-events-none"
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
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
    </>
  );
}
