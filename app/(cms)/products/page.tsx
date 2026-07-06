import ProductUI from '@/components/ProductComponents/ProductUI'
import JsonLd from '@/components/SEO/JsonLd'
import { createBreadcrumbSchema } from '@/lib/seo/schema'
import { createPageMetadata, getPageSeo } from '@/lib/seo/siteSeo'
import React from 'react'

export const metadata = createPageMetadata(getPageSeo('/product'));

export default function Page() {
  return (
    <>
      <JsonLd data={createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Products', path: '/product' }])} />
      <ProductUI/>
    </>
  )
}
