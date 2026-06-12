import React from 'react';
import Image from 'next/image';
import { Box, Container, Grid, Typography } from '@mui/material';
import { assets } from '@/json/assest';
import { ContactHeroWrapper } from '@/styles/StyledComponents/ContactHeroWrapper';

export default function ContactHero() {
  return (
    <ContactHeroWrapper>
      <Container fixed>
        <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="hero_text_col">
              <Typography variant="h6" className="section_tag">
                Concierge Service
              </Typography>
              <Typography variant="h1" className="section_title_large">
                How may we assist your journey?
              </Typography>
              <Typography variant="body1" className="hero_desc">
                Whether you are seeking a rare harvest or require personalized nutritional guidance, our concierge team is at your disposal.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="hero_imgBox">
              <Image
                src={assets.contactHeroShirt}
                alt="Assistance Journey Shirt"
                width={600}
                height={500}
                priority
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ContactHeroWrapper>
  );
}
