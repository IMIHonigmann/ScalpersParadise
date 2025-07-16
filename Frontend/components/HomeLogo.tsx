import Link from 'next/link';

type props = {
  className?: string;
};

export function HomeLogo({ className }: props) {
  return (
    <Link
      href="/home"
      className={`font-bold text-5xl p-2 relative group cursor-pointer text-center ${className}`}
    >
      <span className="transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 duration-300 absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-300" />
      <span className="transition-transform group-hover:-translate-x-2 group-hover:translate-y-2 duration-300 absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-300" />
      <span className="transition-all group-hover:opacity-100 group-hover:translate-x-2 group-hover:translate-y-2 delay-300 duration-150 absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-300" />
      24H
      <br />
      MJM
    </Link>
  );
}
