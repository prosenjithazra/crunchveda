'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Container, Grid, Typography } from '@mui/material';
import { assets } from '@/json/assest';
import { useContentModule } from '@/hooks/useContent';
import { StewardshipSectionSkeleton } from '../Loader/SectionSkeletons';

export default function StewardshipSection() {
  const { data: moduleData, isLoading } = useContentModule("about-us");
  if (isLoading) return <StewardshipSectionSkeleton />;

  const rootsRecord = moduleData?.records?.find(r => r.id === "about-stewardship" || r.id === "about-roots");
  const showSectionField = rootsRecord?.fields?.find(f => f.id === "showSection");
  const showSection = showSectionField ? showSectionField.value !== false : true;
  if (!showSection) return null;

  const getFieldValue = (fieldId: string, defaultValue: string): string => {
    const field = rootsRecord?.fields?.find(f => f.id === fieldId);
    return field && typeof field.value === "string" ? field.value : defaultValue;
  };

  const eyebrow = getFieldValue("eyebrow", "Our Roots");
  const heading = getFieldValue("heading", "A Century of Stewardship");
  const description = getFieldValue("description", "For over three generations, the Nur Harvest estate has stood as a beacon of organic excellence. Our journey began with a simple promise: to honor the land and craft purity. We believe that true luxury lies in the purity of the source and the patience of the process.");
  const quote = getFieldValue("quote", "This is not merely land; it is a trust we hold for those who will follow. Every seed we sow and every harvest we press carries the warmth of the story we write here.");
  const badgeNumber = getFieldValue("badgeNumber", "100+");
  const badgeText = getFieldValue("badgeText", "Years of Tradition");
  const image = getFieldValue("image", assets.stewardshipFarmer);

  return (
    <Box className="section_pad">
      <Container fixed>
        <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} sx={{ alignItems: 'center' }} className="stewardship_row">
          {/* Left Narrative Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" className="section_title_small">
              {eyebrow}
            </Typography>
            <Typography variant="h2" className="section_title_large">
              {heading}
            </Typography>
            <Typography variant="body1" className="body_desc">
              {description}
            </Typography>
            {quote && (
              <Box className="stewardship_quote">
                <Typography variant="body1">
                  &ldquo;{quote}&rdquo;
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Right Image Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="stewardship_imgBox">
              <Image
                src={image}
                alt={heading}
                width={600}
                height={600}
                className="farmer_img"
                priority
              />
              <Box className="floating_badge">
                <Box className="badge_num">{badgeNumber}</Box>
                <Box className="badge_txt">{badgeText}</Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
