'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import DropletIcon from '@/ui/Icons/DropletIcon';
import SolarIcon from '@/ui/Icons/SolarIcon';
import SoilShieldIcon from '@/ui/Icons/SoilShieldIcon';
import RibbonBadgeIcon from '@/ui/Icons/RibbonBadgeIcon';
import { useContentModule } from '@/hooks/useContent';
import { SustainabilityCharterSkeleton } from '../Loader/SectionSkeletons';

const defaultCharters = [
  {
    title: "Water Safety",
    description: "Closed-loop irrigation systems that reduce water by 45 percent.",
    icon: <DropletIcon />
  },
  {
    title: "CO2 Reduction",
    description: "Solar-driven greenhouses and active low-emission transportation.",
    icon: <SolarIcon />
  },
  {
    title: "Soil Security",
    description: "No synthetic chemicals, preserving natural biodiversity.",
    icon: <SoilShieldIcon />
  },
  {
    title: "Organic Grades",
    description: "Rigorous testing protocols for all farm operations.",
    icon: <RibbonBadgeIcon />
  }
];

export default function SustainabilityCharter() {
  const { data: moduleData, isLoading } = useContentModule("about-us");
  if (isLoading) return <SustainabilityCharterSkeleton />;

  const charterRecord = moduleData?.records?.find(r => r.id === "about-charter");
  const showSectionField = charterRecord?.fields?.find(f => f.id === "showSection");
  const showSection = showSectionField ? showSectionField.value !== false : true;
  if (!showSection) return null;

  const getFieldValue = (fieldId: string, defaultValue: string): string => {
    const field = charterRecord?.fields?.find(f => f.id === fieldId);
    return field && typeof field.value === "string" ? field.value : defaultValue;
  };

  const heading = getFieldValue("heading", "The Sustainability Charter");
  const description = getFieldValue("description", "Our commitment to the future is deeply etched in our soil. We operate on principles of regenerative abundance.");
  const reportLabel = getFieldValue("reportLabel", "Read Our Full Report");
  const reportHref = getFieldValue("reportHref", "#report");
  const chartersRaw = getFieldValue("charters", "");

  let charters = defaultCharters;
  if (chartersRaw && chartersRaw.trim()) {
    const lines = chartersRaw.split("\n").filter(Boolean);
    charters = lines.map((line, idx) => {
      const parts = line.split("|");
      const title = parts[0]?.trim() || "";
      const description = parts[1]?.trim() || "";

      let icon = <DropletIcon />;
      if (idx === 1) {
        icon = <SolarIcon />;
      } else if (idx === 2) {
        icon = <SoilShieldIcon />;
      } else if (idx === 3) {
        icon = <RibbonBadgeIcon />;
      }

      return { title, description, icon };
    });
  }

  return (
    <Box className="charter_section section_pad">
      <Container fixed>
        {/* Header with Title and Button */}
        <Box className="charter_header">
          <Box className="header_text">
            <Typography variant="h2" className="section_title_large" sx={{ mb: 1 }}>
              {heading}
            </Typography>
            <Typography variant="body1" className="body_desc" sx={{ mb: 0 }}>
              {description}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="info"
            disableRipple
            component={Link}
            href={reportHref}
          >
            {reportLabel}
          </Button>
        </Box>

        {/* 4 Cards Grid */}
        <Grid container spacing={3}>
          {charters.map((charter, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Box className="charter_card">
                <Box className="card_icon_box">
                  {charter.icon}
                </Box>
                <Typography variant="h4">{charter.title}</Typography>
                <Typography variant="body2">{charter.description}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
