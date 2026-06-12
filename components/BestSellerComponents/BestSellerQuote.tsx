import React from 'react';
import Image from 'next/image';
import { Box, Container, Typography } from '@mui/material';
import { assets } from '@/json/assest';
import { BestSellerQuoteWrapper } from '@/styles/StyledComponents/BestSellerQuoteWrapper';

export default function BestSellerQuote() {
  return (
    <BestSellerQuoteWrapper>
      <Container fixed>
        <Box className="quote_split_banner">
          {/* Left Side: Quote text */}
          <Box className="left_quote_content">
            <Typography variant="h2">The Art of the Harvest</Typography>
            <Typography className="quote_desc">
              &ldquo;Nature is the greatest artist; we are merely the curators of its most profound expressions. Our philosophy is rooted in patience &mdash; waiting for the precise moment when flavor, nutrition, and texture align in perfect harmony.&rdquo;
            </Typography>
            <Typography className="quote_author">
              &mdash; Julian Vanhoutte, Founder
            </Typography>
          </Box>
          
          {/* Right Side: Orchard Grove Image */}
          <Box className="right_quote_imgBox">
            <Image
              src={assets.bestSellerOrchard}
              alt="Sunlit olive grove orchard rows"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </Box>
        </Box>
      </Container>
    </BestSellerQuoteWrapper>
  );
}
