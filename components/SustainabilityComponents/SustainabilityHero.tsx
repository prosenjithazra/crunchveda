import React from 'react';
import Image from 'next/image';
import { Box, Container, Typography } from '@mui/material';
import { assets } from '@/json/assest';
import { SustainabilityHeroWrapper } from '@/styles/StyledComponents/SustainabilityHeroWrapper';

export default function SustainabilityHero() {
  return (
    <SustainabilityHeroWrapper>
      {/* Hero Banner Box */}
      <Box className="sustainability_hero">
        <Box className="hero_bg">
          <Image
            src={assets.sustainabilityHeroBg}
            alt="Rolling green agricultural hills showing NutriHarvest sustainability practices"
            title="NutriHarvest regenerative agriculture landscape"
            fill
            priority
            sizes="100vw"
          />
        </Box>
        <Box className="hero_overlay" />
        <Box className="hero_content">
          <Typography className="section_tag">Our Green Pledge</Typography>
          <Typography variant="h1">A Charter for the Future of Food</Typography>
          <Typography className="hero_desc">
            We believe luxury is keeping the integrity of the soil, the purity of the food, and the transparency of the journey. Harvest fields to your table.
          </Typography>
        </Box>
      </Box>

      {/* BLOCKQUOTE SECTION */}
      <Box className="quote_section">
        <Container fixed>
          <Typography className="quote_symbol">&ldquo;</Typography>
          <Typography component="blockquote">
            &ldquo;We do not inherit the earth from our ancestors, we borrow it from our children.&rdquo;
          </Typography>
        </Container>
      </Box>
    </SustainabilityHeroWrapper>
  );
}
