import React from 'react';
import Image from 'next/image';
import { Box, Container, Grid, Typography } from '@mui/material';
import { assets } from '@/json/assest';
import { ZeroPlasticMandateWrapper } from '@/styles/StyledComponents/ZeroPlasticMandateWrapper';

import { useContentModule } from '@/hooks/useContent';
import { ZeroPlasticMandateSkeleton } from '../Loader/SectionSkeletons';

export default function ZeroPlasticMandate() {
  const { data: moduleData, isLoading } = useContentModule("sustainability");
  if (isLoading) return <ZeroPlasticMandateSkeleton />;

  const record = moduleData?.records?.find(r => r.id === "zero-plastic");
  const showSectionField = record?.fields?.find(f => f.id === "showSection");
  const showSection = showSectionField ? showSectionField.value !== false : true;
  if (!showSection) return null;

  return (
    <ZeroPlasticMandateWrapper>
      <Container fixed>
        {/* Header Block */}
        <Box className="mandate_header">
          <Typography variant="h2">Zero Plastic Mandate</Typography>
          <Typography>
            Every NutriHarvest vessel is designed to respect the environment, using only glass, biodegradable mycelium, and vegetable-inked paper.
          </Typography>
        </Box>

        {/* Card Grid */}
        <Grid container spacing={4}>
          {/* Card 1: Flint Glass Vases */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box className="mandate_card">
              <Box className="card_bg">
                <Image
                  src={assets.sustainabilityGlassJar}
                  alt="Flint Glass Vases Packaging"
                  fill
                  sizes="(max-width: 900px) 100vw, 30vw"
                />
              </Box>
              <Box className="card_overlay" />
              <Box className="card_content">
                <Typography className="card_tag">Infinitely Recyclable</Typography>
                <Typography variant="h3">Flint Glass Vases</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Card 2: Mycelium Buffers */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box className="mandate_card">
              <Box className="card_bg">
                <Image
                  src={assets.sustainabilityMycelium}
                  alt="Mycelium Buffers Packaging"
                  fill
                  sizes="(max-width: 900px) 100vw, 30vw"
                />
              </Box>
              <Box className="card_overlay" />
              <Box className="card_content">
                <Typography className="card_tag">100% Compostable</Typography>
                <Typography variant="h3">Mycelium Buffers</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Card 3: Vegetable Dyes */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box className="mandate_card">
              <Box className="card_bg">
                <Image
                  src={assets.sustainabilityDyes}
                  alt="Vegetable Dyes and Inks"
                  fill
                  sizes="(max-width: 900px) 100vw, 30vw"
                />
              </Box>
              <Box className="card_overlay" />
              <Box className="card_content">
                <Typography className="card_tag">Soy-Based Ink</Typography>
                <Typography variant="h3">Vegetable Dyes</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ZeroPlasticMandateWrapper>
  );
}
