import ContactUI from '@/components/ContactComponents/ContactUI';
import JsonLd from '@/components/SEO/JsonLd';
import { createBreadcrumbSchema, localBusinessSchema } from '@/lib/seo/schema';
import { createPageMetadata, getPageSeo } from '@/lib/seo/siteSeo';
import React from 'react';

export const metadata = createPageMetadata(getPageSeo('/contact-us'));

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact Us', path: '/contact-us' }]),
          localBusinessSchema,
        ]}
      />
      <ContactUI />
    </>
  );
}
