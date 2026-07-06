import React from 'react';
import Image from 'next/image';
import { Box, Container, Grid, Typography } from '@mui/material';
import NatureIcon from '@mui/icons-material/Nature';
import SpaIcon from '@mui/icons-material/Spa';
import { assets } from '@/json/assest';
import { RegenerativeAgricultureWrapper } from '@/styles/StyledComponents/RegenerativeAgricultureWrapper';

import { useContentModule } from '@/hooks/useContent';
import { RegenerativeAgricultureSkeleton } from '../Loader/SectionSkeletons';

export default function RegenerativeAgriculture() {
  const { data: moduleData, isLoading } = useContentModule("sustainability");
  if (isLoading) return <RegenerativeAgricultureSkeleton />;

  const record = moduleData?.records?.find(r => r.id === "regenerative");
  const showSectionField = record?.fields?.find(f => f.id === "showSection");
  const showSection = showSectionField ? showSectionField.value !== false : true;
  if (!showSection) return null;

  return (
    <RegenerativeAgricultureWrapper>
      <Container fixed>
        <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} sx={{ alignItems: 'center' }}>
          {/* Left Columns - Features */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="text_col">
              <Typography variant="h6" className="section_tag">
                Regenerative Practices
              </Typography>
              <Typography variant="h2" className="section_title_large">
                Healing the Planet Through Agriculture
              </Typography>
              
              <Box className="feature_list">
                {/* Feature 1: Living Soils */}
                <Box className="feature_box">
                  <Box className="icon_box">
                    <NatureIcon />
                  </Box>
                  <Box className="feature_text">
                    <Typography variant="h3">Living Soils</Typography>
                    <Typography>
                      Our &ldquo;No-Till&rdquo; philosophy protects the complex fungal networks that store carbon and naturally enrich our nutrient-dense harvests.
                    </Typography>
                  </Box>
                </Box>

                {/* Feature 2: Heritage Seeds */}
                <Box className="feature_box">
                  <Box className="icon_box">
                    <SpaIcon />
                  </Box>
                  <Box className="feature_text">
                    <Typography variant="h3">Heritage Seeds</Typography>
                    <Typography>
                      We exclusively use heirloom, non-GMO, open-pollinated seeds to maintain genetic diversity and resilience for generations to come.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Column - Crop Image */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="crop_imgBox">
              <Image
                src={assets.storyLegacySoil}
                alt="Hands holding organic soil with crops"
                width={600}
                height={600}
                priority
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </RegenerativeAgricultureWrapper>
  );
}
