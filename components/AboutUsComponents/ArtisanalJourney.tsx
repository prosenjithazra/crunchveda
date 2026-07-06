'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Container, Grid, Typography } from '@mui/material';
import { assets } from '@/json/assest';
import { useContentModule } from '@/hooks/useContent';
import { ArtisanalJourneySkeleton } from '../Loader/SectionSkeletons';

const defaultSteps = [
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

interface ArtisanalJourneyProps {
  data?: {
    eyebrow?: string;
    heading?: string;
    steps?: string;
    imageSet?: string;
    showSection?: boolean;
  };
}

export default function ArtisanalJourney({ data }: ArtisanalJourneyProps) {
  const { data: moduleData, isLoading } = useContentModule("about-us");

  if (isLoading && !data) return <ArtisanalJourneySkeleton />;

  let eyebrow = "Our Process";
  let heading = "The Artisanal Journey";
  let stepsRaw = "";
  let imageSetRaw = "";
  let showSection = true;

  if (data) {
    if (data.showSection === false) return null;
    eyebrow = data.eyebrow || eyebrow;
    heading = data.heading || heading;
    stepsRaw = data.steps || "";
    imageSetRaw = data.imageSet || "";
  } else {
    const journeyRecord = moduleData?.records?.find(r => r.id === "about-journey");
    const showSectionField = journeyRecord?.fields?.find(f => f.id === "showSection");
    showSection = showSectionField ? showSectionField.value !== false : true;
    if (!showSection) return null;

    const getFieldValue = (fieldId: string, defaultValue: string): string => {
      const field = journeyRecord?.fields?.find(f => f.id === fieldId);
      return field && typeof field.value === "string" ? field.value : defaultValue;
    };

    eyebrow = getFieldValue("eyebrow", eyebrow);
    heading = getFieldValue("heading", heading);
    stepsRaw = getFieldValue("steps", "");
    imageSetRaw = getFieldValue("imageSet", "");
  }

  let steps: Array<{ title: string; description: string; image: string }> = defaultSteps;
  if (stepsRaw && stepsRaw.trim()) {
    const lines = stepsRaw.split("\n").filter(Boolean);
    const images = imageSetRaw ? imageSetRaw.split("\n").filter(Boolean) : [];
    steps = lines.map((line, idx) => {
      const parts = line.split("|");
      return {
        title: parts[0]?.trim() || "",
        description: parts[1]?.trim() || "",
        image: images[idx]?.trim() || defaultSteps[idx]?.image || assets.seedHeritage
      };
    });
  }

  return (
    <Box className="artisanal_journey section_pad">
      <Container fixed>
        <Box className="title_box">
          <Typography variant="h6" className="section_title_small">
            {eyebrow}
          </Typography>
          <Typography variant="h2" className="section_title_large">
            {heading}
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
