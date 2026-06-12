'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Container, Typography } from '@mui/material';
import { assets } from '@/json/assest';
import { useContentModule } from '@/hooks/useContent';

export default function AboutBanner() {
  const { data: moduleData } = useContentModule("about-us");
  const bannerRecord = moduleData?.records?.find(r => r.id === "about-banner");

  const getFieldValue = (fieldId: string, defaultValue: string): string => {
    const field = bannerRecord?.fields?.find(f => f.id === fieldId);
    return field && typeof field.value === "string" ? field.value : defaultValue;
  };

  const eyebrow = getFieldValue("eyebrow", "EST. 1914");
  const headline = getFieldValue("headline", "Cultivating Legacy Through the Seasons");
  const description = getFieldValue("description", "A century of dedication to the soil, the seed, and the harvest. The story of our organic stewardship.");
  const image = getFieldValue("image", assets.aboutBanner);

  return (
    <Box className="about_hero">
      <Box className="hero_bg">
        <Image
          src={image}
          alt={headline}
          title={headline}
          fill
          priority
          sizes="100vw"
        />
      </Box>
      <Box className="hero_overlay" />
      <Container fixed>
        <Box className="hero_content">
          <Typography variant="h6" className="section_title_small" sx={{ color: 'warning.light' }}>
            {eyebrow}
          </Typography>
          <Typography variant="h1">
            {headline}
          </Typography>
          <Typography variant="body1">
            {description}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
