import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'สื่อความรู้เพื่อพระสงฆ์ (Digital-library) - ห้องสมุดดิจิทัล',
  description: 'ห้องสมุดดิจิทัลสำหรับพระสงฆ์และผู้สนใจศึกษาธรรม',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
