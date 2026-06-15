'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Grid, Typography } from '@mui/material';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

import { assets } from '@/json/assest';
import { CuratedCategoriesWrapper } from '@/styles/StyledComponents/CuratedCategoriesWrapper';
import { useHomeSection } from '@/hooks/useContent';
import { CuratedCategoriesSkeleton } from '../Loader/SectionSkeletons';

const defaultCategories = [
  { title: "Almonds", count: "12 ITEMS", image: assets.almonds, href: "/product?category=almonds" },
  { title: "Cashews", count: "8 ITEMS", image: assets.cashews, href: "/product?category=cashews" },
  { title: "Pistachios", count: "10 ITEMS", image: assets.pistachios, href: "/product?category=pistachios" },
  { title: "Walnuts", count: "6 ITEMS", image: assets.walnuts, href: "/product?category=walnuts" },
  { title: "Dates", count: "15 ITEMS", image: assets.dates, href: "/product?category=dates" },
  { title: "Seeds", count: "9 ITEMS", image: assets.seeds, href: "/product?category=seeds" }
];

export default function CuratedCategories() {
  const { data: sectionData, isLoading } = useHomeSection("categories");

  if (isLoading) return <CuratedCategoriesSkeleton />;

  const heading = sectionData?.content?.heading || "Curated Categories";
  const cardsRaw = (sectionData?.content?.cards as string) || "";
  const imageSetRaw = (sectionData?.content?.imageSet as string) || "";

  let categories: Array<{ title: string; count: string; image: string; href: string }> = defaultCategories;
  if (cardsRaw && cardsRaw.trim()) {
    const lines = cardsRaw.split("\n").filter(Boolean);
    const images = imageSetRaw ? imageSetRaw.split("\n").filter(Boolean) : [];
    categories = lines.map((line, idx) => {
      const parts = line.split("|");
      return {
        title: parts[0]?.trim() || "",
        count: parts[1]?.trim() || "",
        href: parts[2]?.trim() || "/product",
        image: images[idx]?.trim() || assets.almonds
      };
    });
  }

  return (
    <CuratedCategoriesWrapper>
      <Container fixed>
        <Box className='wrapper_titleBox'>
          <Typography variant='h2'>{heading}</Typography>
        </Box>

        {/* Desktop Grid Layout */}
        <Box className='desktop_grid'>
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid size={{ xs: 12, sm: 4, md: 2 }} key={category.title}>
                <Box className='category_card'>
                  <Link href={category.href}>
                    <Box className='category_imgBox'>
                      <Image
                        src={category.image}
                        alt={category.title}
                        width={400}
                        height={400}
                        className='category_img'
                      />
                    </Box>
                    <Typography variant='h4' className='category_title'>
                      {category.title}
                    </Typography>
                    <Typography variant='body2' className='category_count'>
                      {category.count}
                    </Typography>
                  </Link>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Mobile Splide Slider Layout */}
        <Box className='mobile_slider'>
          <Splide
            options={{
              type: 'Slide',
              perPage: 2,
              gap: '16px',
              arrows: false,
              pagination: true,
              breakpoints: {
                480: {
                  perPage: 1.5,
                  gap: '12px',
                }
              }
            }}
          >
            {categories.map((category) => (
              <SplideSlide key={category.title}>
                <Box className='category_card'>
                  <Link href={category.href}>
                    <Box className='category_imgBox'>
                      <Image
                        src={category.image}
                        alt={category.title}
                        width={400}
                        height={400}
                        className='category_img'
                      />
                    </Box>
                    <Typography variant='h4' className='category_title'>
                      {category.title}
                    </Typography>
                    <Typography variant='body2' className='category_count'>
                      {category.count}
                    </Typography>
                  </Link>
                </Box>
              </SplideSlide>
            ))}
          </Splide>
        </Box>
      </Container>
    </CuratedCategoriesWrapper>
  );
}
