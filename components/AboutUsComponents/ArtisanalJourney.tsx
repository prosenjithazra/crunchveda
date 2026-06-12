import React from 'react';
import Image from 'next/image';
import { Box, Container, Grid, Typography } from '@mui/material';
import { assets } from '@/json/assest';

const steps = [
  {
    title: "Seed Heritage",
    description: "The finest seed, hand-selected to reflect archaeological history and botanical purity.",
    image: assets.seedHeritage,
  },
  {
    title: "Mineral Enrichment",
    description: "Curating balanced ecosystem compounds, enriching soil nutrients to capture the natural essence.",
    image: assets.mineralEnrichment,
  },
  {
    title: "Master Curation",
    description: "Only the pinnacle of the harvest is selected, ensuring each jar represents a masterpiece.",
    image: assets.masterCuration,
  }
];

export default function ArtisanalJourney() {
  return (
    <Box className="artisanal_journey section_pad">
      <Container fixed>
        <Box className="title_box">
          <Typography variant="h6" className="section_title_small">
            Our Process
          </Typography>
          <Typography variant="h2" className="section_title_large">
            The Artisanal Journey
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Box className="journey_card">
                <Box className="journey_imgBox">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={400}
                    height={330}
                    sizes="(max-width: 900px) 100vw, 30vw"
                  />
                </Box>
                <Typography variant="h3">{step.title}</Typography>
                <Typography variant="body2">{step.description}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
