'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useContentModule } from '@/hooks/useContent';
import { QuoteSectionSkeleton } from '../Loader/SectionSkeletons';

export default function QuoteSection() {
  const { data: moduleData, isLoading } = useContentModule("about-us");
  if (isLoading) return <QuoteSectionSkeleton />;

  const quoteRecord = moduleData?.records?.find(r => r.id === "about-quote");

  const getFieldValue = (fieldId: string, defaultValue: string): string => {
    const field = quoteRecord?.fields?.find(f => f.id === fieldId);
    return field && typeof field.value === "string" ? field.value : defaultValue;
  };

  const quote = getFieldValue("quote", "Nature doesn't rush, yet everything is accomplished. We've learned that by respecting the clock of the seasons, we achieve a quality that technology simply cannot replicate.");
  const author = getFieldValue("author", "— ALBERT CHEN, CHIEF FIELD WARDEN");

  return (
    <Box className="quote_banner">
      <Container fixed>
        <Typography component="span" className="quote_symbol">
          &ldquo;
        </Typography>
        <Typography variant="h2">
          {quote}
        </Typography>
        <Typography variant="h6" className="quote_author">
          {author}
        </Typography>
      </Container>
    </Box>
  );
}
