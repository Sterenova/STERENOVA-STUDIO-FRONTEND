import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { UserProvider } from '@/contexts/UserContext';
import { APP_METADATA } from '@/config/app';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: APP_METADATA.title,
  description: APP_METADATA.description,
  keywords: [...APP_METADATA.keywords],
  authors: [{ name: APP_METADATA.author }],
  creator: APP_METADATA.company,
  publisher: APP_METADATA.company,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3001'),
  openGraph: {
    title: APP_METADATA.title,
    description: APP_METADATA.description,
    url: 'http://localhost:3001',
    siteName: APP_METADATA.company,
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_METADATA.title,
    description: APP_METADATA.description,
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
          <UserProvider>
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
