'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';

import { assets } from '@/json/assest';
import { GiftBannerWrapper } from '@/styles/StyledComponents/GiftBannerWrapper';
import { useContentModule } from '@/hooks/useContent';

export default function GiftBanner() {
  const { data: moduleData } = useContentModule("home");
  
  // Find the home-gift-banner record
  const giftRecord = moduleData?.records?.find(r => r.id === "home-gift-banner");
  
  // Extract values with default fallbacks
  const getFieldValue = (fieldId: string, defaultValue: string): string => {
    const field = giftRecord?.fields?.find(f => f.id === fieldId);
    return field && typeof field.value === "string" ? field.value : defaultValue;
  };

  const eyebrow = getFieldValue("eyebrow", "GIFT OF HEALTH");
  const heading = getFieldValue("heading", "Premium Curated Gift Boxes");
  const description = getFieldValue("description", "Celebrate special moments with our elegant gift hampers. Perfect for corporate gifting or cherished family traditions.");
  const ctaLabel = getFieldValue("ctaLabel", "Customize Your Box");
  const ctaHref = getFieldValue("ctaHref", "/gifts");
  const image = getFieldValue("image", assets.giftBannerBg);

  return (
    <GiftBannerWrapper>
      <Container fixed>
        <Box className='gift_banner_card'>
          {/* Background Image & Overlay */}
          <Image
            src={image}
            alt={heading}
            width={1200}
            height={800}
            className='banner_img'
          />
          <Box className='banner_overlay' />

          {/* Card Content */}
          <Box className='banner_content'>
            <Typography variant='body1' className='cmnSmallTitle'>
              {eyebrow}
            </Typography>
            <Typography variant='h2'>
              {heading}
            </Typography>
            <Typography variant='body1'>
              {description}
            </Typography>
            <Button
              variant='contained'
              className='customize_btn'
              disableRipple
              component={Link}
              href={ctaHref}
            >
              {ctaLabel}
            </Button>
          </Box>
        </Box>
      </Container>
    </GiftBannerWrapper>
  );
}
