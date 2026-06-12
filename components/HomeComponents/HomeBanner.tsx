"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";

import { assets } from "@/json/assest";
import { HomeBannerWrapper } from "@/styles/StyledComponents/HomeBannerWrapper";
import { useContentModule } from "@/hooks/useContent";

export default function HomeBanner() {
  const { data: moduleData } = useContentModule("home");
  
  // Find the home-hero record
  const heroRecord = moduleData?.records?.find(r => r.id === "home-hero");
  
  // Extract values with default fallbacks
  const getFieldValue = (fieldId: string, defaultValue: string): string => {
    const field = heroRecord?.fields?.find(f => f.id === fieldId);
    return field && typeof field.value === "string" ? field.value : defaultValue;
  };
  
  const getFieldToggle = (fieldId: string, defaultValue: boolean): boolean => {
    const field = heroRecord?.fields?.find(f => f.id === fieldId);
    return field && typeof field.value === "boolean" ? field.value : defaultValue;
  };

  const showSection = getFieldToggle("showSection", true);
  if (!showSection) return null;

  const eyebrow = getFieldValue("eyebrow", "CRAFTING AGRICULTURAL EXCELLENCE");
  const headline = getFieldValue("headline", "Premium Dry Fruits Delivered Fresh");
  const description = getFieldValue("description", "Experience the pinnacle of nutrition with our hand- picked selection of gourmet dry fruits, sourced directly from the finest organic orchards across the globe.");
  const primaryCtaLabel = getFieldValue("primaryCtaLabel", "Explore Collection");
  const primaryCtaHref = getFieldValue("primaryCtaHref", "/product");
  const image = getFieldValue("image", assets.homeBannerImg);

  return (
    <HomeBannerWrapper>
      <Image
        src={image}
        alt={headline}
        title={headline}
        width={8000}
        height={6000}
        className="bannerImg"
        priority
      />
      <Container fixed>
        <Box className="bannerTxtBoxWrapper">
          <Typography variant="body1" className="cmnSmallTitle">
            {eyebrow}
          </Typography>
          <Typography variant="h1">
            {headline}
          </Typography>
          <Typography variant="body1">
            {description}
          </Typography>
          <Box className="btnWrapper">
            <Button variant="contained" color="primary" disableRipple component={Link} href={primaryCtaHref}>
              {primaryCtaLabel}
            </Button>
          </Box>
        </Box>
      </Container>
    </HomeBannerWrapper>
  );
}
