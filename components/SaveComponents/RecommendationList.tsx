import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Grid, Typography } from '@mui/material';
import { assets } from '@/json/assest';

const recommendations = [
  {
    title: "Roasted Almonds",
    price: 18.00,
    image: assets.roastedAlmonds,
    href: "/products/roasted-almonds"
  },
  {
    title: "Dried Tomatoes",
    price: 22.00,
    image: assets.driedTomatoes,
    href: "/products/dried-tomatoes"
  },
  {
    title: "Orchard Tea",
    price: 24.00,
    image: assets.orchardTea,
    href: "/products/orchard-tea"
  },
  {
    title: "Aged Reserve",
    price: 35.00,
    image: assets.agedReserve,
    href: "/products/aged-reserve"
  }
];

export default function RecommendationList() {
  return (
    <Box className="recommendations_wrapper">
      <Container fixed>
        <Box className="recommendations_header">
          <Typography variant="h2">
            You might also love
          </Typography>
          <Link href="/products" className="explore_link">
            Explore Collections
          </Link>
        </Box>

        <Grid container spacing={3}>
          {recommendations.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Link href={item.href} className="recommendation_card">
                <Box className="rec_img_box">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={280}
                    height={280}
                    sizes="(max-width: 900px) 50vw, 20vw"
                  />
                </Box>
                <Typography variant="h6" className="rec_title">
                  {item.title}
                </Typography>
                <Typography variant="body2" className="rec_price">
                  ${item.price.toFixed(2)}
                </Typography>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
