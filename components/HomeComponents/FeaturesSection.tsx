'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Inventory2Icon from '@mui/icons-material/Inventory2';

import { FeaturesSectionWrapper } from '@/styles/StyledComponents/FeaturesSectionWrapper';

const features = [
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
