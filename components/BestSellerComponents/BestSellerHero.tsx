import React from 'react';
import Image from 'next/image';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { assets } from '@/json/assest';
import { BestSellerHeroWrapper } from '@/styles/StyledComponents/BestSellerHeroWrapper';

export default function BestSellerHero() {
  const handleAddToHarvest = () => {
    alert('Jumbo Medjool Dates added to your harvest.');
  };

  return (
    <BestSellerHeroWrapper>
      <Container fixed>
        {/* Page Header */}
        <Box className="header_box">
          <Typography className="section_tag">Curated Excellence</Typography>
          <Typography variant="h1" className="section_title_large">The Season&apos;s Finest</Typography>
          <Typography className="hero_desc">
            A limited-batch selection of the Earth&apos;s most exceptional yields. From sun-drenched estates to remote forest canopies, we bring you the pinnacle of artisanal cultivation, meticulously verified for provenance, purity, and peak flavor profile.
          </Typography>
        </Box>

        {/* Highlight Product Row */}
        <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} sx={{ alignItems: 'center' }}>
          {/* Left Column: Dates Image with Badge Overlay */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="dates_imgBox">
              <Image
                src={assets.bestSellerDates}
                alt="Jumbo Medjool Dates Curated Crate"
                width={600}
                height={520}
                priority
              />
              <Box className="badge_overlay">
                <Typography className="badge_tag">Editor&apos;s Choice #01</Typography>
                <Typography variant="h3" className="badge_title">Jumbo Medjool Dates</Typography>
                <Typography className="badge_sub">Premium Grade &bull; 1kg &bull; $32.00</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Provenance Text & Checklist */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="provenance_box">
              <Typography variant="h6" className="section_tag">
                The Provenance
              </Typography>
              <Typography className="hero_desc">
                Harvested from the Jericho Valley, these &ldquo;King of Dates&rdquo; are hand-picked at peak ripeness. Known for their caramel-like sweetness and succulent texture, they represent the gold standard of organic stone fruit.
              </Typography>
              
              <Box className="feature_list">
                <Box className="feature_item">
                  <CheckCircleOutlinedIcon />
                  <Typography variant="caption">Single-Estate Origin</Typography>
                </Box>
                <Box className="feature_item">
                  <CheckCircleOutlinedIcon />
                  <Typography variant="caption">100% Pure Organic</Typography>
                </Box>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                disableRipple
                onClick={handleAddToHarvest}
                endIcon={<ArrowForwardIcon />}
                sx={{width:'auto'}}
              >
                Add To Harvest
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </BestSellerHeroWrapper>
  );
}
