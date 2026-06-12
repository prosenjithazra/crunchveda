'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Button, Container, Typography } from '@mui/material';

import { assets } from '@/json/assest';
import { GiftBannerWrapper } from '@/styles/StyledComponents/GiftBannerWrapper';

export default function GiftBanner() {
  return (
    <GiftBannerWrapper>
      <Container fixed>
        <Box className='gift_banner_card'>
          {/* Background Image & Overlay */}
          <Image
            src={assets.giftBannerBg}
            alt="Gift of Health dry fruit box"
            width={1200}
            height={800}
            className='banner_img'
          />
          <Box className='banner_overlay' />

          {/* Card Content */}
          <Box className='banner_content'>
            <Typography variant='body1' className='cmnSmallTitle'>
              GIFT OF HEALTH
            </Typography>
            <Typography variant='h2'>
              Premium Curated Gift Boxes
            </Typography>
            <Typography variant='body1'>
              Celebrate special moments with our elegant gift hampers. Perfect for corporate
              gifting or cherished family traditions.
            </Typography>
            <Button
              variant='contained'
              className='customize_btn'
              disableRipple
            >
              Customize Your Box
            </Button>
          </Box>
        </Box>
      </Container>
    </GiftBannerWrapper>
  );
}
