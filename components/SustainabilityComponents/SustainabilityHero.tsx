'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Container, Typography } from '@mui/material';
import { assets } from '@/json/assest';
import { SustainabilityHeroWrapper } from '@/styles/StyledComponents/SustainabilityHeroWrapper';
import { useContentModule } from '@/hooks/useContent';
import { SustainabilityHeroSkeleton } from '../Loader/SectionSkeletons';

export default function SustainabilityHero() {
  const { data: moduleData, isLoading } = useContentModule("sustainability");
  if (isLoading) return <SustainabilityHeroSkeleton />;

  const heroRecord = moduleData?.records?.find(r => r.id === "sustainability-hero");
  const showSectionField = heroRecord?.fields?.find(f => f.id === "showSection");
  const showSection = showSectionField ? showSectionField.value !== false : true;
  if (!showSection) return null;

  const getFieldValue = (fieldId: string, defaultValue: string): string => {
    const field = heroRecord?.fields?.find(f => f.id === fieldId);
    return field && typeof field.value === "string" ? field.value : defaultValue;
  };

  const tag = getFieldValue("tag", "Our Green Pledge");
  const heading = getFieldValue("heading", "A Charter for the Future of Food");
  const description = getFieldValue("description", "We believe luxury is keeping the integrity of the soil, the purity of the food, and the transparency of the journey. Harvest fields to your table.");
  const image = getFieldValue("image", assets.sustainabilityHeroBg);
  const quote = getFieldValue("quote", "We do not inherit the earth from our ancestors, we borrow it from our children.");

  return (
    <SustainabilityHeroWrapper>
      {/* Hero Banner Box */}
      <Box className="sustainability_hero">
        <Box className="hero_bg">
          <Image
            src={image}
            alt={heading}
            title={heading}
            fill
            priority
            sizes="100vw"
          />
        </Box>
        <Box className="hero_overlay" />
        <Box className="hero_content">
          <Typography className="section_tag">{tag}</Typography>
          <Typography variant="h1">{heading}</Typography>
          <Typography className="hero_desc">
            {description}
          </Typography>
        </Box>
      </Box>

      {/* BLOCKQUOTE SECTION */}
      <Box className="quote_section">
        <Container fixed>
          <Typography className="quote_symbol">&ldquo;</Typography>
          <Typography component="blockquote">
            &ldquo;{quote}&rdquo;
          </Typography>
        </Container>
      </Box>
    </SustainabilityHeroWrapper>
  );
}
