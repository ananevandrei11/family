import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  title: 'Family Budget',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <header>HEADER</header>
        <main>{children}</main>
        <footer>FOOTER</footer>
      </body>
    </html>
  );
}
