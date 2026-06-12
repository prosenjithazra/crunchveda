'use client';

import React from 'react';
import BestSellerHero from './BestSellerHero';
import BestSellerGrid from './BestSellerGrid';
import BestSellerQuote from './BestSellerQuote';
import BestSellerHighlights from './BestSellerHighlights';

export default function BestSellerUI() {
  return (
    <>
      <BestSellerHero />
      <BestSellerGrid />
      <BestSellerQuote />
      <BestSellerHighlights />
    </>
  );
}
