import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Real Estate Image Editor',
  description: 'AI-powered image editing for real estate listings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
