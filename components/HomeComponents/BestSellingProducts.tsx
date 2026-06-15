'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

import { assets } from '@/json/assest';
import ShopingBagIcon from '@/ui/Icons/ShopingBagIcon';
import WhatsAppIcon from '@/ui/Icons/WhatsAppIcon';
import { BestSellingProductsWrapper } from '@/styles/StyledComponents/BestSellingProductsWrapper';
import { useHomeSection } from '@/hooks/useContent';
import { BestSellingProductsSkeleton } from '../Loader/SectionSkeletons';

const defaultProducts = [
  {
    id: "1",
    title: "Jumbo Cashews",
    price: "$18.50",
    image: assets.cashewsProduct,
    badge: { text: "Organic", type: "organic" },
    sizes: ["250g", "500g", "1kg"],
    defaultSize: "500g",
    hasWhatsApp: true,
    href: "/product/jumbo-cashews"
  },
  {
    id: "2",
    title: "Raw California Almonds",
    price: "$18.50",
    image: assets.almondsProduct,
    badge: { text: "Best Seller", type: "bestseller" },
    sizes: ["100g","250g", "500g", "1kg"],
    defaultSize: "500g",
    hasWhatsApp: true,
    href: "/product/california-almonds"
  },
  {
    id: "3",
    title: "Artisanal Chilean Walnuts",
    price: "$21.99",
    image: assets.walnutsProduct,
    badge: null,
    sizes: ["500g"],
    defaultSize: "500g",
    hasWhatsApp: false,
    href: "/product/walnut-halves"
  },
  {
    id: "4",
    title: "Turkish Salted Pistachios",
    price: "$27.50",
    image: assets.pistachiosProduct,
    badge: null,
    sizes: ["100g","500g"],
    defaultSize: "500g",
    hasWhatsApp: false,
    href: "/product/iranian-pistachios"
  }
];

export default function BestSellingProducts() {
  const { data: sectionData, isLoading } = useHomeSection("best-selling");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    "1": "500g",
    "2": "500g",
    "3": "500g",
    "4": "500g"
  });

  if (isLoading) return <BestSellingProductsSkeleton />;

  const eyebrow = sectionData?.content?.eyebrow || "CROWD FAVORITES";
  const heading = sectionData?.content?.heading || "Best Selling Products";
  const viewAllLabel = sectionData?.content?.viewAllLabel || "View All Products";
  const viewAllHref = sectionData?.content?.viewAllHref || "/product";
  const productsRaw = (sectionData?.content?.products as string) || "";

  let products: Array<{
    id: string;
    title: string;
    price: string;
    image: string;
    badge: { text: string; type: string } | null;
    sizes: string[];
    defaultSize: string;
    hasWhatsApp: boolean;
    href: string;
  }> = defaultProducts;

  if (productsRaw && productsRaw.trim()) {
    const lines = productsRaw.split("\n").filter(Boolean);
    products = lines.map((line, idx) => {
      const parts = line.split("|");
      const title = parts[0]?.trim() || "";
      const price = parts[1]?.trim() || "";
      const badgeText = parts[2]?.trim() || "";
      const sizes = parts[3]?.split(",").map(s => s.trim()).filter(Boolean) || ["500g"];
      const hasWhatsApp = parts[4]?.toLowerCase().includes("enabled") ?? true;

      let image: string = assets.cashewsProduct;
      let href = "/product/jumbo-cashews";
      if (idx === 1) {
        image = assets.almondsProduct;
        href = "/product/california-almonds";
      } else if (idx === 2) {
        image = assets.walnutsProduct;
        href = "/product/walnut-halves";
      } else if (idx === 3) {
        image = assets.pistachiosProduct;
        href = "/product/iranian-pistachios";
      }

      let badge = null;
      if (badgeText && badgeText.toLowerCase() !== "no badge" && badgeText.toLowerCase() !== "none") {
        badge = {
          text: badgeText,
          type: badgeText.toLowerCase().includes("seller") ? "bestseller" : "organic"
        };
      }

      return {
        id: String(idx + 1),
        title,
        price,
        image,
        badge,
        sizes,
        defaultSize: sizes[0] || "500g",
        hasWhatsApp,
        href
      };
    });
  }

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const renderProductCard = (product: typeof products[0]) => {
    const selectedSize = selectedSizes[product.id] || product.defaultSize;

    return (
      <Box className='product_card'>
        <Box className='product_imgBox'>
          {product.badge && (
            <Box className={`product_badge badge_${product.badge.type}`}>
              {product.badge.text}
            </Box>
          )}
          <Link href={product.href}>
            <Image
              src={product.image}
              alt={product.title}
              width={500}
              height={500}
            />
          </Link>
        </Box>

        <Link href={product.href} style={{ textDecoration: 'none' }}>
          <Typography variant='h3' className='product_title'>
            {product.title}
          </Typography>
        </Link>

        <Typography variant='h4' className='product_price'>
          {product.price}
        </Typography>

        <Box className='product_sizes'>
          {product.sizes.map((size) => (
            <button
              key={size}
              type='button'
              onClick={() => handleSizeChange(product.id, size)}
              className={`size_btn ${selectedSize === size ? 'selected' : ''}`}
            >
              {size}
            </button>
          ))}
        </Box>

        <Box className='card_buttons'>
          <Button
            variant='contained'
            className='add_cart_btn'
            startIcon={<ShopingBagIcon />}
            disableRipple
          >
            Add to Cart
          </Button>
          <Button
            variant='contained'
            className='whatsapp_btn'
            startIcon={<WhatsAppIcon />}
            disableRipple
            disabled={!product.hasWhatsApp}
          >
            {product.hasWhatsApp ? 'WhatsApp Order' : 'Not Available'}
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <BestSellingProductsWrapper>
      <Container fixed>
        <Box className='best_selling_header'>
          <Box>
            <Typography className='cmnSmallTitle'>
              {eyebrow}
            </Typography>
            <Typography variant='h2'>
              {heading}
            </Typography>
          </Box>
          <Link href={viewAllHref} className='view_all_link'>
            {viewAllLabel}
          </Link>
        </Box>

        {/* Desktop Grid Layout */}
        <Box className='desktop_grid'>
          <Grid container spacing={{lg:2, xs:1.25}}>
            {products.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                {renderProductCard(product)}
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Mobile Splide Slider Layout */}
        <Box className='mobile_slider'>
          <Splide
            options={{
              type: 'Slide',
              perPage: 1,
              gap: '16px',
              arrows: false,
              pagination: true,
              breakpoints: {
                480: {
                  perPage: 1,
                  gap: '12px',
                }
              }
            }}
          >
            {products.map((product) => (
              <SplideSlide key={product.id}>
                {renderProductCard(product)}
              </SplideSlide>
            ))}
          </Splide>
        </Box>
      </Container>
    </BestSellingProductsWrapper>
  );
}
