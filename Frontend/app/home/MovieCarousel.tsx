'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { MdOutlinePlayCircle } from 'react-icons/md';
import { TMDBMovieDetails } from '@/types/TMDB';

export default function MovieCarousel({
  movies,
}: {
  movies: TMDBMovieDetails[];
}) {
  return (
    <div className="px-8 py-4">
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={5}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 6 },
        }}
      >
        {movies.map((movie, index: number) => (
          <SwiperSlide key={movie.id}>
            <Link href={`/${movie.id}`} className="text-center group block">
              <div className="relative overflow-hidden w-[200px] h-[300px] mx-auto flex items-center justify-center">
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : '/Sotenboori3DFallback.png'
                  }
                  alt={movie.title}
                  width={200}
                  height={300}
                  priority={index === 0}
                  className="rounded-md transition-all transform-gpu duration-300 group-hover:scale-110 group-hover:blur-sm group-hover:rotate-1"
                />
                <MdOutlinePlayCircle className="absolute transition-all duration-500 inset-0 m-auto text-8xl opacity-0 group-hover:opacity-100 -translate-x-1 translate-y-3 rotate-[360deg] scale-150 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:-rotate-12 group-hover:scale-100 origin-center pointer-events-none" />
              </div>
              <div className="mt-2 text-white select-none">{movie.title}</div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
