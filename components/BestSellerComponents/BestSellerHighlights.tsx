import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { BestSellerHighlightsWrapper } from '@/styles/StyledComponents/BestSellerHighlightsWrapper';

export default function BestSellerHighlights() {
  return (
    <BestSellerHighlightsWrapper>
      <Container fixed>
        <Grid container spacing={4}>
          {/* Highlight 1: Certified Organic */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box className="highlight_col">
              <Box className="icon_box">
                <VerifiedUserOutlinedIcon />
              </Box>
              <Typography variant="h4" className="highlight_title">
                Certified Organic
              </Typography>
              <Typography className="highlight_desc">
                Rigorous third-party certification for every product in our catalog.
              </Typography>
            </Box>
          </Grid>

          {/* Highlight 2: Estate Harvested */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box className="highlight_col">
              <Box className="icon_box">
                <HomeOutlinedIcon />
              </Box>
              <Typography variant="h4" className="highlight_title">
                Estate Harvested
              </Typography>
              <Typography className="highlight_desc">
                Sourced directly from family-owned estates with multi-generational legacy.
              </Typography>
            </Box>
          </Grid>

          {/* Highlight 3: Climate-Neutral Delivery */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box className="highlight_col">
              <Box className="icon_box">
                <PublicOutlinedIcon />
              </Box>
              <Typography variant="h4" className="highlight_title">
                Climate-Neutral Delivery
              </Typography>
              <Typography className="highlight_desc">
                100% plastic-free packaging and carbon-offset shipping globally.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </BestSellerHighlightsWrapper>
  );
}
