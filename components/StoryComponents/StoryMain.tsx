'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { toast } from 'react-hot-toast';

import { assets } from '@/json/assest';
import { StoryWrapper } from '@/styles/StyledComponents/StoryWrapper';
import { useContentModule } from '@/hooks/useContent';
import { useQuery } from '@tanstack/react-query';
import { HomeBannerSkeleton } from '../Loader/SectionSkeletons';

export default function StoryMain() {
  const { data: moduleData, isLoading: isModuleLoading } = useContentModule("our-story");

  const { data: bannerRes, isLoading: isBannerLoading } = useQuery({
    queryKey: ["our-story-banner"],
    queryFn: async () => {
      const res = await fetch("/api/our-story/banner");
      if (!res.ok) throw new Error("Failed to fetch banner");
      return res.json();
    }
  });

  const { data: beginningRes, isLoading: isBeginningLoading } = useQuery({
    queryKey: ["our-story-beginning"],
    queryFn: async () => {
      const res = await fetch("/api/our-story/the-beginning");
      if (!res.ok) throw new Error("Failed to fetch beginning section");
      return res.json();
    }
  });

  const { data: philosophyRes, isLoading: isPhilosophyLoading } = useQuery({
    queryKey: ["our-story-philosophy"],
    queryFn: async () => {
      const res = await fetch("/api/our-story/philosophy");
      if (!res.ok) throw new Error("Failed to fetch philosophy section");
      return res.json();
    }
  });

  const { data: stewardshipRes, isLoading: isStewardshipLoading } = useQuery({
    queryKey: ["our-story-stewardship"],
    queryFn: async () => {
      const res = await fetch("/api/our-story/stewardship");
      if (!res.ok) throw new Error("Failed to fetch stewardship section");
      return res.json();
    }
  });

  const handleButtonClick = (actionName: string) => {
    toast.success(`Navigating to: ${actionName}`);
  };

  if (isModuleLoading || isBannerLoading || isBeginningLoading || isPhilosophyLoading || isStewardshipLoading) {
    return (
      <Box sx={{ py: 8 }}>
        <HomeBannerSkeleton />
      </Box>
    );
  }

  // Helper to safely get field values
  const getFieldValue = (record: any, fieldId: string, defaultValue: any) => {
    const field = record?.fields?.find((f: any) => f.id === fieldId);
    return field !== undefined && field.value !== null && field.value !== undefined ? field.value : defaultValue;
  };

  const cleanUrl = (url: string) => {
    if (typeof url !== "string") return url;
    return url.replace(/%22$/, "").replace(/"$/, "").trim();
  };

  const getShowSection = (record: any) => {
    const show = getFieldValue(record, "showSection", true);
    return show !== false;
  };

  // 1. Story Hero Banner Section
  const banner = bannerRes?.data?.banner;
  const heroShow = banner ? banner.showSection !== false : true;
  const heroEyebrow = banner?.bannerLabel !== undefined && banner?.bannerLabel !== null ? banner.bannerLabel : "Our Heritage";
  const heroHeadline = banner?.bannerTitle !== undefined && banner?.bannerTitle !== null ? banner.bannerTitle : "Cultivating the Legacy\nof Artisanal Earth";
  const heroDescription = banner?.bannerDescription !== undefined && banner?.bannerDescription !== null ? banner.bannerDescription : "Beyond standard agriculture, we are a family-held steward of the land, preserving the patient wisdom of nature.";
  const heroCtaLabel = banner?.buttonText !== undefined && banner?.buttonText !== null ? banner.buttonText : "Discover The Promise";
  const heroImage = cleanUrl(banner?.bannerImage || "") || assets.storyHeroBg;

  // 2. Legacy / Beginning Section
  const beginning = beginningRes?.data?.theBeginning;
  const legacyShow = beginning ? beginning.showSection !== false : true;
  const legacyEyebrow = beginning?.sectionLabel !== undefined && beginning?.sectionLabel !== null ? beginning.sectionLabel : "The Beginning";
  const legacyHeading = beginning?.sectionTitle !== undefined && beginning?.sectionTitle !== null ? beginning.sectionTitle : "The Legacy of Soil and Spirit";
  const legacyBody = beginning?.sectionDescription !== undefined && beginning?.sectionDescription !== null ? beginning.sectionDescription : "Our story began in 1924, on a small patch of untouched soil that whispered of potential. Founder Elias and Martha Nutri saw not just a farm, but a living ecosystem that demanded respect rather than dominance.\n\nToday, NutriHarvest stands as a beacon of high-end agricultural craft. We treat each harvest as a masterpiece, ensuring that the honor is preserved for the generations to come. It is an editorial journey from seed to table, curated with meticulous attention to detail.";
  const legacyImage = cleanUrl(beginning?.image || "") || assets.storyLegacySoil;

  // 3. Philosophy Section — from /api/our-story/philosophy
  const philosophyData = philosophyRes?.data?.philosophy;
  const philosophyShow = true;
  const philosophyHeading =
    philosophyData?.sectionTitle ?? "Minimal Intervention Philosophy";
  const philosophyDescription =
    philosophyData?.sectionDescription ??
    "We believe the finest produce is born from where the human hand is lightest, guiding nature without forcing it.";

  let philosophyCards: Array<{ title: string; description: string }> = [
    { title: "Biodynamic Balance", description: "Aligning our harvests close with celestial cycles to ensure the highest potential energy and energetic purity." },
    { title: "Pure Sourcing", description: "Only 2% of global harvests meet our criteria for soil cleanliness, mineral depth, and certified pure origin." },
    { title: "Artisanal Curation", description: "Every batch is hand-inspected, air-cured slowly, and packed in protective glass to preserve the sensory richness that NutriHarvest is famous for." }
  ];
  if (Array.isArray(philosophyData?.philosophies) && philosophyData.philosophies.length > 0) {
    philosophyCards = philosophyData.philosophies.map((p: any) => ({
      title: p.title || "",
      description: p.description || ""
    }));
  }

  // 4. Stewardship / Timeline Section — from /api/our-story/stewardship
  const stewardshipData = stewardshipRes?.data?.stewardship;
  const timelineShow = true;
  const timelineHeading = stewardshipData?.sectionTitle ?? "A Century of Stewardship";

  let timelineItems: Array<{ year: string; title: string; description: string; image: string }> = [
    { year: "1924", title: "The Founding Soil", description: "The first 40 acres are purchased in the fertile valleys of Oregon, marking the inception of a dedicated agricultural lineage.", image: assets.storyTimeline1924 },
    { year: "1968", title: "Organic Pioneer", description: "NutriHarvest becomes one of the first certified organic estates in the region, introducing natural balance and compost enrichment techniques.", image: assets.storyTimeline1968 },
    { year: "2024", title: "The Global Standard", description: "Actively today, we continue to redefine the standards of agricultural efficacy, combining artisanal precision with ecological stewardship.", image: assets.storyTimeline2024 }
  ];
  if (Array.isArray(stewardshipData?.milestones) && stewardshipData.milestones.length > 0) {
    timelineItems = stewardshipData.milestones.map((m: any, idx: number) => {
      let defaultImg: string = assets.storyTimeline2024;
      if (idx === 0) defaultImg = assets.storyTimeline1924;
      if (idx === 1) defaultImg = assets.storyTimeline1968;
      return {
        year: m.year || "",
        title: m.title || "",
        description: m.description || "",
        image: cleanUrl(m.image || "") || defaultImg
      };
    });
  }

  // 5. CTA Section
  const ctaRecord = moduleData?.records?.find(r => r.id === "story-cta");
  const ctaShow = getShowSection(ctaRecord);
  const ctaHeading = getFieldValue(ctaRecord, "heading", "Taste the Provenance");
  const ctaDescription = getFieldValue(ctaRecord, "description", "Experience the culmination of our century-long journey through our curated seasonal collections.");
  const primaryCtaRaw = getFieldValue(ctaRecord, "primaryCta", "");
  const secondaryCtaRaw = getFieldValue(ctaRecord, "secondaryCta", "");

  const parseCta = (raw: string, defaultLabel: string, defaultHref: string) => {
    if (typeof raw === "string" && raw.includes("|")) {
      const parts = raw.split("|");
      return { label: parts[0]?.trim() || defaultLabel, href: parts[1]?.trim() || defaultHref };
    }
    return { label: typeof raw === "string" && raw ? raw : defaultLabel, href: defaultHref };
  };

  const primaryCta = parseCta(primaryCtaRaw, "Explore Collections", "/categories");
  const secondaryCta = parseCta(secondaryCtaRaw, "Our Sustainability Promise", "/about-us");

  const getPhilosophyIcon = (index: number) => {
    switch (index) {
      case 0:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        );
      case 1:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        );
      case 2:
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
    }
  };

  return (
    <StoryWrapper>
      
      {/* 1. Hero Banner Section */}
      {heroShow && (
        <Box className="story_hero">
          <Box className="hero_bg">
            <Image 
              src={heroImage} 
              alt={heroHeadline.replace(/\n/g, ' ')} 
              fill 
              priority
              sizes="100vw"
            />
          </Box>
          <Box className="hero_overlay" />
          <Box className="hero_content">
            <Typography className="hero_subtitle">{heroEyebrow}</Typography>
            <Typography variant="h1" dangerouslySetInnerHTML={{ __html: heroHeadline.replace(/\n/g, '<br />') }} />
            <Typography>
              {heroDescription}
            </Typography>
            <Button
              variant="contained"
              color="info"
              disableRipple
              onClick={() => {
                const element = document.getElementById('legacy-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleButtonClick(heroCtaLabel);
                }
              }}
            >
              {heroCtaLabel}
            </Button>
          </Box>
        </Box>
      )}

      {/* 2. The Beginning Section */}
      {legacyShow && (
        <Box id="legacy-section" className="legacy_section">
          <Container fixed>
            <Grid container spacing={{ xs: 4, md: 8 }} sx={{ alignItems: 'center' }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography className="legacy_subtitle">{legacyEyebrow}</Typography>
                <Typography variant="h2">{legacyHeading}</Typography>
                {legacyBody.split("\n\n").map((para: string, pIdx: number) => (
                  <Typography key={pIdx}>
                    {para}
                  </Typography>
                ))}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box className="legacy_image_box">
                  <Image 
                    src={legacyImage} 
                    alt={legacyHeading} 
                    fill
                    sizes="(max-width: 900px) 100vw, 45vw"
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      {/* 3. Minimal Intervention Philosophy Section */}
      {philosophyShow && (
        <Box className="philosophy_section">
          <Container fixed>
            <Box className="philosophy_header">
              <Typography variant="h2">{philosophyHeading}</Typography>
              <Typography>
                {philosophyDescription}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {philosophyCards.map((card, idx) => (
                <Grid size={{ xs: 12, md: 4 }} key={idx}>
                  <Box className="philosophy_card">
                    <Box className="card_icon_box">
                      {getPhilosophyIcon(idx)}
                    </Box>
                    <Typography variant="h3">{card.title}</Typography>
                    <Typography>
                      {card.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* 4. A Century of Stewardship Timeline Section */}
      {timelineShow && (
        <Box className="timeline_section">
          <Container fixed>
            <Box className="timeline_header">
              <Typography variant="h2">{timelineHeading}</Typography>
            </Box>

            <Box className="timeline_container">
              {timelineItems.map((item, idx) => (
                <Box className="timeline_item" key={idx}>
                  <Box className="timeline_node" />
                  <Box className="timeline_content_col">
                    <Typography className="timeline_year">{item.year}</Typography>
                    <Typography variant="h3" className="timeline_title">{item.title}</Typography>
                    <Typography className="timeline_desc">
                      {item.description}
                    </Typography>
                  </Box>
                  <Box className="timeline_image_col">
                    <Box className="timeline_img_box">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill
                        sizes="(max-width: 900px) 100vw, 40vw"
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      {/* 5. Taste the Provenance CTA Card */}
      {ctaShow && (
        <Container fixed>
          <Box className="provenance_banner">
            <Box className="provenance_content">
              <Typography variant="h2">{ctaHeading}</Typography>
              <Typography>
                {ctaDescription}
              </Typography>
              <Box className="btn_group">
                <Button
                  variant="contained"
                  color="primary"
                  disableRipple
                  component={Link}
                  href={primaryCta.href}
                >
                  {primaryCta.label}
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  disableRipple
                  component={Link}
                  href={secondaryCta.href}
                >
                  {secondaryCta.label}
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      )}

    </StoryWrapper>
  );
}
