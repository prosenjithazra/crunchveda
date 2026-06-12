import React from 'react';
import Image from 'next/image';
import { Box, Container, Typography } from '@mui/material';
import { assets } from '@/json/assest';

export default function AboutBanner() {
  return (
    <Box className="about_hero">
      <Box className="hero_bg">
        <Image
          src={assets.aboutBanner}
          alt="NutriHarvest organic orchard landscape representing a century of stewardship"
          title="NutriHarvest organic stewardship heritage"
          fill
          priority
          sizes="100vw"
        />
      </Box>
      <Box className="hero_overlay" />
      <Container fixed>
        <Box className="hero_content">
          <Typography variant="h6" className="section_title_small" sx={{ color: 'warning.light' }}>
            EST. 1914
          </Typography>
          <Typography variant="h1">
            Cultivating Legacy Through the Seasons
          </Typography>
          <Typography variant="body1">
            A century of dedication to the soil, the seed, and the harvest. The story of our organic stewardship.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
