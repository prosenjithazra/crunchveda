'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Grid, Typography, Button } from '@mui/material';

import { assets } from '@/json/assest';
import { CategoriesMainWrapper } from '@/styles/StyledComponents/CategoriesMainWrapper';
import DiscoverArrowIcon from '@/ui/Icons/DiscoverArrowIcon';
import EthicalIcon from '@/ui/Icons/EthicalIcon';
import CertifiedOrganicIcon from '@/ui/Icons/CertifiedOrganicIcon';
import GlobalExcellenceIcon from '@/ui/Icons/GlobalExcellenceIcon';

export default function CategoriesMain() {
  return (
    <CategoriesMainWrapper>
      <Container fixed>
        {/* Title Section */}
        <Box className="title_section">
          <Typography variant="h6" className="subtitle_small">
            The Essence of Earth
          </Typography>
          <Typography variant="h1">
            Curated Collections
          </Typography>
          <Typography variant="body1" className="desc_para">
            Explore our meticulously sourced selection of nature&apos;s most exquisite offerings. 
            From the golden dunes of heritage date palms to the ancient groves of artisanal oils, 
            every harvest tells a story of provenance and passion.
          </Typography>
        </Box>

        {/* Categories Grid */}
        <Grid container spacing={{lg:3, md:2, xs:1.5}} className="grid_container">
          {/* Row 1: Premium Dates & Exotic Nuts */}
          <Grid size={{ xs: 12, md: 7.5 }}>
            <Link href="/product?category=dates" className="category_card tall_card">
              <Box className="card_badge">Signature Selection</Box>
              <Box className="card_bg">
                <Image
                  src={assets.dates}
                  alt="Premium Dates"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 65vw"
                />
              </Box>
              <Box className="overlay" />
              <Box className="card_content">
                <Typography variant="h2">Premium Dates</Typography>
                <Typography variant="body2">
                  Heritage varieties hand-plucked from the sun-drenched oases of the Middle East.
                </Typography>
                <Box className="discover_link">
                  Discover <DiscoverArrowIcon />
                </Box>
              </Box>
            </Link>
          </Grid>

          <Grid size={{ xs: 12, md: 4.5 }}>
            <Link href="/product?category=nuts" className="category_card tall_card">
              <Box className="card_bg">
                <Image
                  src={assets.exoticNuts}
                  alt="Exotic Nuts"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 35vw"
                />
              </Box>
              <Box className="overlay" />
              <Box className="card_content">
                <Typography variant="h2">Exotic Nuts</Typography>
                <Typography variant="body2">
                  Sustainably sourced, slow-roasted perfection.
                </Typography>
                <Box className="discover_link">
                  Discover <DiscoverArrowIcon />
                </Box>
              </Box>
            </Link>
          </Grid>

          {/* Row 2: Ancient Grains & Artisanal Oils */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Link href="/product?category=grains" className="category_card medium_card">
              <Box className="card_bg">
                <Image
                  src={assets.ancientGrains}
                  alt="Ancient Grains"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </Box>
              <Box className="overlay" />
              <Box className="card_content">
                <Typography variant="h2">Ancient Grains</Typography>
                <Typography variant="body2">
                  Heirloom grains from untouched soils.
                </Typography>
                <Box className="discover_link">
                  Discover <DiscoverArrowIcon />
                </Box>
              </Box>
            </Link>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Link href="/product?category=oils" className="category_card medium_card">
              <Box className="card_bg">
                <Image
                  src={assets.oliveOil}
                  alt="Artisanal Oils"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </Box>
              <Box className="overlay" />
              <Box className="card_content">
                <Typography variant="h2">Artisanal Oils</Typography>
                <Typography variant="body2">
                  Cold-pressed liquid gold for the discerning palate.
                </Typography>
                <Box className="discover_link">
                  Discover <DiscoverArrowIcon />
                </Box>
              </Box>
            </Link>
          </Grid>

          {/* Row 3: Artisanal Gifting */}
          <Grid size={{ xs: 12 }}>
            <Box className="category_card banner_card">
              <Box className="card_bg">
                <Image
                  src={assets.artisanalGifting}
                  alt="Artisanal Gifting"
                  fill
                  sizes="100vw"
                />
              </Box>
              <Box className="overlay banner_overlay" />
              <Box className="banner_content">
                <Typography variant="h6" sx={{ color: 'warning.light', letterSpacing: '2px', textTransform: 'uppercase', mb: 1, fontWeight: 600 }}>
                  NEW IN EARTH
                </Typography>
                <Box className="banner_badge">
                  Perfect for Gifting
                </Box>
                <Typography variant="h2">Artisanal Gifting</Typography>
                <Typography variant="body1">
                  Thoughtfully curated hampers that celebrate the art of giving and the bounty of nature.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  disableRipple
                  component={Link}
                  href="/product?category=gifting"
                >
                  Explore Gift Sets
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Features Row */}
        <Box className="features_banner">
          <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box className="feature_col">
                <Box className="icon_wrapper">
                  <EthicalIcon />
                </Box>
                <Typography variant="h3">Ethically Sourced</Typography>
                <Typography variant="body2">
                  Working directly with small-scale farmers to ensure fair practices and superior quality.
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box className="feature_col">
                <Box className="icon_wrapper">
                  <CertifiedOrganicIcon />
                </Box>
                <Typography variant="h3">Certified Organic</Typography>
                <Typography variant="body2">
                  Every product is tested for purity and maintains the highest organic certifications.
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box className="feature_col">
                <Box className="icon_wrapper">
                  <GlobalExcellenceIcon />
                </Box>
                <Typography variant="h3">Global Excellence</Typography>
                <Typography variant="body2">
                  Premium logistics ensuring the freshness of our harvest from our soil to your doorstep.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CategoriesMainWrapper>
  );
}
