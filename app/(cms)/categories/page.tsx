import CategoriesUI from '@/components/CategoriesComponents/CategoriesUI'
import JsonLd from '@/components/SEO/JsonLd'
import { createBreadcrumbSchema } from '@/lib/seo/schema'
import { createPageMetadata, getPageSeo } from '@/lib/seo/siteSeo'
import React from 'react'

export const metadata = createPageMetadata(getPageSeo('/categories'));

export default function Page() {
  return (
    <>
      <JsonLd data={createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Categories', path: '/categories' }])} />
      <CategoriesUI/>
    </>
  )
}
