import ProfileUI from '@/components/ProfileComponents/ProfileUI'
import JsonLd from '@/components/SEO/JsonLd'
import { createBreadcrumbSchema } from '@/lib/seo/schema'
import { createPageMetadata, getPageSeo } from '@/lib/seo/siteSeo'
import React from 'react'

export const metadata = createPageMetadata(getPageSeo('/profile'));

export default function Page() {
  return (
    <>
      <JsonLd data={createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Profile', path: '/profile' }])} />
      <ProfileUI />
    </>
  )
}
