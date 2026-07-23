import ProductUI from '@/components/ProductComponents/ProductUI'
import JsonLd from '@/components/SEO/JsonLd'
import { createBreadcrumbSchema, createCollectionPageSchema } from '@/lib/seo/schema'
import { createPageMetadata, getPageSeo } from '@/lib/seo/siteSeo'
import React, { Suspense } from 'react'

export const metadata = createPageMetadata(getPageSeo('/products'));

export default function Page() {
  const collectionSchema = createCollectionPageSchema({
    name: "Dry Fruit Collections | Organic Nuts & Premium Snacks",
    description: "Shop premium almonds, cashews, walnuts, pistachios, dates, figs, and organic dry fruit blends from Crunchveda.",
    url: "/products",
  });

  return (
    <>
      <JsonLd data={[createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }]), collectionSchema]} />
      <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          Loading products...
        </div>
      }>
        <ProductUI/>
      </Suspense>
    </>
  )
}

