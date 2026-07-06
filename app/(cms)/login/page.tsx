import LoginUI from '@/components/AuthComponents/LoginUI'
import JsonLd from '@/components/SEO/JsonLd'
import { createBreadcrumbSchema } from '@/lib/seo/schema'
import { createPageMetadata, getPageSeo } from '@/lib/seo/siteSeo'
import React, { Suspense } from 'react'

export const metadata = createPageMetadata(getPageSeo('/login'));

export default function Page() {
  return (
    <>
      <JsonLd data={createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Login', path: '/login' }])} />
      <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          Loading...
        </div>
      }>
        <LoginUI />
      </Suspense>
    </>
  )
}
