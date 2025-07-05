'use client';

import { LuCirclePlay } from 'react-icons/lu';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function PlayButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="absolute flex items-center justify-center w-full h-full z-20 text-9xl pointer-events-none">
      <div className="absolute flex flex-col">
        <div className="px-96 group pointer-events-auto">
          <button
            className="opacity-0 group-hover:opacity-50 hover:!opacity-75 translate-x-1.5 group-hover:translate-x-0 hover:scale-110 transition-[opacity_transform] duration-200"
            onClick={e => {
              router.push(
                pathname + '?' + createQueryString('playVideo', 'true')
              );
              e.currentTarget.classList.remove('hover:!opacity-75');
              e.currentTarget.classList.add('grow-shrink-click');
            }}
            aria-label="Play Video"
          >
            <LuCirclePlay />
          </button>
        </div>
        <div className="p-6" />
      </div>
    </div>
  );
}
