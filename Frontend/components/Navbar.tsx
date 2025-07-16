'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';

type props = {
  navItems: Array<{ label: string; path: string }>;
  className?: string;
};

export default function Navbar({ navItems, className }: props) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => setIsOpen(window.innerWidth >= 768), []);
  return (
    <nav className={` ${className ?? ''}`}>
      <GiHamburgerMenu
        onClick={() => setIsOpen(prev => !prev)}
        className={`text-6xl md:hidden transition-transform duration-300 ml-auto mb-4 ${
          isOpen ? 'rotate-90' : 'rotate-0'
        }`}
      />
      <ul className={`flex flex-col space-y-0 text-xl`}>
        {navItems.map((item, index) => (
          <li
            key={index}
            className={`hover:opacity-70 cursor-pointer transition-all duration-300 ${
              isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            style={{
              transform: `translateX(${isOpen ? '0' : '100%'})`,
              transitionDelay: `${0.075 * index}s`,
            }}
          >
            <Link href={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
