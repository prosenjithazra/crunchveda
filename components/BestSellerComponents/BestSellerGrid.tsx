'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Grid, Typography, CircularProgress } from '@mui/material';
import { assets } from '@/json/assest';
import { BestSellerGridWrapper } from '@/styles/StyledComponents/BestSellerGridWrapper';
import { useBestsellers } from '@/hooks/useProducts';
import { mapApiProductToUi } from '@/services/productService';

export default function BestSellerGrid() {
  const { data, isLoading } = useBestsellers();
  const rawProducts = data?.data || [];

  return (
    <BestSellerGridWrapper>
      <Container fixed>
        {/* Collection Header */}
        <Box className="collection_header">
          <Typography variant="h2">The Collection</Typography>
          <Link href="/categories" className="shop_link">
            View All Shop
          </Link>
        </Box>

        {/* Product Cards Grid */}
        <Grid container spacing={4}>
          {isLoading ? (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress color="primary" />
              </Box>
            </Grid>
          ) : rawProducts.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 8 }}>
                No bestseller products found.
              </Typography>
            </Grid>
          ) : (
            rawProducts.map((p) => {
              const product = mapApiProductToUi(p);
              const price = product.sizePrices[product.defaultSize] || 0;
              return (
                <Grid size={{ xs: 12, md: 4 }} key={p._id}>
                  <Box component={Link} href={`/product/${product.id}`} className="collection_card">
                    <Box className="card_imgBox">
                      <Image
                        src={product.image || assets.cashewsProduct}
                        alt={product.name}
                        fill
                        sizes="(max-width: 900px) 100vw, 30vw"
                      />
                      {product.badge && <Box className="limited_badge">{product.badge === "BEST SELLER" ? "Best Seller" : product.badge}</Box>}
                    </Box>
                    <Box className="card_details">
                      <Box className="title_row">
                        <Typography variant="h3">{product.name}</Typography>
                        <Typography className="price">₹{price.toFixed(2)}</Typography>
                      </Box>
                      <Typography className="sub_label">
                        {product.category} | {product.defaultSize}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })
          )}
        </Grid>
      </Container>
    </BestSellerGridWrapper>
  );
}
