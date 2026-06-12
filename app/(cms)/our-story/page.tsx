import StoryUI from '@/components/StoryComponents/StoryUI'
import JsonLd from '@/components/SEO/JsonLd'
import { createBreadcrumbSchema } from '@/lib/seo/schema'
import { createPageMetadata, getPageSeo } from '@/lib/seo/siteSeo'
import React from 'react'

export const metadata = createPageMetadata(getPageSeo('/our-story'));

export default function Page() {
  return (
    <>
      <JsonLd data={createBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Our Story', path: '/our-story' }])} />
      <StoryUI />
    </>
  )
}
