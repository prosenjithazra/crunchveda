/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { getBadgeInfo } from "@/services/productService";
import { cartService } from "@/services/cartService";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

interface Props {
  product: DryFruitProduct;
}

export default function ProductDetailsMain({ product }: Props) {
  // useRef<any> — @splidejs/react-splide v0.7.x types omit ref; cast bypasses it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mainRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { cartItems } = useCart();

  const isInCart = cartItems.some(
    (item) => item.id === (product._id || product.id) && item.size === selectedSize
  );

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

  const handleAddToCart = async () => {
    try {
      const currentCart = await cartService.getCart();
      const existing = currentCart.find(
        (item) => item.id === (product._id || product.id) && item.size === selectedSize
      );
      const existingQty = existing ? existing.quantity : 0;
      const newQty = existingQty + quantity;

      const updatedQty = await cartService.updateItem(product._id || product.id, newQty, selectedSize, price);

      let updatedCart = [...currentCart];
      if (existing) {
        updatedCart = currentCart.map((item) =>
          item.id === (product._id || product.id) && item.size === selectedSize
            ? { ...item, quantity: updatedQty }
            : item
        );
      } else {
        updatedCart.push({
          id: product._id || product.id,
          name: product.name,
          badge: product.badge || "Organic Collection",
          price,
          quantity: updatedQty,
          image: product.image || "/assets/images/placeholder.jpg",
          size: selectedSize,
        });
      }
      cartService.saveLocalFallback(updatedCart);

      toast.success(`Added ${quantity} x ${product.name} (${selectedSize} Pack) to cart!`);
    } catch (e) {
      toast.error("Failed to add product to cart");
    }
  };

  const handleWhatsApp = () => {
    const text = `Hi, I am interested in purchasing ${quantity} x ${product.name} (${selectedSize} Pack) from your Dry Fruit Collections. Could you assist me with the order?`;
    window.open(`https://wa.me/6296909031?text=${encodeURIComponent(text)}`, "_blank");
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

  const badgeInfo = getBadgeInfo(product.badge);
  const badges = [
    ...(badgeInfo ? [{ text: badgeInfo.text, cls: badgeInfo.type === "organic" ? "badge_grade" : "badge_reserve" }] : []),
    { text: "Premium Grade", cls: badgeInfo?.type === "organic" ? "badge_reserve" : "badge_grade" },
  ];

  return (
    <>
      <ProductDetailsMainWrapper>
        <Container fixed>
          {/* Breadcrumb */}
          <Box className="breadcrumb_box">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/products">Collections</Link>
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

                {/* Stock Status Details */}
                {product.stock !== undefined && (
                  <Box sx={{ mb: 2.5, mt: 1, display: "flex", alignItems: "center", gap: "8px" }}>
                    {product.stock <= 0 ? (
                      <Box sx={{ color: "error.main", fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                        <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "error.main", display: "inline-block" }} />
                        Out of Stock
                      </Box>
                    ) : product.stock < 10 ? (
                      <Box sx={{ color: "error.main", fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                        <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "error.main", display: "inline-block" }} />
                        Order Soon – Limited Quantity Left (Only {product.stock} items remaining)
                      </Box>
                    ) : (
                      <Box sx={{ color: "success.main", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                        <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main", display: "inline-block" }} />
                        In Stock ({product.stock} items available)
                      </Box>
                    )}
                  </Box>
                )}

                {/* Quantity Selector & Add to Cart Button */}
                <Box className="action_row">
                  <Box className="quantity_selector">
                    <IconButton 
                      onClick={handleDecrease} 
                      disabled={product.stock !== undefined && product.stock <= 0 || quantity <= 1}
                      aria-label="Decrease quantity"
                      disableRipple
                    >
                      <MinusIcon />
                    </IconButton>
                    <Box className="qty_value">{product.stock !== undefined && product.stock <= 0 ? 0 : quantity}</Box>
                    <IconButton 
                      onClick={handleIncrease}
                      disabled={product.stock !== undefined && product.stock <= 0}
                      aria-label="Increase quantity"
                      disableRipple
                    >
                      <PlusIcon />
                    </IconButton>
                  </Box>
                  {isInCart ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      disableRipple
                      onClick={() => router.push("/cart")}
                      startIcon={<CartIcon iconColor='white' />}
                      sx={{ bgcolor: "#8F5E15", "&:hover": { bgcolor: "#764D0F" } }}
                    >
                      Go to Cart
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      disableRipple
                      onClick={handleAddToCart}
                      disabled={product.stock !== undefined && product.stock <= 0}
                      startIcon={!(product.stock !== undefined && product.stock <= 0) && <CartIcon iconColor='white' />}
                    >
                      {product.stock !== undefined && product.stock <= 0 ? 'Sold Out' : 'Add to Cart'}
                    </Button>
                  )}
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
