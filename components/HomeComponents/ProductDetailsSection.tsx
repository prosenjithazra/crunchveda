/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Container, Grid, Typography } from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

import { assets } from '@/json/assest';
import { ProductDetailsSectionWrapper } from '@/styles/StyledComponents/ProductDetailsSectionWrapper';
import { useHomeSection } from '@/hooks/useContent';
import { ProductDetailsSectionSkeleton } from '../Loader/SectionSkeletons';

type HighlightItem = {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  highlights: string[];
  image: string;
  imagePosition: 'left' | 'right';
};

const defaultItems: HighlightItem[] = [
  {
    sectionLabel: "NATURAL SUPERFOOD",
    sectionTitle: "The Brain-Boosting Power of Walnuts",
    sectionDescription: "Rich in omega-3 fatty acids and antioxidants, our Chilean walnuts are more than just a snack. They are essential fuel for cognitive health and heart vitality.",
    highlights: ["High in Omega-3 DHA", "Supports Heart Health", "Natural Energy Booster"],
    image: assets.walnutDetail,
    imagePosition: "right"
  },
  {
    sectionLabel: "IMMUNE SUPPORT",
    sectionTitle: "Almonds: Nature's Daily Multi-Vitamin",
    sectionDescription: "Packed with Vitamin E, magnesium, and protein, our California almonds help maintain healthy skin and a robust immune system with every crunch.",
    highlights: ["Rich in Vitamin E", "High Fiber Content", "Promotes Skin Health"],
    image: assets.almondDetail,
    imagePosition: "left"
  }
];

export default function ProductDetailsSection() {
  const { data: sectionData, isLoading } = useHomeSection("product-details");

  if (isLoading) return <ProductDetailsSectionSkeleton />;

  const showSection = sectionData?.content?.showSection ?? true;
  if (!showSection) return null;

  const content = sectionData?.content || {};
  let items: HighlightItem[] = [];

  const rawItems = content.items;
  if (Array.isArray(rawItems) && rawItems.length > 0) {
    items = rawItems.map((item: any, idx: number) => {
      const highlights = Array.isArray(item.highlights)
        ? item.highlights
        : (Array.isArray(item.bullets)
          ? item.bullets
          : (typeof item.highlights === "string" && item.highlights.trim()
            ? item.highlights.split("\n").filter(Boolean)
            : (typeof item.bullets === "string" && item.bullets.trim()
              ? item.bullets.split("\n").filter(Boolean)
              : [])));

      return {
        sectionLabel: item.sectionLabel || item.eyebrow || (idx === 0 ? "NATURAL SUPERFOOD" : "IMMUNE SUPPORT"),
        sectionTitle: item.sectionTitle || item.title || (idx === 0 ? "The Brain-Boosting Power of Walnuts" : "Almonds: Nature's Daily Multi-Vitamin"),
        sectionDescription: item.sectionDescription || item.description || "",
        highlights: highlights.length > 0 ? highlights : (idx === 0 ? defaultItems[0].highlights : defaultItems[1].highlights),
        image: item.image || (idx === 0 ? assets.walnutDetail : assets.almondDetail),
        imagePosition: item.imagePosition || (idx % 2 === 0 ? "right" : "left")
      };
    });
  } else {
    // Reconstruct items from top-level content fields if they are set (compatibility fallback)
    const walnutBullets = typeof content.walnutBullets === "string" && content.walnutBullets.trim()
      ? content.walnutBullets.split("\n").filter(Boolean)
      : defaultItems[0].highlights;

    const almondBullets = typeof content.almondBullets === "string" && content.almondBullets.trim()
      ? content.almondBullets.split("\n").filter(Boolean)
      : defaultItems[1].highlights;

    items = [
      {
        sectionLabel: content.walnutEyebrow || defaultItems[0].sectionLabel,
        sectionTitle: content.walnutHeading || defaultItems[0].sectionTitle,
        sectionDescription: content.walnutDescription || defaultItems[0].sectionDescription,
        highlights: walnutBullets,
        image: content.walnutImage || defaultItems[0].image,
        imagePosition: "right"
      },
      {
        sectionLabel: content.almondEyebrow || defaultItems[1].sectionLabel,
        sectionTitle: content.almondHeading || defaultItems[1].sectionTitle,
        sectionDescription: content.almondDescription || defaultItems[1].sectionDescription,
        highlights: almondBullets,
        image: content.almondImage || defaultItems[1].image,
        imagePosition: "left"
      }
    ];
  }

  return (
    <ProductDetailsSectionWrapper>
      <Container fixed>
        <Box className='details_container'>
          {items.map((item, index) => {
            const isImageRight = item.imagePosition === 'right';

            const textColumn = (
              <Grid size={{ xs: 12, md: 6 }} key={`text-${index}`}>
                <Box className='detail_content'>
                  <Typography variant='body1' className='cmnSmallTitle'>
                    {item.sectionLabel}
                  </Typography>
                  <Typography variant='h2'>
                    {item.sectionTitle}
                  </Typography>
                  <Typography variant='body1'>
                    {item.sectionDescription}
                  </Typography>
                  <Box className='bullet_list'>
                    {item.highlights.map((bullet: string, idx: number) => (
                      <Box className='bullet_item' key={idx}>
                        <CheckCircleOutlineRoundedIcon />
                        <Typography variant='subtitle2' component='span'>
                          {bullet}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            );

            const imageColumn = (
              <Grid size={{ xs: 12, md: 6 }} key={`image-${index}`}>
                <Box className='detail_imgBox'>
                  <Image
                    src={item.image}
                    alt={item.sectionTitle}
                    width={800}
                    height={800}
                  />
                </Box>
              </Grid>
            );

            return (
              <Grid
                container
                spacing={{ xs: 3, sm: 4, md: 6, lg: 10 }}
                sx={{ alignItems: 'center', mb: index === items.length - 1 ? 0 : { xs:2, sm: 4, md:5, lg: 6 } }}
                key={index}
              >
                {isImageRight ? [textColumn, imageColumn] : [imageColumn, textColumn]}
              </Grid>
            );
          })}
        </Box>
      </Container>
    </ProductDetailsSectionWrapper>
  );
}
