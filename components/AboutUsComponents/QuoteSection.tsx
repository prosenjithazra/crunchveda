import React from 'react';
import { Box, Container, Typography } from '@mui/material';

export default function QuoteSection() {
  return (
    <Box className="quote_banner">
      <Container fixed>
        <Typography component="span" className="quote_symbol">
          &ldquo;
        </Typography>
        <Typography variant="h2">
          Nature doesn&apos;t rush, yet everything is accomplished. We&apos;ve learned that by 
          respecting the clock of the seasons, we achieve a quality that technology simply 
          cannot replicate.
        </Typography>
        <Typography variant="h6" className="quote_author">
          &mdash; ALBERT CHEN, CHIEF FIELD WARDEN
        </Typography>
      </Container>
    </Box>
  );
}
