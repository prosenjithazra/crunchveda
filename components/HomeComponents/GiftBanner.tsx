'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';

import { assets } from '@/json/assest';
import { GiftBannerWrapper } from '@/styles/StyledComponents/GiftBannerWrapper';
import { useHomeSection } from '@/hooks/useContent';
import { GiftBannerSkeleton } from '../Loader/SectionSkeletons';

export default function GiftBanner() {
  const { data: sectionData, isLoading } = useHomeSection("gift-banner");

  if (isLoading) return <GiftBannerSkeleton />;

  const eyebrow = sectionData?.content?.eyebrow || "GIFT OF HEALTH";
  const heading = sectionData?.content?.heading || "Premium Curated Gift Boxes";
  const description = sectionData?.content?.description || "Celebrate special moments with our elegant gift hampers. Perfect for corporate gifting or cherished family traditions.";
  const ctaLabel = sectionData?.content?.ctaLabel || "Customize Your Box";
  const ctaHref = sectionData?.content?.ctaHref || "/gifts";
  const image = sectionData?.content?.image || assets.giftBannerBg;

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
