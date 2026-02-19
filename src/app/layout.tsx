
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import { Providers } from './providers';
import Script from 'next/script';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  title: 'Architect AI',
  description: 'AI-powered business growth analysis',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", spaceGrotesk.variable, spaceMono.variable)}>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background text-foreground')} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
