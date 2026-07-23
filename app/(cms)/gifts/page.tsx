import GiftsUI from '@/components/GiftsComponents/GiftsUI'
import JsonLd from '@/components/SEO/JsonLd'
import { createBreadcrumbSchema, createCollectionPageSchema } from '@/lib/seo/schema'
import { createPageMetadata, getPageSeo } from '@/lib/seo/siteSeo'
import React from 'react'

export const metadata = createPageMetadata(getPageSeo('/gifts'));

export default function Page() {
  const collectionSchema = createCollectionPageSchema({
    name: "Premium Dry Fruit Gift Hampers | Crunchveda Gifts",
    description: "Order curated dry fruit gift hampers, corporate gift boxes, custom chests, and artisanal wellness gifts from Crunchveda.",
    url: "/gifts",
  });

  return (
    <>
      <JsonLd data={[createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Gifts', path: '/gifts' }]), collectionSchema]} />
      <GiftsUI />
    </>
  )
}
