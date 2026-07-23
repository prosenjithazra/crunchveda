import BestSellerUI from '@/components/BestSellerComponents/BestSellerUI';
import JsonLd from '@/components/SEO/JsonLd';
import { createBreadcrumbSchema, createCollectionPageSchema } from '@/lib/seo/schema';
import { createPageMetadata, getPageSeo } from '@/lib/seo/siteSeo';
import React from 'react';

export const metadata = createPageMetadata(getPageSeo('/best-seller'));

export default function Page() {
  const collectionSchema = createCollectionPageSchema({
    name: "Best Selling Organic Dry Fruits | Crunchveda",
    description: "Browse Crunchveda best sellers, limited-batch harvests, premium dates, organic honey, walnuts, and exotic fruit selections.",
    url: "/best-seller",
  });

  return (
    <>
      <JsonLd data={[createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Best Seller', path: '/best-seller' }]), collectionSchema]} />
      <BestSellerUI />
    </>
  );
}
