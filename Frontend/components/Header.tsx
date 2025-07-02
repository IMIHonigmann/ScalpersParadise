import { PiTextAlignLeft } from 'react-icons/pi';
import { HomeLogo } from './HomeLogo';
import Link from 'next/link';
import MovieSearcher from '@/app/[movieId]/MovieSearcher';
import { CiSearch } from 'react-icons/ci';
import { Oswald } from 'next/font/google';

const oswald = Oswald({
  weight: ['400', '500', '700'], // Add any weights you need
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald', // Creates a CSS variable
  adjustFontFallback: true, // Handles optical sizing
});

export default function Header() {
  const navItems = [
    { label: 'Shop', path: '/shop' },
    { label: 'Unlimited', path: '/unlimited' },
    { label: 'Lucky', path: '/random' },
    { label: 'Rent', path: '/rent' },
  ];

  return (
    <div
      className={`flex justify-between relative text-right items-start w-full p-8 tracking-widest`}
    >
      <HomeLogo />
      <nav className="w-[10%]">
        <ul className="flex flex-col space-y-0 text-xl">
          {navItems.map((item, index) => (
            <li
              key={index}
              className="hover:opacity-70 transition-opacity cursor-pointer"
            >
              <Link href={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex-[2]" />
      <span
        className="w-3/4
            flex justify-between items-center relative
          after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-[98%] after:h-px after:bg-current"
      >
        <span
          className={`flex items-center w-full text-left normal-case ${oswald.className} tracking-normal`}
        >
          <CiSearch className="text-3xl mr-[0.5em]" />
          <MovieSearcher />
        </span>
        <PiTextAlignLeft className="text-3xl" />
      </span>
    </div>
  );
}
