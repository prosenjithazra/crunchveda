"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Container } from "@mui/material";
import { dryFruits, DryFruitProduct } from "@/json/mock/dryFruits";
import { ProductDetailsBottomWrapper } from "@/styles/StyledComponents/ProductDetailsBottomWrapper";

interface Props {
  product: DryFruitProduct;
}

const nutritionData = [
  { name: "Potassium", value: "16% DV" },
  { name: "Dietary Fiber", value: "7g per serving" },
  { name: "Vitamin B6", value: "15% DV" },
  { name: "Magnesium", value: "14% DV" },
];

export default function ProductDetailsBottom({ product }: Props) {
  // Show 4 other products as "Pairs Well With"
  const pairsProducts = dryFruits
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailsBottomWrapper>
      {/* ── Heritage Banner ── */}
      <Box className="heritage_banner">
        <Container fixed>
          <Box className='wrapperOuter_heritage'>
          <Box className="heritage_inner">
            <Box component="p" className="heritage_eyebrow">
              Our Heritage
            </Box>
            <Box component="h2" className="heritage_title">
              The Gold of the Oasis
            </Box>
            <Box component="p" className="heritage_desc">
              In the heart of ancient date groves, where the sun scorches with
              minerals and the sun never sets on the harvest. Nutrition that
              seeks the exceptional. Our dry fruits are not just food; they are
              a legacy of artisanal agriculture passed down through generations.
              Each piece is hand-picked at the peak of ripeness, ensuring
              delicate flavours remain intact and the natural goodness remains
              moist.
            </Box>

            <Box className="heritage_stats">
              <Box className="stat_item">
                <Box className="stat_number">240+</Box>
                <Box className="stat_label">Sunny Days</Box>
              </Box>
              <Box className="stat_item">
                <Box className="stat_number">100%</Box>
                <Box className="stat_label">Hand Picked</Box>
              </Box>
              <Box className="stat_item">
                <Box className="stat_number">Zero</Box>
                <Box className="stat_label">Added Sugars</Box>
              </Box>
            </Box>
          </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Nutritional Clarity ── */}
      <Box className="nutrition_section">
        <Container fixed>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 4, md: 6 },
              alignItems: "start",
            }}
          >
            {/* Left: Table */}
            <Box>
              <Box component="p" className="section_eyebrow">
                Composition
              </Box>
              <Box component="h2" className="section_title">
                Nutritional Clarity
              </Box>
              <Box component="p" className="section_sub">
                Naturally high in fiber, potassium, and antioxidants. A
                sophisticated alternative to processed sugars.
              </Box>

              <Box className="nutrition_table">
                {nutritionData.map((row) => (
                  <Box className="nutrition_row" key={row.name}>
                    <Box component="span" className="nutr_name">
                      {row.name}
                    </Box>
                    <Box component="span" className="nutr_value">
                      {row.value}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Right: Quote Card */}
            <Box className="quote_card">
              <Box className="quote_icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </Box>
              <Box component="p" className="quote_text">
                &ldquo;Nature&rsquo;s Most Perfect Energy Source&rdquo;
              </Box>
              <Box component="p" className="quote_author">
                — Dr. Ara Thorne, Holistic Nutritionist
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Pairs Well With ── */}
      <Box className="pairs_section">
        <Container fixed>
          <Box className="pairs_header">
            <Box component="h2" className="pairs_title">
              Pairs Well With
            </Box>
            <Link href="/product" className="explore_link">
              Explore Shop →
            </Link>
          </Box>

          <Box className="pairs_grid">
            {pairsProducts.map((item) => {
              const defaultPrice = item.sizePrices[item.defaultSize];
              return (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Box className="pair_card">
                    <Box className="pair_img_box">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={400}
                        height={400}
                      />
                    </Box>
                    <Box component="p" className="pair_name">
                      {item.name}
                    </Box>
                    <Box component="p" className="pair_price">
                      ${defaultPrice.toFixed(2)}
                    </Box>
                    <button className="pair_add_btn">Add to Cart</button>
                  </Box>
                </Link>
              );
            })}
          </Box>
        </Container>
      </Box>
    </ProductDetailsBottomWrapper>
  );
}
