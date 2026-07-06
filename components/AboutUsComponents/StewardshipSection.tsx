'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Container, Grid, Typography } from '@mui/material';
import { assets } from '@/json/assest';
import { useContentModule } from '@/hooks/useContent';
import { StewardshipSectionSkeleton } from '../Loader/SectionSkeletons';

interface StewardshipSectionProps {
  data?: {
    eyebrow?: string;
    heading?: string;
    description?: string;
    quote?: string;
    badgeNumber?: string;
    badgeText?: string;
    image?: string;
    showSection?: boolean;
  };
}

export default function StewardshipSection({ data }: StewardshipSectionProps) {
  const { data: moduleData, isLoading } = useContentModule("about-us");

  if (isLoading && !data) return <StewardshipSectionSkeleton />;

  let eyebrow: string = "Our Roots";
  let heading: string = "A Century of Stewardship";
  let description: string = "For over three generations, the Nur Harvest estate has stood as a beacon of organic excellence. Our journey began with a simple promise: to honor the land and craft purity. We believe that true luxury lies in the purity of the source and the patience of the process.";
  let quote: string = "This is not merely land; it is a trust we hold for those who will follow. Every seed we sow and every harvest we press carries the warmth of the story we write here.";
  let badgeNumber: string = "100+";
  let badgeText: string = "Years of Tradition";
  let image: string = assets.stewardshipFarmer;
  let showSection: boolean = true;

  if (data) {
    if (data.showSection === false) return null;
    eyebrow = data.eyebrow ?? eyebrow;
    heading = data.heading ?? heading;
    description = data.description ?? description;
    quote = data.quote ?? quote;
    badgeNumber = data.badgeNumber ?? badgeNumber;
    badgeText = data.badgeText ?? badgeText;
    image = data.image || image;
  } else {
    const rootsRecord = moduleData?.records?.find(r => r.id === "about-stewardship" || r.id === "about-roots");
    const showSectionField = rootsRecord?.fields?.find(f => f.id === "showSection");
    showSection = showSectionField ? showSectionField.value !== false : true;
    if (!showSection) return null;

    const getFieldValue = (fieldId: string, defaultValue: string): string => {
      const field = rootsRecord?.fields?.find(f => f.id === fieldId);
      return field && typeof field.value === "string" ? field.value : defaultValue;
    };

    eyebrow = getFieldValue("eyebrow", eyebrow);
    heading = getFieldValue("heading", heading);
    description = getFieldValue("description", description);
    quote = getFieldValue("quote", quote);
    badgeNumber = getFieldValue("badgeNumber", badgeNumber);
    badgeText = getFieldValue("badgeText", badgeText);
    image = getFieldValue("image", image);
  }

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
