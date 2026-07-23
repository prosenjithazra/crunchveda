import React from 'react';
import Link from 'next/link';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { ClimateNeutralDeliveryWrapper } from '@/styles/StyledComponents/ClimateNeutralDeliveryWrapper';

import { useContentModule } from '@/hooks/useContent';
import { ClimateNeutralDeliverySkeleton } from '../Loader/SectionSkeletons';

export default function ClimateNeutralDelivery() {
  const { data: moduleData, isLoading } = useContentModule("sustainability");
  if (isLoading) return <ClimateNeutralDeliverySkeleton />;

  const record = moduleData?.records?.find(r => r.id === "climate-delivery");
  const showSectionField = record?.fields?.find(f => f.id === "showSection");
  const showSection = showSectionField ? showSectionField.value !== false : true;
  if (!showSection) return null;

  return (
    <ClimateNeutralDeliveryWrapper>
      <Container fixed>
        <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} sx={{ alignItems: 'center' }}>
          {/* Left Column: Stats Grid */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="stats_col">
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box className="stat_card">
                    <Typography className="stat_num">12k+</Typography>
                    <Typography className="stat_label">Trees Planted</Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 6 }}>
                  <Box className="stat_card">
                    <Typography className="stat_num">100%</Typography>
                    <Typography className="stat_label">Offset</Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box className="stat_card">
                    <Typography className="stat_num">Net Zero</Typography>
                    <Typography className="stat_label">Carbon Footprint</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Column: Narrative & Button */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="narrative_col">
              <Typography variant="h6" className="section_tag">
                Logistics
              </Typography>
              <Typography variant="h2" className="section_title_large">
                Climate Neutral Delivery
              </Typography>
              <Typography className="delivery_desc">
                Our carbon footprint is tracked from farm to gate. All shipments are offset through verified carbon-offset projects.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ClimateNeutralDeliveryWrapper>
  );
}
