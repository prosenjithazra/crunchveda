/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useCategories } from '@/hooks/useProducts';
import { CuratedCategoriesSkeleton } from '../Loader/SectionSkeletons';

const defaultCategories = [
  { title: "Almonds", count: "", image: assets.almonds, href: "/products?category=almonds" },
  { title: "Cashews", count: "", image: assets.cashews, href: "/products?category=cashews" },
  { title: "Pistachios", count: "", image: assets.pistachios, href: "/products?category=pistachios" },
  { title: "Walnuts", count: "", image: assets.walnuts, href: "/products?category=walnuts" },
  { title: "Dates", count: "", image: assets.dates, href: "/products?category=dates" },
  { title: "Seeds", count: "", image: assets.seeds, href: "/products?category=seeds" }
];

export default function CuratedCategories() {
  const { data: sectionData, isLoading: sectionLoading } = useHomeSection("categories");
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  if (sectionLoading || categoriesLoading) return <CuratedCategoriesSkeleton />;

  const showSection = sectionData?.content?.showSection ?? true;
  if (!showSection) return null;

  const heading = sectionData?.content?.heading || "Curated Categories";
  const cmsCards = sectionData?.content?.cards || "";
  const cmsImageSet = sectionData?.content?.imageSet || "";

  let categories: Array<{ title: string; count: string; image: string; href: string }> = [];

  const categoriesList = Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : ((categoriesData?.data as any)?.categories || []);

  if (categoriesList && categoriesList.length > 0) {
    categories = categoriesList.map((cat: any) => ({
      title: cat.name,
      count: "",
      image: cat.image || assets.almonds,
      href: `/products?category=${encodeURIComponent(cat.name)}`
    }));
  }

  if (categories.length === 0) {
    categories = defaultCategories;
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
