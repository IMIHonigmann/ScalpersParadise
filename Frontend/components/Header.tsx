import { PiTextAlignLeft } from 'react-icons/pi';
import { HomeLogo } from './HomeLogo';
import { CiSearch } from 'react-icons/ci';
import { Oswald } from 'next/font/google';
import dynamic from 'next/dynamic';
import Navbar from './Navbar';

const MovieSearcher = dynamic(() => import('@/components/MovieSearcher'));

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
      className={`flex justify-center gap-x-2 relative mx-auto text-right items-start w-full p-8 tracking-widest`}
    >
      <HomeLogo />
      <Navbar
        navItems={navItems}
        className="w-1/4 lg:w-[10%] order-last md:order-1"
      />
      <div className="flex-[2] order-1" />
      <span
        className="w-3/4
            flex justify-between items-center relative
          after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-[98%] after:h-px after:bg-current order-2"
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
