'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Grid, Typography, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { productService, mapApiProductToUi, type Product } from '@/services/productService';

export default function RecommendationList() {
  const { data, isLoading } = useQuery({
    queryKey: ['recommendedProducts'],
    queryFn: async () => {
      try {
        const res = await productService.getBestsellers();
        if (res.data && res.data.length > 0) {
          return res.data.slice(0, 4);
        }
      } catch (err) {
        console.warn('RecommendationList bestsellers fetch failed, fallback to getProducts:', err);
      }
      const fallbackRes = await productService.getProducts({ limit: 4 });
      return fallbackRes.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const products: Product[] = data || [];

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

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress color="primary" size={32} />
          </Box>
        ) : products.length > 0 ? (
          <Grid container spacing={3}>
            {products.map((prod) => {
              const uiProd = mapApiProductToUi(prod);
              const defaultPrice = uiProd.sizePrices[uiProd.defaultSize] || prod.price || 0;
              const productSlug = prod.slug || uiProd.id;

              return (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={prod._id || uiProd.id}>
                  <Link href={`/products/${productSlug}`} className="recommendation_card">
                    <Box className="rec_img_box">
                      <Image
                        src={uiProd.image}
                        alt={prod.name}
                        width={280}
                        height={280}
                        sizes="(max-width: 900px) 50vw, 20vw"
                      />
                    </Box>
                    <Typography variant="h6" className="rec_title">
                      {prod.name}
                    </Typography>
                    <Typography variant="body2" className="rec_price">
                      ₹{Number(defaultPrice).toFixed(2)}
                    </Typography>
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        ) : null}
      </Container>
    </Box>
  );
}
