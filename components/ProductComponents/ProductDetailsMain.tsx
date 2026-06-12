"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Container, Grid, Button, IconButton } from "@mui/material";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import WhatsAppIcon from "@/ui/Icons/WhatsAppIcon";
import MinusIcon from "@/ui/Icons/MinusIcon";
import PlusIcon from "@/ui/Icons/PlusIcon";
import OrganicIcon from "@/ui/Icons/OrganicIcon";
import TradeIcon from "@/ui/Icons/TradeIcon";
import CheckIcon from "@/ui/Icons/CheckIcon";
import CartIcon from "@/ui/Icons/CartIcon";
import { ProductDetailsMainWrapper } from "@/styles/StyledComponents/ProductDetailsMainWrapper";
import ProductDetailsBottom from "./ProductDetailsBottom";
import { DryFruitProduct } from "@/json/mock/dryFruits";
import { toast } from "react-hot-toast";

interface Props {
  product: DryFruitProduct;
}

export default function ProductDetailsMain({ product }: Props) {
  // useRef<any> — @splidejs/react-splide v0.7.x types omit ref; cast bypasses it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mainRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const sizes = Object.keys(product.sizePrices);
  const [selectedSize, setSelectedSize] = useState(product.defaultSize);
  const [quantity, setQuantity] = useState(1);

  const price = product.sizePrices[selectedSize];

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} x ${product.name} (${selectedSize} Pack) to cart!`);
  };

  const handleWhatsApp = () => {
    const text = `Hi, I am interested in purchasing ${quantity} x ${product.name} (${selectedSize} Pack) from your Dry Fruit Collections. Could you assist me with the order?`;
    window.open(`https://wa.me/+1234567890?text=${encodeURIComponent(text)}`, "_blank");
  };

  const trust = [
    {
      icon: <OrganicIcon />,
      label: "100% Organic",
      sub: "Farm-to-table cultivation",
    },
    {
      icon: <TradeIcon />,
      label: "Direct Trade",
      sub: "Sourced with heritage",
    },
  ];

  const badges = [
    ...(product.badge ? [{ text: product.badge === "ORGANIC" ? "Organic" : "Best Seller", cls: product.badge === "ORGANIC" ? "badge_grade" : "badge_reserve" }] : []),
    { text: "Premium Grade", cls: product.badge === "ORGANIC" ? "badge_reserve" : "badge_grade" },
  ];

  return (
    <>
      <ProductDetailsMainWrapper>
        <Container fixed>
          {/* Breadcrumb */}
          <Box className="breadcrumb_box">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/product">Collections</Link>
            <span>/</span>
            <span style={{ opacity: 1, color: "inherit" }}>{product.name}</span>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4, lg: 5 }}>
            {/* ── Gallery Column ── */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className="gallery_col">
                {/* ── Main Splide Slider ── */}
                <Box className="gallery_main_slider">
                  <Splide
                    {...({ 
                      ref: mainRef,
                      onMove: (_splide: unknown, newIndex: number) => setActiveIndex(newIndex)
                    } as unknown as Record<string, unknown>)}
                    options={{
                      type: "fade",
                      rewind: true,
                      pagination: false,
                      arrows: false,
                      drag: true,
                      speed: 500,
                    }}
                  >
                    {product.gallery.map((src, i) => (
                      <SplideSlide key={i}>
                        <Box className="gallery_main_img">
                          <Image
                            src={src}
                            alt={`${product.name} – view ${i + 1}`}
                            width={800}
                            height={800}
                            priority={i === 0}
                          />
                        </Box>
                      </SplideSlide>
                    ))}
                  </Splide>
                </Box>

                {/* ── Thumbnail Boxes ── */}
                <Box className="gallery_thumbs">
                  {product.gallery.map((src, i) => (
                    <Box
                      key={i}
                      className={`gallery_thumb${activeIndex === i ? " active" : ""}`}
                      onClick={() => {
                        setActiveIndex(i);
                        mainRef.current?.go(i);
                      }}
                    >
                      <Image
                        src={src}
                        alt={`${product.name} thumbnail ${i + 1}`}
                        width={300}
                        height={300}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>


            {/* ── Info Column ── */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className="info_col">
                {/* Badges */}
                <Box className="badge_row">
                  {badges.map((b) => (
                    <Box key={b.cls + b.text} className={`product_badge ${b.cls}`}>
                      {b.text}
                    </Box>
                  ))}
                </Box>

                {/* Title */}
                <Box component="h1" className="product_name">
                  {product.name}
                </Box>

                {/* Description */}
                <Box component="p" className="product_desc">
                  {product.description}
                </Box>

                {/* Price */}
                <Box className="price_row">
                  <Box component="span" className="price_main">
                    ${price.toFixed(2)}
                  </Box>
                  <Box component="span" className="price_original">
                    ${(price * 1.2).toFixed(2)}
                  </Box>
                  <Box component="span" className="price_savings">
                    20% Savings
                  </Box>
                </Box>

                {/* Size Selector (as package options) */}
                <Box className="package_selector">
                  {sizes.map((size) => {
                    const sizePrice = product.sizePrices[size];
                    const isDefault = size === product.defaultSize;
                    return (
                      <Box
                        key={size}
                        className={`package_option${selectedSize === size ? " active" : ""}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        <Box className="option_info">
                          <Box component="span" className="option_label">
                            {size} Pack
                          </Box>
                          <Box component="span" className="option_sub">
                            {isDefault ? "Most popular choice" : "Great for sharing"}
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <Box component="span" className="option_price">
                            ${sizePrice.toFixed(2)}
                          </Box>
                          <Box
                            className={`option_check${selectedSize === size ? " checked" : ""}`}
                          >
                            <CheckIcon />
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {/* Quantity Selector & Add to Cart Button */}
                <Box className="action_row">
                  <Box className="quantity_selector">
                    <IconButton 
                      onClick={handleDecrease} 
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      disableRipple
                    >
                      <MinusIcon />
                    </IconButton>
                    <Box className="qty_value">{quantity}</Box>
                    <IconButton 
                      onClick={handleIncrease}
                      aria-label="Increase quantity"
                      disableRipple
                    >
                      <PlusIcon />
                    </IconButton>
                  </Box>                  <Button
                    variant="contained"
                    color="primary"
                    disableRipple
                    onClick={handleAddToCart}
                    startIcon={<CartIcon iconColor='white' />}
                  >
                    Add to Cart
                  </Button>
                </Box>

                {/* WhatsApp CTA */}
                <Button
                  variant="contained"
                  color="info"
                  disableRipple
                  onClick={handleWhatsApp}
                  startIcon={<WhatsAppIcon />}
                  fullWidth
                >
                  Order on WhatsApp
                </Button>
                <Box component="p" className="response_note">
                  Typical response time · 1–3 mins
                </Box>

                {/* Trust Badges */}
                <Box className="trust_badges">
                  {trust.map((t) => (
                    <Box className="trust_item" key={t.label}>
                      <Box className="trust_icon">{t.icon}</Box>
                      <Box className="trust_text">
                        <Box component="span" className="trust_label">
                          {t.label}
                        </Box>
                        <Box component="span" className="trust_sub">
                          {t.sub}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </ProductDetailsMainWrapper>

      {/* ── Bottom Sections (separate component) ── */}
      <ProductDetailsBottom product={product} />
    </>
  );
}
