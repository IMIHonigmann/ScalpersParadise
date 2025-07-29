import type { Metadata } from 'next';
import { Bebas_Neue } from 'next/font/google';
import './globals.css';
import './externalanimations.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Relax, don't forget",
  description:
    'Watching movies should be memorable and not lonely. Chat with some people!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.className} antialiased`}>{children}</body>
    </html>
  );
}
