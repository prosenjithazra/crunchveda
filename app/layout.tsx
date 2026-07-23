import '@/styles/global.scss';
import JsonLd from '@/components/SEO/JsonLd';
import { organizationSchema, websiteSchema } from '@/lib/seo/schema';
import { createPageMetadata, siteSeo } from '@/lib/seo/siteSeo';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  ...createPageMetadata({
    title: siteSeo.title,
    description: siteSeo.description,
    path: '/',
    image: siteSeo.defaultImage,
  }),
  metadataBase: (() => {
    try {
      return new URL(siteSeo.url);
    } catch {
      return new URL("https://crunchveda.com");
    }
  })(),
  applicationName: siteSeo.name,
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' data-scroll-behavior='smooth' suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={inter.className}>
        <JsonLd data={[websiteSchema, organizationSchema]} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
