'use client';

import React from 'react';
import { AboutWrapper } from '@/styles/StyledComponents/AboutWrapper';
import AboutBanner from './AboutBanner';
import StewardshipSection from './StewardshipSection';
import ArtisanalJourney from './ArtisanalJourney';
import QuoteSection from './QuoteSection';
import SustainabilityCharter from './SustainabilityCharter';

import { useQuery } from '@tanstack/react-query';
import {
  AboutBannerSkeleton,
  StewardshipSectionSkeleton,
  ArtisanalJourneySkeleton,
  QuoteSectionSkeleton,
  SustainabilityCharterSkeleton
} from '../Loader/SectionSkeletons';

export default function AboutUI() {
  const { data: bannerRes, isLoading: isBannerLoading } = useQuery({
    queryKey: ["about-banner"],
    queryFn: async () => {
      const res = await fetch("/api/about-us/banner");
      if (!res.ok) throw new Error("Failed to fetch banner");
      return res.json();
    }
  });

  const { data: stewardshipRes, isLoading: isStewardshipLoading } = useQuery({
    queryKey: ["about-stewardship"],
    queryFn: async () => {
      const res = await fetch("/api/about-us/stewardship");
      if (!res.ok) throw new Error("Failed to fetch stewardship");
      return res.json();
    }
  });

  const { data: journeyRes, isLoading: isJourneyLoading } = useQuery({
    queryKey: ["about-journey"],
    queryFn: async () => {
      const res = await fetch("/api/about-us/journey");
      if (!res.ok) throw new Error("Failed to fetch journey");
      return res.json();
    }
  });

  const { data: quoteRes, isLoading: isQuoteLoading } = useQuery({
    queryKey: ["about-quote"],
    queryFn: async () => {
      const res = await fetch("/api/about-us/quote");
      if (!res.ok) throw new Error("Failed to fetch quote");
      return res.json();
    }
  });

  const { data: charterRes, isLoading: isCharterLoading } = useQuery({
    queryKey: ["about-charter"],
    queryFn: async () => {
      const res = await fetch("/api/about-us/charter");
      if (!res.ok) throw new Error("Failed to fetch charter");
      return res.json();
    }
  });

  if (isBannerLoading || isStewardshipLoading || isJourneyLoading || isQuoteLoading || isCharterLoading) {
    return (
      <AboutWrapper>
        <AboutBannerSkeleton />
        <StewardshipSectionSkeleton />
        <ArtisanalJourneySkeleton />
        <QuoteSectionSkeleton />
        <SustainabilityCharterSkeleton />
      </AboutWrapper>
    );
  }

  return (
    <AboutWrapper>
      <AboutBanner data={bannerRes?.data?.banner} />
      <StewardshipSection data={stewardshipRes?.data?.stewardship} />
      <ArtisanalJourney data={journeyRes?.data?.journey} />
      <QuoteSection data={quoteRes?.data?.quote} />
      <SustainabilityCharter data={charterRes?.data?.charter} />
    </AboutWrapper>
  );
}
