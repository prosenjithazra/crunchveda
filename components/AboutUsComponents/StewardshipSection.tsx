import React from 'react';
import Image from 'next/image';
import { Box, Container, Grid, Typography } from '@mui/material';
import { assets } from '@/json/assest';

export default function StewardshipSection() {
  return (
    <Box className="section_pad">
      <Container fixed>
        <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} sx={{ alignItems: 'center' }} className="stewardship_row">
          {/* Left Narrative Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" className="section_title_small">
              Our Roots
            </Typography>
            <Typography variant="h2" className="section_title_large">
              A Century of Stewardship
            </Typography>
            <Typography variant="body1" className="body_desc">
              For over three generations, the Nur Harvest estate has stood as a beacon of organic excellence. 
              Our journey began with a simple promise: to honor the land and craft purity. We believe that 
              true luxury lies in the purity of the source and the patience of the process.
            </Typography>
            <Box className="stewardship_quote">
              <Typography variant="body1">
                &ldquo;This is not merely land; it is a trust we hold for those who will follow. 
                Every seed we sow and every harvest we press carries the warmth of the story we write here.&rdquo;
              </Typography>
            </Box>
          </Grid>

          {/* Right Image Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="stewardship_imgBox">
              <Image
                src={assets.stewardshipFarmer}
                alt="Our Stewardship Farmer"
                width={600}
                height={600}
                className="farmer_img"
                priority
              />
              <Box className="floating_badge">
                <Box className="badge_num">100+</Box>
                <Box className="badge_txt">Years of Tradition</Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
