'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useContentModule } from '@/hooks/useContent';
import { QuoteSectionSkeleton } from '../Loader/SectionSkeletons';

interface QuoteSectionProps {
  data?: {
    quote?: string;
    author?: string;
    showSection?: boolean;
  };
}

export default function QuoteSection({ data }: QuoteSectionProps) {
  const { data: moduleData, isLoading } = useContentModule("about-us");

  if (isLoading && !data) return <QuoteSectionSkeleton />;

  let quote = "Nature doesn't rush, yet everything is accomplished. We've learned that by respecting the clock of the seasons, we achieve a quality that technology simply cannot replicate.";
  let author = "— ALBERT CHEN, CHIEF FIELD WARDEN";
  let showSection = true;

  if (data) {
    if (data.showSection === false) return null;
    quote = data.quote || quote;
    author = data.author || author;
  } else {
    const quoteRecord = moduleData?.records?.find(r => r.id === "about-quote");
    const showSectionField = quoteRecord?.fields?.find(f => f.id === "showSection");
    showSection = showSectionField ? showSectionField.value !== false : true;
    if (!showSection) return null;

    const getFieldValue = (fieldId: string, defaultValue: string): string => {
      const field = quoteRecord?.fields?.find(f => f.id === fieldId);
      return field && typeof field.value === "string" ? field.value : defaultValue;
    };

    quote = getFieldValue("quote", quote);
    author = getFieldValue("author", author);
  }

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
