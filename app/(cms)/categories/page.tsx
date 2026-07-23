import CategoriesUI from '@/components/CategoriesComponents/CategoriesUI'
import JsonLd from '@/components/SEO/JsonLd'
import { createBreadcrumbSchema, createCollectionPageSchema } from '@/lib/seo/schema'
import { createPageMetadata, getPageSeo } from '@/lib/seo/siteSeo'
import React from 'react'

export const metadata = createPageMetadata(getPageSeo('/categories'));

export default function Page() {
  const collectionSchema = createCollectionPageSchema({
    name: "Curated Organic Collections | Crunchveda Categories",
    description: "Explore Crunchveda categories including premium dates, exotic nuts, ancient grains, artisanal oils, and gifting collections.",
    url: "/categories",
  });

  return (
    <>
      <JsonLd data={[createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Categories', path: '/categories' }]), collectionSchema]} />
      <CategoriesUI/>
    </>
  )
}
