'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { FaCircle } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

interface DetailItem {
  detail_name: string;
  detail_color?: string;
}

interface DetailListProps {
  heading: string;
  items: DetailItem[];
}

export default function DetailList({ heading, items }: DetailListProps) {
  const componentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion || !componentRef.current) {
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: componentRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 4,
      },
    });

    tl.fromTo(
      '.detail-row',
      {
        x: index => {
          return index % 2 === 0
            ? gsap.utils.random(600, 400)
            : gsap.utils.random(-600, -400);
        },
      },
      {
        x: index => {
          return index % 2 === 0
            ? gsap.utils.random(-600, -400)
            : gsap.utils.random(600, 400);
        },
        ease: 'power1.inOut',
      }
    );

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
  }, []);

  return (
    <section className="overflow-hidden whitespace-nowrap" ref={componentRef}>
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-4xl font-bold mb-8">{heading}</h2>
      </div>

      {items.map((item, rowIndex) => (
        <div
          key={`${item.detail_name}-${rowIndex}`}
          className="detail-row mb-8 flex items-center justify-center gap-4 text-slate-700"
          aria-label={item.detail_name || undefined}
        >
          {Array(15)
            .fill(0)
            .map((_, index) => {
              let rowOffset = 0;
              switch (rowIndex) {
                case 0:
                  rowOffset = -3;
                  break;
                case 1:
                  rowOffset = -2;
                  break;
                case 2:
                  rowOffset = -1;
                  break;
                case 3:
                  rowOffset = 0;
                  break;
                default:
                  rowOffset = 0;
              }
              const isHighlighted =
                index === 8 + rowOffset && item.detail_color;
              return (
                <div key={index} className="flex items-center">
                  <span
                    className="detail-item text-8xl font-extrabold uppercase"
                    style={{
                      color: isHighlighted ? item.detail_color : 'inherit',
                      opacity: isHighlighted ? '100%' : '25%',
                      textShadow: isHighlighted
                        ? '4px 4px 16px rgba(0,0,0,0.5)'
                        : '',
                    }}
                  >
                    {item.detail_name}
                  </span>
                  <span className="text-3xl ml-5 opacity-25 -z-10">
                    <FaCircle />
                  </span>
                </div>
              );
            })}
        </div>
      ))}
    </section>
  );
}
