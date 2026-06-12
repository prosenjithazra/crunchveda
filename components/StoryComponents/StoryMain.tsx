'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { toast } from 'react-hot-toast';

import { assets } from '@/json/assest';
import { StoryWrapper } from '@/styles/StyledComponents/StoryWrapper';

export default function StoryMain() {
  const handleButtonClick = (actionName: string) => {
    toast.success(`Navigating to: ${actionName}`);
  };

  return (
    <StoryWrapper>
      
      {/* 1. Hero Banner Section */}
      <Box className="story_hero">
        <Box className="hero_bg">
          <Image 
            src={assets.storyHeroBg} 
            alt="Ancient Heritage Oak Tree" 
            fill 
            priority
            sizes="100vw"
          />
        </Box>
        <Box className="hero_overlay" />
        <Box className="hero_content">
          <Typography className="hero_subtitle">Our Heritage</Typography>
          <Typography variant="h1">
            Cultivating the Legacy<br />of Artisanal Earth
          </Typography>
          <Typography>
            Beyond standard agriculture, we are a family-held steward of the land, preserving the patient wisdom of nature.
          </Typography>
          <Button
            variant="contained"
            color="info"
            disableRipple
            onClick={() => {
              const element = document.getElementById('legacy-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              } else {
                handleButtonClick("The Beginning");
              }
            }}
          >
            Discover The Promise
          </Button>
        </Box>
      </Box>

      {/* 2. The Beginning Section */}
      <Box id="legacy-section" className="legacy_section">
        <Container fixed>
          <Grid container spacing={{ xs: 4, md: 8 }} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography className="legacy_subtitle">The Beginning</Typography>
              <Typography variant="h2">The Legacy of Soil and Spirit</Typography>
              <Typography>
                Our story began in 1924, on a small patch of untouched soil that whispered of potential. Founder Elias and Martha Nutri saw not just a farm, but a living ecosystem that demanded respect rather than dominance.
              </Typography>
              <Typography>
                Today, NutriHarvest stands as a beacon of high-end agricultural craft. We treat each harvest as a masterpiece, ensuring that the honor is preserved for the generations to come. It is an editorial journey from seed to table, curated with meticulous attention to detail.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className="legacy_image_box">
                <Image 
                  src={assets.storyLegacySoil} 
                  alt="Hands holding organic soil" 
                  fill
                  sizes="(max-width: 900px) 100vw, 45vw"
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 3. Minimal Intervention Philosophy Section */}
      <Box className="philosophy_section">
        <Container fixed>
          <Box className="philosophy_header">
            <Typography variant="h2">Minimal Intervention Philosophy</Typography>
            <Typography>
              We believe the finest produce is born from where the human hand is lightest, guiding nature without forcing it.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Column 1: Biodynamic Balance */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box className="philosophy_card">
                <Box className="card_icon_box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </Box>
                <Typography variant="h3">Biodynamic Balance</Typography>
                <Typography>
                  Aligning our harvests close with celestial cycles to ensure the highest potential energy and energetic purity.
                </Typography>
              </Box>
            </Grid>

            {/* Column 2: Pure Sourcing */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box className="philosophy_card">
                <Box className="card_icon_box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </Box>
                <Typography variant="h3">Pure Sourcing</Typography>
                <Typography>
                  Only 2% of global harvests meet our criteria for soil cleanliness, mineral depth, and certified pure origin.
                </Typography>
              </Box>
            </Grid>

            {/* Column 3: Artisanal Curation */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box className="philosophy_card">
                <Box className="card_icon_box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </Box>
                <Typography variant="h3">Artisanal Curation</Typography>
                <Typography>
                  Every batch is hand-inspected, air-cured slowly, and packed in protective glass to preserve the sensory richness that NutriHarvest is famous for.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 4. A Century of Stewardship Timeline Section */}
      <Box className="timeline_section">
        <Container fixed>
          <Box className="timeline_header">
            <Typography variant="h2">A Century of Stewardship</Typography>
          </Box>

          <Box className="timeline_container">
            {/* Timeline Item 1: 1924 */}
            <Box className="timeline_item">
              <Box className="timeline_node" />
              <Box className="timeline_content_col">
                <Typography className="timeline_year">1924</Typography>
                <Typography variant="h3" className="timeline_title">The Founding Soil</Typography>
                <Typography className="timeline_desc">
                  The first 40 acres are purchased in the fertile valleys of Oregon, marking the inception of a dedicated agricultural lineage.
                </Typography>
              </Box>
              <Box className="timeline_image_col">
                <Box className="timeline_img_box">
                  <Image 
                    src={assets.storyTimeline1924} 
                    alt="Vintage Orchard Rows in 1924" 
                    fill
                    sizes="(max-width: 900px) 100vw, 40vw"
                  />
                </Box>
              </Box>
            </Box>

            {/* Timeline Item 2: 1968 */}
            <Box className="timeline_item">
              <Box className="timeline_node" />
              <Box className="timeline_content_col">
                <Typography className="timeline_year">1968</Typography>
                <Typography variant="h3" className="timeline_title">Organic Pioneer</Typography>
                <Typography className="timeline_desc">
                  NutriHarvest becomes one of the first certified organic estates in the region, introducing natural balance and compost enrichment techniques.
                </Typography>
              </Box>
              <Box className="timeline_image_col">
                <Box className="timeline_img_box">
                  <Image 
                    src={assets.storyTimeline1968} 
                    alt="Sunlit organic fields in 1968" 
                    fill
                    sizes="(max-width: 900px) 100vw, 40vw"
                  />
                </Box>
              </Box>
            </Box>

            {/* Timeline Item 3: 2024 */}
            <Box className="timeline_item">
              <Box className="timeline_node" />
              <Box className="timeline_content_col">
                <Typography className="timeline_year">2024</Typography>
                <Typography variant="h3" className="timeline_title">The Global Standard</Typography>
                <Typography className="timeline_desc">
                  Actively today, we continue to redefine the standards of agricultural efficacy, combining artisanal precision with ecological stewardship.
                </Typography>
              </Box>
              <Box className="timeline_image_col">
                <Box className="timeline_img_box">
                  <Image 
                    src={assets.storyTimeline2024} 
                    alt="Modern high-end greenhouses in 2024" 
                    fill
                    sizes="(max-width: 900px) 100vw, 40vw"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 5. Taste the Provenance CTA Card */}
      <Container fixed>
        <Box className="provenance_banner">
          <Box className="provenance_content">
            <Typography variant="h2">Taste the Provenance</Typography>
            <Typography>
              Experience the culmination of our century-long journey through our curated seasonal collections.
            </Typography>
            <Box className="btn_group">
              <Button
                variant="contained"
                color="primary"
                disableRipple
                component={Link}
                href="/categories"
              >
                Explore Collections
              </Button>
              <Button
                variant="contained"
                color="info"
                disableRipple
                component={Link}
                href="/about-us"
              >
                Our Sustainability Promise
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

    </StoryWrapper>
  );
}
