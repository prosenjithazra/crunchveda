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
import { useBestsellers } from '@/hooks/useProducts';
import { mapApiProductToUi, getBadgeInfo } from '@/services/productService';
import { BestSellingProductsSkeleton } from '../Loader/SectionSkeletons';
import { toast } from 'react-hot-toast';
import { cartService } from '@/services/cartService';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

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
    href: "/products/jumbo-cashews",
    stock: 10,
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
    href: "/products/california-almonds",
    stock: 10,
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
    href: "/products/walnut-halves",
    stock: 10,
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
    href: "/products/iranian-pistachios",
    stock: 10,
  }
];

export default function BestSellingProducts() {
  const { data: sectionData, isLoading: sectionLoading } = useHomeSection("best-selling");
  const { data: bestsellersData, isLoading: bestsellersLoading } = useBestsellers();
  const router = useRouter();
  const { cartItems } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  if (sectionLoading || bestsellersLoading) return <BestSellingProductsSkeleton />;

  const showSection = sectionData?.content?.showSection ?? true;
  if (!showSection) return null;

  const eyebrow = sectionData?.content?.eyebrow || "CROWD FAVORITES";
  const heading = sectionData?.content?.sectionTitle || sectionData?.content?.heading || "Best Selling Products";
  const viewAllLabel = sectionData?.content?.viewAllLabel || "View All Products";
  const viewAllHref = sectionData?.content?.viewAllHref || "/products";
  const cmsProductsText = sectionData?.content?.products || "";

  // WhatsApp Inquiry Link Generator
  const handleWhatsAppInquiry = (title: string, size: string) => {
    const text = `Hi, I am interested in purchasing ${title} (${size}) from your Best Seller Collections.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/+1234567890?text=${encodedText}`, "_blank");
  };

  // Add to Cart handler
  const handleAddToCart = async (
    productId: string,
    title: string,
    size: string,
    priceVal: number,
    image: string,
    badgeText: string
  ) => {
    try {
      const currentCart = await cartService.getCart();
      const existing = currentCart.find(
        (item) => item.id === productId && item.size === size
      );
      const existingQty = existing ? existing.quantity : 0;
      const newQty = existingQty + 1;

      const updatedQty = await cartService.updateItem(productId, newQty, size, priceVal);

      let updatedCart = [...currentCart];
      if (existing) {
        updatedCart = currentCart.map((item) =>
          item.id === productId && item.size === size
            ? { ...item, quantity: updatedQty }
            : item
        );
      } else {
        updatedCart.push({
          id: productId,
          name: title,
          badge: badgeText || "Organic Selection",
          price: priceVal,
          quantity: updatedQty,
          image: image || "/assets/images/placeholder.jpg",
          size,
        });
      }
      cartService.saveLocalFallback(updatedCart);

      toast.success(`Added ${title} (${size}) to cart!`);
    } catch (e) {
      toast.error("Failed to add product to cart");
    }
  };

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
    sizePrices?: Record<string, number>;
    stock?: number;
  }> = [];

  const sourceProducts = sectionData?.content?.selectedProducts || bestsellersData?.data || [];

  if (sourceProducts.length > 0) {
    products = sourceProducts.map((p: any) => {
      const uiProd = mapApiProductToUi(p);
      const priceVal = uiProd.sizePrices[uiProd.defaultSize] ?? Object.values(uiProd.sizePrices)[0] ?? 0;
      return {
        id: p._id,
        title: uiProd.name,
        price: priceVal ? `₹${priceVal.toFixed(2)}` : "₹0.00",
        image: uiProd.image || assets.cashewsProduct,
        badge: getBadgeInfo(uiProd.badge),
        sizes: Object.keys(uiProd.sizePrices),
        defaultSize: uiProd.defaultSize,
        hasWhatsApp: true,
        href: `/products/${uiProd.id}`,
        sizePrices: uiProd.sizePrices,
        stock: uiProd.stock,
      };
    });
  }

  if (products.length === 0) {
    products = defaultProducts;
  }

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const renderProductCard = (product: typeof products[0]) => {
    const selectedSize = selectedSizes[product.id] || product.defaultSize;
    const priceVal = product.sizePrices ? (product.sizePrices[selectedSize] ?? Object.values(product.sizePrices)[0] ?? 0) : null;
    const formattedPrice = priceVal !== null ? `₹${priceVal.toFixed(2)}` : product.price;
    const isOutOfStock = product.stock !== undefined && product.stock <= 0;
    const isInCart = cartItems.some(
      (item) => item.id === product.id && item.size === selectedSize
    );

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
          {formattedPrice}
        </Typography>

        {product.stock !== undefined && product.stock > 0 && product.stock < 10 && (
          <Typography className='limited_stock_label' sx={{ color: 'error.main', fontSize: '11px', fontWeight: 600, mt: 0.5, mb: 0.5 }}>
            Order Soon – Limited Quantity Left
          </Typography>
        )}

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
          {isInCart ? (
            <Button
              variant='contained'
              className='add_cart_btn'
              sx={{ bgcolor: "#8F5E15", "&:hover": { bgcolor: "#764D0F" } }}
              startIcon={<ShopingBagIcon />}
              onClick={() => router.push("/cart")}
              disableRipple
            >
              Go to Cart
            </Button>
          ) : (
            <Button
              variant='contained'
              className='add_cart_btn'
              startIcon={!isOutOfStock && <ShopingBagIcon />}
              onClick={() => handleAddToCart(product.id, product.title, selectedSize, priceVal || 0, product.image, product.badge?.text || "")}
              disableRipple
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </Button>
          )}
          <Button
            variant='contained'
            className='whatsapp_btn'
            startIcon={<WhatsAppIcon />}
            onClick={() => handleWhatsAppInquiry(product.title, selectedSize)}
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
