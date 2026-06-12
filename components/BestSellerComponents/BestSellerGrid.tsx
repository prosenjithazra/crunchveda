import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Grid, Typography } from '@mui/material';
import { assets } from '@/json/assest';
import { BestSellerGridWrapper } from '@/styles/StyledComponents/BestSellerGridWrapper';

export default function BestSellerGrid() {
  return (
    <BestSellerGridWrapper>
      <Container fixed>
        {/* Collection Header */}
        <Box className="collection_header">
          <Typography variant="h2">The Collection</Typography>
          <Link href="/categories" className="shop_link">
            View All Shop
          </Link>
        </Box>

        {/* Product Cards Grid */}
        <Grid container spacing={4}>
          {/* Card 1: Raw Forest Honey */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box component={Link} href="/product/raw-forest-honey" className="collection_card">
              <Box className="card_imgBox">
                <Image
                  src={assets.honey}
                  alt="Raw Forest Honey Jar"
                  fill
                  sizes="(max-width: 900px) 100vw, 30vw"
                />
                <Box className="limited_badge">Limited Batch</Box>
              </Box>
              <Box className="card_details">
                <Box className="title_row">
                  <Typography variant="h3">Raw Forest Honey</Typography>
                  <Typography className="price">$45.00</Typography>
                </Box>
                <Typography className="sub_label">Acacia &amp; Tupelo | 500g</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Card 2: Artisanal Walnuts */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box component={Link} href="/product/artisanal-walnuts" className="collection_card">
              <Box className="card_imgBox">
                <Image
                  src={assets.bestSellerWalnut}
                  alt="Artisanal shelled walnuts close-up"
                  fill
                  sizes="(max-width: 900px) 100vw, 30vw"
                />
              </Box>
              <Box className="card_details">
                <Box className="title_row">
                  <Typography variant="h3">Artisanal Walnuts</Typography>
                  <Typography className="price">$28.00</Typography>
                </Box>
                <Typography className="sub_label">Shelled | 750g</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Card 3: Exotic Fruit Mix */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box component={Link} href="/product/exotic-fruit-mix" className="collection_card">
              <Box className="card_imgBox">
                <Image
                  src={assets.bestSellerFruit}
                  alt="Dried Exotic Fruit Mix"
                  fill
                  sizes="(max-width: 900px) 100vw, 30vw"
                />
              </Box>
              <Box className="card_details">
                <Box className="title_row">
                  <Typography variant="h3">Exotic Fruit Mix</Typography>
                  <Typography className="price">$34.00</Typography>
                </Box>
                <Typography className="sub_label">Dehydrated | 400g</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </BestSellerGridWrapper>
  );
}
