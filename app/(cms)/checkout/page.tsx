import CheckoutUI from '@/components/CheckoutComponents/CheckoutUI'
import JsonLd from '@/components/SEO/JsonLd'
import { createBreadcrumbSchema } from '@/lib/seo/schema'
import { createPageMetadata, getPageSeo } from '@/lib/seo/siteSeo'
import React from 'react'

export const metadata = createPageMetadata(getPageSeo('/checkout'));

export default function Page() {
  return (
    <>
      <JsonLd data={createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Cart', path: '/cart' }, { name: 'Checkout', path: '/checkout' }])} />
      <CheckoutUI/>
    </>
  )
}
