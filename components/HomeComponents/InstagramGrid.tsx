'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Container, Grid, Typography } from '@mui/material';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

import { assets } from '@/json/assest';
import { InstagramGridWrapper } from '@/styles/StyledComponents/InstagramGridWrapper';

const instagramImages = [
  { id: 1, image: assets.instagram1, alt: "Smoothie bowl breakfast" },
  { id: 2, image: assets.instagram2, alt: "Pouring walnuts into jar" },
  { id: 3, image: assets.instagram3, alt: "Citrus fruits flat lay" },
  { id: 4, image: assets.instagram4, alt: "Stacked roasted cashews" }
];

export default function InstagramGrid() {
  return (
    <InstagramGridWrapper>
      <Container fixed>
        <Box className='instagram_header'>
          <Typography variant='h2'>NutriHarvest Life
          </Typography>
          <Typography variant='body1'>
            Follow our journey on Instagram
          </Typography>
        </Box>

        {/* Desktop Grid Layout */}
        <Box className='desktop_grid'>
          <Grid container spacing={{ lg: 3, xs: 2 }}>
            {instagramImages.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
                <Box className='instagram_card'>
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={500}
                    height={500}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Mobile Splide Slider Layout */}
        <Box className='mobile_slider'>
          <Splide
            options={{
              type: 'Slide',
              perPage: 1,
              gap: '16px',
              arrows: false,
              pagination: true,
              breakpoints: {
                480: {
                  perPage: 1.5,
                  gap: '12px',
                }
              }
            }}
          >
            {instagramImages.map((item) => (
              <SplideSlide key={item.id}>
                <Box className='instagram_card'>
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={500}
                    height={500}
                  />
                </Box>
              </SplideSlide>
            ))}
          </Splide>
        </Box>
      </Container>
    </InstagramGridWrapper>
  );
}
