import BestSellerUI from '@/components/BestSellerComponents/BestSellerUI';
import JsonLd from '@/components/SEO/JsonLd';
import { createBreadcrumbSchema } from '@/lib/seo/schema';
import { createPageMetadata, getPageSeo } from '@/lib/seo/siteSeo';
import React from 'react';

export const metadata = createPageMetadata(getPageSeo('/best-seller'));

export default function Page() {
  return (
    <>
      <JsonLd data={createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Best Seller', path: '/best-seller' }])} />
      <BestSellerUI />
    </>
  );
}
