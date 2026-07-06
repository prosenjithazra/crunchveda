'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LeafIcon from '@mui/icons-material/LocalFlorist';
import BadgeCheckIcon from '@mui/icons-material/VerifiedUser';
import TruckIcon from '@mui/icons-material/LocalShipping';
import PackageIcon from '@mui/icons-material/Inventory2';
import StarIcon from '@mui/icons-material/Star';
import ShieldIcon from '@mui/icons-material/Shield';
import HeartIcon from '@mui/icons-material/Favorite';

import { FeaturesSectionWrapper } from '@/styles/StyledComponents/FeaturesSectionWrapper';
import { useHomeSection } from '@/hooks/useContent';
import { FeaturesSectionSkeleton } from '../Loader/SectionSkeletons';

const iconMap: Record<string, React.ReactElement> = {
  leaf: <LeafIcon />,
  "badge-check": <BadgeCheckIcon />,
  truck: <TruckIcon />,
  package: <PackageIcon />,
  eco: <SpaIcon />,
  star: <StarIcon />,
  shield: <ShieldIcon />,
  heart: <HeartIcon />,
  spa: <SpaIcon />,
  verified: <VerifiedIcon />,
  shipping: <LocalShippingIcon />,
  inventory: <Inventory2Icon />,
};

const bgClassMap: Record<number, string> = {
  0: "organic_bg",
  1: "quality_bg",
  2: "delivery_bg",
  3: "packing_bg",
};

const defaultFeatures = [
  {
    icon: <SpaIcon />,
    title: "100% Organic",
    desc: "Sourced from certified organic farms committed to sustainable heritage agriculture.",
    bgClass: "organic_bg"
  },
  {
    icon: <VerifiedIcon />,
    title: "Premium Quality",
    desc: "Every batch undergoes rigorous quality checks for size, freshness, and nutrient density.",
    bgClass: "quality_bg"
  },
  {
    icon: <LocalShippingIcon />,
    title: "Eco-Fast Delivery",
    desc: "Sustainable carbon-neutral shipping ensures your health arrives at your doorstep swiftly.",
    bgClass: "delivery_bg"
  },
  {
    icon: <Inventory2Icon />,
    title: "Artisanal Packing",
    desc: "Breathable, eco-friendly packaging designed to maintain crunch and essential oils.",
    bgClass: "packing_bg"
  }
];

export default function FeaturesSection() {
  const { data: sectionData, isLoading } = useHomeSection("features");

  if (isLoading) return <FeaturesSectionSkeleton />;

  const showSection = sectionData?.content?.showSection ?? true;
  if (!showSection) return null;

  let features = defaultFeatures;
  const featuresContent = sectionData?.content?.features;

  if (Array.isArray(featuresContent) && featuresContent.length > 0) {
    features = featuresContent.map((f: any, idx: number) => {
      const iconKey = (f.icon || "").toLowerCase();
      const icon = iconMap[iconKey] || iconMap[Object.keys(iconMap)[idx % Object.keys(iconMap).length]];
      const bgClass = bgClassMap[idx % 4] || "organic_bg";
      return {
        icon,
        title: f.title || "",
        desc: f.description || f.desc || "",
        bgClass,
      };
    });
  } else if (typeof featuresContent === "string" && featuresContent.trim()) {
    const lines = featuresContent.split("\n").filter(Boolean);
    features = lines.map((line, idx) => {
      const parts = line.split("|");
      const title = parts[0]?.trim() || "";
      const desc = parts[1]?.trim() || "";
      const bgClass = bgClassMap[idx % 4] || "organic_bg";
      const defaultIcons = [<SpaIcon />, <VerifiedIcon />, <LocalShippingIcon />, <Inventory2Icon />];
      const icon = defaultIcons[idx % 4];
      return { icon, title, desc, bgClass };
    });
  }

  return (
    <FeaturesSectionWrapper>
      <Container fixed>
        <Box className='features_grid'>
          {features.map((feature, idx) => (
            <Box key={`${feature.title}-${idx}`} className='feature_card'>
              <Box className={`icon_box ${feature.bgClass}`}>
                {feature.icon}
              </Box>
              <Typography variant='h3' className='feature_title'>
                {feature.title}
              </Typography>
              <Typography variant='body1' className='feature_desc'>
                {feature.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </FeaturesSectionWrapper>
  );
}
