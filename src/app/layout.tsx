import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sterenova - Générateur de Templates SVG',
  description: 'Interface moderne et responsive pour la génération de templates SVG professionnels',
  keywords: ['sterenova', 'templates', 'svg', 'generation', 'design', 'graphics'],
  authors: [{ name: 'Sterenova Team' }],
  creator: 'Sterenova',
  publisher: 'Sterenova',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3001'),
  openGraph: {
    title: 'Sterenova - Générateur de Templates SVG',
    description: 'Interface moderne et responsive pour la génération de templates SVG professionnels',
    url: 'http://localhost:3001',
    siteName: 'Sterenova',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sterenova - Générateur de Templates SVG',
    description: 'Interface moderne et responsive pour la génération de templates SVG professionnels',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
