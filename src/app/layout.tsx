import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cut the Rope',
  description: 'Physics-based rope cutting puzzle game. Slice ropes to swing candy into Om Nom\'s mouth!',
  keywords: ['game', 'puzzle', 'physics', 'rope', 'candy'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
