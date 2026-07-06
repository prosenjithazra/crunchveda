"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";

import { assets } from "@/json/assest";
import { HomeBannerWrapper } from "@/styles/StyledComponents/HomeBannerWrapper";
import { useHomeSection } from "@/hooks/useContent";
import { HomeBannerSkeleton } from "../Loader/SectionSkeletons";

export default function HomeBanner() {
  const { data: sectionData, isLoading } = useHomeSection("hero");
  
  if (isLoading) return <HomeBannerSkeleton />;

  const showSection = sectionData?.content?.showSection ?? true;
  if (!showSection) return null;

  const eyebrow = sectionData?.content?.bannerSubTitle || sectionData?.content?.eyebrow || "CRAFTING AGRICULTURAL EXCELLENCE";
  const headline = sectionData?.content?.bannerTitle || sectionData?.content?.headline || "Premium Dry Fruits Delivered Fresh";
  const description = sectionData?.content?.bannerDescription || sectionData?.content?.description || "Experience the pinnacle of nutrition with our hand- picked selection of gourmet dry fruits, sourced directly from the finest organic orchards across the globe.";
  const primaryCtaLabel = sectionData?.content?.primaryCtaLabel || "Explore Collection";
  const primaryCtaHref = sectionData?.content?.primaryCtaHref || "/products";
  const image = (sectionData?.content?.bannerImage || sectionData?.content?.image || assets.homeBannerImg).replace(/%22$/, "").replace(/"$/, "");
  const bannerVideo = (sectionData?.content?.bannerVideo || "").trim().replace(/%22$/, "").replace(/"$/, "");

  return (
    <HomeBannerWrapper>
      {bannerVideo ? (
        <video
          src={bannerVideo}
          autoPlay
          loop
          muted
          playsInline
          className="bannerImg"
          style={{ pointerEvents: "none" }}
        />
      ) : (
        <Image
          src={image}
          alt={headline}
          title={headline}
          width={8000}
          height={6000}
          className="bannerImg"
          priority
        />
      )}
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
