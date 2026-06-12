'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Container, Grid, Typography } from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

import { assets } from '@/json/assest';
import { ProductDetailsSectionWrapper } from '@/styles/StyledComponents/ProductDetailsSectionWrapper';

export default function ProductDetailsSection() {
  return (
    <ProductDetailsSectionWrapper>
      <Container fixed>
        <Box className='details_container'>

          {/* Row 1: Walnuts (Text Left, Image Right) */}
          <Grid container spacing={{ xs: 4, md: 6, lg: 10 }} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className='detail_content'>
                <Typography variant='body1' className='cmnSmallTitle'>
                  NATURAL SUPERFOOD
                </Typography>
                <Typography variant='h2'>
                  The Brain-Boosting Power of Walnuts
                </Typography>
                <Typography variant='body1'>
                  Rich in omega-3 fatty acids and antioxidants, our Chilean walnuts are more
                  than just a snack. They are essential fuel for cognitive health and heart
                  vitality.
                </Typography>
                <Box className='bullet_list'>
                  <Box className='bullet_item'>
                    <CheckCircleOutlineRoundedIcon />
                    <Typography variant='subtitle2' component='span'>
                      High in Omega-3 DHA
                    </Typography>
                  </Box>
                  <Box className='bullet_item'>
                    <CheckCircleOutlineRoundedIcon />
                    <Typography variant='subtitle2' component='span'>
                      Supports Heart Health
                    </Typography>
                  </Box>
                  <Box className='bullet_item'>
                    <CheckCircleOutlineRoundedIcon />
                    <Typography variant='subtitle2' component='span'>
                      Natural Energy Booster
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className='detail_imgBox'>
                <Image
                  src={assets.walnutDetail}
                  alt="Walnuts abstract shell details"
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
                  src={assets.almondDetail}
                  alt="Almonds milk splash detail"
                  width={800}
                  height={800}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className='detail_content'>
                <Typography variant='body1' className='cmnSmallTitle'>
                  IMMUNE SUPPORT
                </Typography>
                <Typography variant='h2'>
                  Almonds: Nature&apos;s Daily Multi-Vitamin
                </Typography>
                <Typography variant='body1'>
                  Packed with Vitamin E, magnesium, and protein, our California almonds help
                  maintain healthy skin and a robust immune system with every crunch.
                </Typography>
                <Box className='bullet_list'>
                  <Box className='bullet_item'>
                    <CheckCircleOutlineRoundedIcon />
                    <Typography variant='subtitle2' component='span'>
                      Rich in Vitamin E
                    </Typography>
                  </Box>
                  <Box className='bullet_item'>
                    <CheckCircleOutlineRoundedIcon />
                    <Typography variant='subtitle2' component='span'>
                      High Fiber Content
                    </Typography>
                  </Box>
                  <Box className='bullet_item'>
                    <CheckCircleOutlineRoundedIcon />
                    <Typography variant='subtitle2' component='span'>
                      Promotes Skin Health
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

        </Box>
      </Container>
    </ProductDetailsSectionWrapper>
  );
}
