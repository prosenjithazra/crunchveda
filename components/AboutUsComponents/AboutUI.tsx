'use client';

import React from 'react';
import { AboutWrapper } from '@/styles/StyledComponents/AboutWrapper';
import AboutBanner from './AboutBanner';
import StewardshipSection from './StewardshipSection';
import ArtisanalJourney from './ArtisanalJourney';
import QuoteSection from './QuoteSection';
import SustainabilityCharter from './SustainabilityCharter';

export default function AboutUI() {
  return (
    <AboutWrapper>
      <AboutBanner />
      <StewardshipSection />
      <ArtisanalJourney />
      <QuoteSection />
      <SustainabilityCharter />
    </AboutWrapper>
  );
}
