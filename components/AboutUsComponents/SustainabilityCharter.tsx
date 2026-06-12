import React from 'react';
import Link from 'next/link';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import DropletIcon from '@/ui/Icons/DropletIcon';
import SolarIcon from '@/ui/Icons/SolarIcon';
import SoilShieldIcon from '@/ui/Icons/SoilShieldIcon';
import RibbonBadgeIcon from '@/ui/Icons/RibbonBadgeIcon';

const charters = [
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
  return (
    <Box className="charter_section section_pad">
      <Container fixed>
        {/* Header with Title and Button */}
        <Box className="charter_header">
          <Box className="header_text">
            <Typography variant="h2" className="section_title_large" sx={{ mb: 1 }}>
              The Sustainability Charter
            </Typography>
            <Typography variant="body1" className="body_desc" sx={{ mb: 0 }}>
              Our commitment to the future is deeply etched in our soil. We operate on principles of regenerative abundance.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="info"
            disableRipple
            component={Link}
            href="#report"
          >
            Read Our Full Report
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
