'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Container, Grid, Typography, Button, CircularProgress } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { assets } from '@/json/assest';
import { BestSellerHeroWrapper } from '@/styles/StyledComponents/BestSellerHeroWrapper';
import { useBestsellers } from '@/hooks/useProducts';
import { mapApiProductToUi } from '@/services/productService';

export default function BestSellerHero() {
  const { data, isLoading } = useBestsellers();
  const rawProducts = data?.data || [];
  const rawProduct = rawProducts[0];
  const product = rawProduct ? mapApiProductToUi(rawProduct) : null;
  const price = product ? product.sizePrices[product.defaultSize] || 0 : 0;

  const handleAddToHarvest = () => {
    alert(`${product ? product.name : 'Jumbo Medjool Dates'} added to your harvest.`);
  };

  const featureItems = product && product.dietary && product.dietary.length > 0
    ? product.dietary
    : ['Single-Estate Origin', '100% Pure Organic'];

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

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : !product ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No bestseller highlights currently available.
            </Typography>
          </Box>
        ) : (
          /* Highlight Product Row */
          <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} sx={{ alignItems: 'center' }}>
            {/* Left Column: Dates Image with Badge Overlay */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className="dates_imgBox">
                <Image
                  src={product.image || assets.bestSellerDates}
                  alt={product.name}
                  width={600}
                  height={520}
                  priority
                />
                <Box className="badge_overlay">
                  <Typography className="badge_tag">Editor&apos;s Choice #01</Typography>
                  <Typography variant="h3" className="badge_title">{product.name}</Typography>
                  <Typography className="badge_sub">
                    Premium Grade &bull; {product.defaultSize} &bull; ₹{price.toFixed(2)}
                  </Typography>
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
                  {product.description}
                </Typography>
                
                <Box className="feature_list">
                  {featureItems.map((feat) => (
                    <Box className="feature_item" key={feat}>
                      <CheckCircleOutlinedIcon />
                      <Typography variant="caption">{feat}</Typography>
                    </Box>
                  ))}
                </Box>
                
                <Button
                  variant="contained"
                  color="primary"
                  disableRipple
                  onClick={handleAddToHarvest}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ width: 'auto' }}
                >
                  Add To Harvest
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </BestSellerHeroWrapper>
  );
}
