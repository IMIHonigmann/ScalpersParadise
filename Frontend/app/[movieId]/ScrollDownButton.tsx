'use client';
import React from 'react';

export default function ScrollDownButton() {
  return (
    <button
      onClick={() => {
        window.scrollTo({
          top: window.innerHeight * 0.4,
          behavior: 'smooth',
        });
      }}
      className="bg-red-600 text-white px-6 sm:px-12 md:px-8 xl:px-12 py-4 text-sm rounded row-start-2 col-start-1 md:col-start-1 col-span-2 md:col-span-2 justify-self-center md:justify-self-start transition-shadow duration-300 hover:shadow-[0_0_20px_4px_rgba(220,38,38,0.7)]"
    >
      Take a Ticket
    </button>
  );
}
