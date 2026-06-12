'use client';

import React from 'react'
import HomeBanner from './HomeBanner'
import CuratedCategories from './CuratedCategories'
import FeaturesSection from './FeaturesSection'
import BestSellingProducts from './BestSellingProducts'
import ProductDetailsSection from './ProductDetailsSection'
import HeritageTimeline from './HeritageTimeline'
import InstagramGrid from './InstagramGrid'
import GiftBanner from './GiftBanner'
import FaqSection from './FaqSection'

export default function HomeUI() {
  return (
    <>
      <HomeBanner />
      <CuratedCategories />
      <BestSellingProducts />
      <FeaturesSection />
      <GiftBanner />
      <ProductDetailsSection />
      <HeritageTimeline />
      <InstagramGrid />
      <FaqSection />
    </>
  )
}
