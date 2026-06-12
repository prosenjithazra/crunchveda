'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Inventory2Icon from '@mui/icons-material/Inventory2';

import { FeaturesSectionWrapper } from '@/styles/StyledComponents/FeaturesSectionWrapper';
import { useHomeSection } from '@/hooks/useContent';

const defaultFeatures = [
  {
    icon: <SpaIcon />,
    title: "100% Organic",
    desc: "Sourced from certified organic farms committed to sustainable heritage agriculture.",
    bgClass: "organic_bg"
  },
  {
    icon: <VerifiedIcon />,
    title: "Premium Quality",
    desc: "Every batch undergoes rigorous quality checks for size, freshness, and nutrient density.",
    bgClass: "quality_bg"
  },
  {
    icon: <LocalShippingIcon />,
    title: "Eco-Fast Delivery",
    desc: "Sustainable carbon-neutral shipping ensures your health arrives at your doorstep swiftly.",
    bgClass: "delivery_bg"
  },
  {
    icon: <Inventory2Icon />,
    title: "Artisanal Packing",
    desc: "Breathable, eco-friendly packaging designed to maintain crunch and essential oils.",
    bgClass: "packing_bg"
  }
];

export default function FeaturesSection() {
  const { data: sectionData } = useHomeSection("features");

  const featuresRaw = (sectionData?.content?.features as string) || "";

  let features = defaultFeatures;
  if (featuresRaw && featuresRaw.trim()) {
    const lines = featuresRaw.split("\n").filter(Boolean);
    features = lines.map((line, idx) => {
      const parts = line.split("|");
      const title = parts[0]?.trim() || "";
      const desc = parts[1]?.trim() || "";

      let icon = <SpaIcon />;
      let bgClass = "organic_bg";
      if (idx === 1) {
        icon = <VerifiedIcon />;
        bgClass = "quality_bg";
      } else if (idx === 2) {
        icon = <LocalShippingIcon />;
        bgClass = "delivery_bg";
      } else if (idx === 3) {
        icon = <Inventory2Icon />;
        bgClass = "packing_bg";
      }
      return { icon, title, desc, bgClass };
    });
  }

  return (
    <FeaturesSectionWrapper>
      <Container fixed>
        <Box className='features_grid'>
          {features.map((feature) => (
            <Box key={feature.title} className='feature_card'>
              <Box className={`icon_box ${feature.bgClass}`}>
                {feature.icon}
              </Box>
              <Typography variant='h3' className='feature_title'>
                {feature.title}
              </Typography>
              <Typography variant='body1' className='feature_desc'>
                {feature.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </FeaturesSectionWrapper>
  );
}
