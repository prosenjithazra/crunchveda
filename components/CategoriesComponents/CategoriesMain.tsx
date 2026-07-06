/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Grid, Typography, Button, CircularProgress } from '@mui/material';

import { assets } from '@/json/assest';
import { CategoriesMainWrapper } from '@/styles/StyledComponents/CategoriesMainWrapper';
import DiscoverArrowIcon from '@/ui/Icons/DiscoverArrowIcon';
import EthicalIcon from '@/ui/Icons/EthicalIcon';
import CertifiedOrganicIcon from '@/ui/Icons/CertifiedOrganicIcon';
import GlobalExcellenceIcon from '@/ui/Icons/GlobalExcellenceIcon';
import { useCategories } from '@/hooks/useProducts';

export default function CategoriesMain() {
  const { data: categoriesData, isLoading } = useCategories();
  const categories = Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : ((categoriesData?.data as any)?.categories || []);

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
          {isLoading ? (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress color="primary" />
              </Box>
            </Grid>
          ) : categories.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 8 }}>
                No categories found in the database.
              </Typography>
            </Grid>
          ) : (
            categories.map((cat: any, idx: number) => {
              let mdSize = 6;
              let cardClass = "medium_card";
              if (idx % 4 === 0) {
                mdSize = 7.5;
                cardClass = "tall_card";
              } else if (idx % 4 === 1) {
                mdSize = 4.5;
                cardClass = "tall_card";
              }

              return (
                <Grid size={{ xs: 12, md: mdSize }} key={cat._id}>
                  <Link href={`/products?category=${encodeURIComponent(cat.name)}`} className={`category_card ${cardClass}`}>
                    {idx === 0 && <Box className="card_badge">Signature Selection</Box>}
                    <Box className="card_bg">
                      <Image
                        src={cat.image || assets.dates}
                        alt={cat.name}
                        fill
                        sizes={mdSize === 7.5 ? "(max-width: 900px) 100vw, 65vw" : mdSize === 4.5 ? "(max-width: 900px) 100vw, 35vw" : "(max-width: 900px) 100vw, 50vw"}
                      />
                    </Box>
                    <Box className="overlay" />
                    <Box className="card_content">
                      <Typography variant="h2">{cat.name}</Typography>
                      <Typography variant="body2">
                        {cat.description}
                      </Typography>
                      <Box className="discover_link">
                        Discover <DiscoverArrowIcon />
                      </Box>
                    </Box>
                  </Link>
                </Grid>
              );
            })
          )}

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
                  href="/products?category=gifting"
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
