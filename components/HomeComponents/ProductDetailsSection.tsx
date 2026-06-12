'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Container, Grid, Typography } from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

import { assets } from '@/json/assest';
import { ProductDetailsSectionWrapper } from '@/styles/StyledComponents/ProductDetailsSectionWrapper';
import { useContentModule } from '@/hooks/useContent';

export default function ProductDetailsSection() {
  const { data: moduleData } = useContentModule("home");
  const detailsRecord = moduleData?.records?.find(r => r.id === "home-product-details");

  const getFieldValue = (fieldId: string, defaultValue: string): string => {
    const field = detailsRecord?.fields?.find(f => f.id === fieldId);
    return field && typeof field.value === "string" ? field.value : defaultValue;
  };

  const walnutEyebrow = getFieldValue("walnutEyebrow", "NATURAL SUPERFOOD");
  const walnutHeading = getFieldValue("walnutHeading", "The Brain-Boosting Power of Walnuts");
  const walnutDescription = getFieldValue("walnutDescription", "Rich in omega-3 fatty acids and antioxidants, our Chilean walnuts are more than just a snack. They are essential fuel for cognitive health and heart vitality.");
  const walnutBulletsRaw = getFieldValue("walnutBullets", "");
  const walnutImage = getFieldValue("walnutImage", assets.walnutDetail);

  const almondEyebrow = getFieldValue("almondEyebrow", "IMMUNE SUPPORT");
  const almondHeading = getFieldValue("almondHeading", "Almonds: Nature's Daily Multi-Vitamin");
  const almondDescription = getFieldValue("almondDescription", "Packed with Vitamin E, magnesium, and protein, our California almonds help maintain healthy skin and a robust immune system with every crunch.");
  const almondBulletsRaw = getFieldValue("almondBullets", "");
  const almondImage = getFieldValue("almondImage", assets.almondDetail);

  // Fallback lists
  const defaultWalnutBullets = ["High in Omega-3 DHA", "Supports Heart Health", "Natural Energy Booster"];
  const defaultAlmondBullets = ["Rich in Vitamin E", "High Fiber Content", "Promotes Skin Health"];

  const walnutBullets = walnutBulletsRaw && walnutBulletsRaw.trim() 
    ? walnutBulletsRaw.split("\n").filter(Boolean)
    : defaultWalnutBullets;

  const almondBullets = almondBulletsRaw && almondBulletsRaw.trim() 
    ? almondBulletsRaw.split("\n").filter(Boolean)
    : defaultAlmondBullets;

  return (
    <ProductDetailsSectionWrapper>
      <Container fixed>
        <Box className='details_container'>

          {/* Row 1: Walnuts (Text Left, Image Right) */}
          <Grid container spacing={{ xs: 4, md: 6, lg: 10 }} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className='detail_content'>
                <Typography variant='body1' className='cmnSmallTitle'>
                  {walnutEyebrow}
                </Typography>
                <Typography variant='h2'>
                  {walnutHeading}
                </Typography>
                <Typography variant='body1'>
                  {walnutDescription}
                </Typography>
                <Box className='bullet_list'>
                  {walnutBullets.map((bullet, idx) => (
                    <Box className='bullet_item' key={idx}>
                      <CheckCircleOutlineRoundedIcon />
                      <Typography variant='subtitle2' component='span'>
                        {bullet}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className='detail_imgBox'>
                <Image
                  src={walnutImage}
                  alt={walnutHeading}
                  width={800}
                  height={800}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Row 2: Almonds (Image Left, Text Right) */}
          <Grid container spacing={{ xs: 4, md: 6, lg: 10 }} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className='detail_imgBox'>
                <Image
                  src={almondImage}
                  alt={almondHeading}
                  width={800}
                  height={800}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className='detail_content'>
                <Typography variant='body1' className='cmnSmallTitle'>
                  {almondEyebrow}
                </Typography>
                <Typography variant='h2'>
                  {almondHeading}
                </Typography>
                <Typography variant='body1'>
                  {almondDescription}
                </Typography>
                <Box className='bullet_list'>
                  {almondBullets.map((bullet, idx) => (
                    <Box className='bullet_item' key={idx}>
                      <CheckCircleOutlineRoundedIcon />
                      <Typography variant='subtitle2' component='span'>
                        {bullet}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>

        </Box>
      </Container>
    </ProductDetailsSectionWrapper>
  );
}
