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
  metadataBase: new URL(siteSeo.url),
  applicationName: siteSeo.name,
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/assets/logo-mark.svg',
    shortcut: '/assets/logo-mark.svg',
    apple: '/assets/logo-mark.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' data-scroll-behavior='smooth' suppressHydrationWarning>
      <body className={inter.className}>
        <JsonLd data={[websiteSchema, organizationSchema]} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
