import type { Metadata } from 'next';
import { Ubuntu } from 'next/font/google';
import { Providers } from './providers';

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Family APP',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ubuntu.className}>
        <Providers>
          <header>HEADER</header>
          <main>{children}</main>
          <footer>FOOTER</footer>
        </Providers>
      </body>
    </html>
  );
}
