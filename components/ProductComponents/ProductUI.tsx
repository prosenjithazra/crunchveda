"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Typography,
  Slider,
  Select,
  MenuItem,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ProductUIWrapper } from "@/styles/StyledComponents/ProductUIWrapper";
import CartIcon from "@/ui/Icons/CartIcon";
import WhatsAppIcon from "@/ui/Icons/WhatsAppIcon";
import FilterBtnIcon from "@/ui/Icons/FilterBtnIcon";
import HeartBtnIcon from "@/ui/Icons/HeartBtnIcon";
import CloseIcon from '@mui/icons-material/Close';
import { DryFruitProduct as ProductItem } from "@/json/mock/dryFruits";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { mapApiProductToUi, getBadgeInfo } from "@/services/productService";
import { cartService } from "@/services/cartService";
import { toast } from "react-hot-toast";

const badgeOptions = ["Organic", "Best Seller", "New Launch", "Top Rated"];

function ProductCard({
  product,
  onAddToCart,
  onWhatsAppInquiry,
}: {
  product: ProductItem;
  onAddToCart: (p: ProductItem, size: string, price: number) => void;
  onWhatsAppInquiry: (p: ProductItem, size: string) => void;
}) {
  const sizes = Object.keys(product.sizePrices);
  // Ensure selectedSize is always a valid key; fall back to first available size
  const validDefaultSize = sizes.includes(product.defaultSize)
    ? product.defaultSize
    : sizes[0] ?? "";
  const [selectedSize, setSelectedSize] = useState(validDefaultSize);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Safely get price — fall back to first value if selectedSize isn't in map
  const price = product.sizePrices[selectedSize] ?? Object.values(product.sizePrices)[0] ?? 0;


  const badgeInfo = getBadgeInfo(product.badge);

  return (
    <Box className="product_card">
      <Box className="product_img_box">
        {badgeInfo && (
          <Box
            className={`card_badge badge_${badgeInfo.type}`}
          >
            {badgeInfo.text}
          </Box>
        )}
        <button
          className={`wishlist_btn${isWishlisted ? " wishlisted" : ""}`}
          onClick={() => setIsWishlisted((prev) => !prev)}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <HeartBtnIcon />
        </button>
        <Link href={`/products/${product.id}`} style={{ display: "block", width: "100%", height: "100%" }}>
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
          />
        </Link>
      </Box>
      <Box className="card_title_row">
        <Link href={`/products/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <Typography variant="h3" className="card_title">
            {product.name}
          </Typography>
        </Link>
        <Box className="card_rating">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span>{product.rating}</span>
        </Box>
      </Box>
      <Typography variant="body2" className="card_desc">
        {product.description}
      </Typography>

      {product.stock !== undefined && product.stock > 0 && product.stock < 10 && (
        <Typography className="limited_stock_label" sx={{ color: "error.main", fontSize: "11px", fontWeight: 600, mt: 0.5, mb: 0.5 }}>
          Order Soon – Limited Quantity Left
        </Typography>
      )}

      <Box className="card_size_row">
        {sizes.map((size) => (
          <button
            key={size}
            className={`size_pill ${selectedSize === size ? "active" : ""}`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </Box>

      <Box className="card_footer_row">
        <Box className="card_price">${price.toFixed(2)}</Box>
        <Box className="card_actions">
          <button
            className="action_btn btn_cart"
            onClick={() => onAddToCart(product, selectedSize, price)}
            title="Add to Cart"
          >
            <CartIcon />
          </button>
          <button
            className="action_btn btn_whatsapp"
            onClick={() => onWhatsAppInquiry(product, selectedSize)}
            title="Inquire on WhatsApp"
          >
            <WhatsAppIcon />
          </button>
        </Box>
      </Box>
    </Box>
  );
}

export default function ProductUI() {
  const { data, isLoading } = useProducts({ limit: 100 });
  const { data: categoriesData } = useCategories();

  const categoryOptions = useMemo(() => {
    const list = Array.isArray(categoriesData?.data)
      ? categoriesData.data
      : ((categoriesData?.data as any)?.categories || []);
    return list.map((cat: any) => cat.name);
  }, [categoriesData]);

  const productsList = useMemo(() => {
    if (!data?.data) return [];
    const categoriesList = Array.isArray(categoriesData?.data)
      ? categoriesData.data
      : ((categoriesData?.data as any)?.categories || []);

    return data.data.map((apiProd) => {
      const mapped = mapApiProductToUi(apiProd);
      // Resolve category ID/string to the actual category name if it was not populated
      const foundCat = categoriesList.find(
        (c: any) =>
          c._id === mapped.category ||
          c.name.toLowerCase() === mapped.category.toLowerCase()
      );
      if (foundCat) {
        mapped.category = foundCat.name;
      }
      return mapped;
    });
  }, [data, categoriesData]);

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPriceLimit, setMaxPriceLimit] = useState<number>(2000);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Premium First");

  useEffect(() => {
    if (productsList.length > 0) {
      const getPrice = (p: ProductItem) =>
        p.sizePrices[p.defaultSize] ?? Object.values(p.sizePrices)[0] ?? 0;
      const maxVal = Math.max(...productsList.map(getPrice), 100);
      const calculatedMax = Math.ceil(maxVal / 100) * 100;
      setMaxPriceLimit(calculatedMax);
      setPriceRange((prev) => {
        if (prev[1] === 2000 || prev[1] > calculatedMax || prev[0] === 5) {
          return [0, calculatedMax];
        }
        return prev;
      });
    }
  }, [productsList]);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    } else {
      setSelectedCategories([]);
    }
  }, [categoryParam]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterBox, setMobileFilterBox] = useState(false);
  const handleFilterBoxToggle = () => {
    setMobileFilterBox(!mobileFilterBox);
  };
  useEffect(() => {
    if (mobileFilterBox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFilterBox]);

  const itemsPerPage = 6;

  // Toggle Category
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.some((c) => c.toLowerCase() === category.toLowerCase())
        ? prev.filter((c) => c.toLowerCase() !== category.toLowerCase())
        : [...prev, category],
    );
    setCurrentPage(1);
  };

  // Toggle Badge Tags
  const handleBadgeToggle = (badge: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badge)
        ? prev.filter((b) => b !== badge)
        : [...prev, badge],
    );
    setCurrentPage(1);
  };

  // Inquiry WhatsApp Link Generator
  const handleWhatsAppInquiry = (product: ProductItem, size: string) => {
    const text = `Hi, I am interested in purchasing ${product.name} (${size}) from your Dry Fruit Collections.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/+1234567890?text=${encodedText}`, "_blank");
  };

  // Add to Cart handler
  const handleAddToCart = async (
    product: ProductItem,
    size: string,
    price: number,
  ) => {
    try {
      const currentCart = await cartService.getCart();
      const existing = currentCart.find(
        (item) => item.id === product.id && item.size === size
      );
      const existingQty = existing ? existing.quantity : 0;
      const newQty = existingQty + 1;

      const updatedQty = await cartService.updateItem(product.id, newQty, size, price);

      let updatedCart = [...currentCart];
      if (existing) {
        updatedCart = currentCart.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: updatedQty }
            : item
        );
      } else {
        updatedCart.push({
          id: product.id,
          name: product.name,
          badge: product.badge || "Organic Collection",
          price,
          quantity: updatedQty,
          image: product.image || "/assets/images/placeholder.jpg",
          size,
        });
      }
      cartService.saveLocalFallback(updatedCart);

      toast.success(`Added ${product.name} (${size}) to cart!`);
    } catch (e) {
      toast.error("Failed to add product to cart");
    }
  };

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    let result = productsList;

    // Filter by Categories (case-insensitive match against category name)
    if (selectedCategories.length > 0) {
      result = result.filter((p) =>
        selectedCategories.some(
          (c) => c.toLowerCase() === p.category.toLowerCase()
        )
      );
    }

    // Filter by Badges
    if (selectedBadges.length > 0) {
      result = result.filter((p) => {
        if (!p.badge) return false;
        const info = getBadgeInfo(p.badge);
        if (!info) return false;
        return selectedBadges.some(
          (b) => b.toLowerCase() === info.text.toLowerCase()
        );
      });
    }

    // Safe price getter — fall back to first available price
    const getPrice = (p: ProductItem) =>
      p.sizePrices[p.defaultSize] ?? Object.values(p.sizePrices)[0] ?? 0;

    // Filter by Price range
    result = result.filter((p) => {
      const defaultPrice = getPrice(p);
      return defaultPrice >= priceRange[0] && defaultPrice <= priceRange[1];
    });

    // Sorting
    if (sortBy === "Premium First") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Price: Low to High") {
      result = [...result].sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sortBy === "Price: High to Low") {
      result = [...result].sort((a, b) => getPrice(b) - getPrice(a));
    } else if (sortBy === "Name: A-Z") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [productsList, selectedCategories, selectedBadges, priceRange, sortBy]);

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <ProductUIWrapper>
      <Container fixed>
        {/* Breadcrumb */}
        <Box className="breadcrumb_box">
          <Link href="/">Home</Link>
          <span>&gt;</span>
          <span>Collections</span>
        </Box>

        {/* Header Title */}
        <Box className="collections_header">
          <Typography variant="h1">Dry Fruit Collections</Typography>
          <Typography variant="body1">
            Artisanal selections sourced from the finest orchards globally. Each
            harvest is hand-picked, ensuring peak nutritional density and
            superior flavor profiles.
          </Typography>
        </Box>

        {/* Sidebar Overlay */}
        <Box
          className={`sidebar_overlay${mobileFilterBox ? " active" : ""}`}
          onClick={handleFilterBoxToggle}
        />

        <Grid container spacing={{lg:4, xs:0}}>
          {/* Sidebar Filters */}
          <Grid size={{ xs: 12, lg: 3 }}>
            <Box className={mobileFilterBox ?'sidebar_container active':"sidebar_container"}>
              {/* Category Filter */}
              <IconButton disableRipple className="closeBtn" onClick={handleFilterBoxToggle}><CloseIcon/></IconButton>
              <Box className="filter_section">
                <Typography className="filter_title">Categories</Typography>
                <Box className="category_list">
                  {categoryOptions.map((cat: any) => (
                    <label className="category_checkbox_label" key={cat}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.some((c) => c.toLowerCase() === cat.toLowerCase())}
                        onChange={() => handleCategoryToggle(cat)}
                      />
                      {cat}
                    </label>
                  ))}
                </Box>
              </Box>

              {/* Price Range Filter */}
              <Box className="filter_section">
                <Typography className="filter_title">Price Range</Typography>
                <Box className="price_slider_container">
                  <Slider
                    value={priceRange}
                    onChange={(_, val) =>
                      setPriceRange(val as [number, number])
                    }
                    valueLabelDisplay="auto"
                    min={0}
                    max={maxPriceLimit}
                    sx={{
                      color: "primary.main",
                      "& .MuiSlider-thumb": {
                        backgroundColor: "primary.dark",
                      },
                      "& .MuiSlider-track": {
                        backgroundColor: "primary.main",
                      },
                      "& .MuiSlider-rail": {
                        color: "grey.300",
                      },
                    }}
                  />
                  <Box className="price_labels">
                    <span>${priceRange[0]}</span>
                    <span>
                      {priceRange[1] === maxPriceLimit ? `$${maxPriceLimit}+` : `$${priceRange[1]}`}
                    </span>
                  </Box>
                </Box>
              </Box>

              {/* Badges Filter */}
              <Box className="filter_section">
                <Typography className="filter_title">Badges</Typography>
                <Box className="dietary_chips_container">
                  {badgeOptions.map((badge) => {
                    const isActive = selectedBadges.includes(badge);
                    return (
                      <button
                        key={badge}
                        className={`dietary_chip ${isActive ? "active" : ""}`}
                        onClick={() => handleBadgeToggle(badge)}
                      >
                        {badge}
                      </button>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Main Grid Content */}
          <Grid size={{ xs: 12, lg: 9 }}>
            {/* Listing Header Options */}
            <Box className="filerIcon_wrapper">
              <Button
                variant="contained"
                color="primary"
                disableRipple
                startIcon={<FilterBtnIcon />}
                onClick={handleFilterBoxToggle}
              >
                Filter
              </Button>
            </Box>
            <Box className="listing_header">
              <span className="results_count">
                Showing {filteredProducts.length} result
                {filteredProducts.length !== 1 ? "s" : ""}
              </span>
              <Box className="sort_select_container">
                <span>Sort by:</span>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as string)}
                  variant="outlined"
                  size="small"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    backgroundColor: "common.white",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "grey.300",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <MenuItem value="Premium First">Premium First</MenuItem>
                  <MenuItem value="Price: Low to High">
                    Price: Low to High
                  </MenuItem>
                  <MenuItem value="Price: High to Low">
                    Price: High to Low
                  </MenuItem>
                  <MenuItem value="Name: A-Z">Name: A-Z</MenuItem>
                </Select>
              </Box>
            </Box>

            {/* Products Grid */}
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : paginatedProducts.length > 0 ? (
              <Box className="products_grid">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onWhatsAppInquiry={handleWhatsAppInquiry}
                  />
                ))}
              </Box>
            ) : (
              <Box className="no_results_box">
                <Box className="icon_container">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* Back rim inside the box */}
                    <path
                      d="M12 28 L32 18 L52 28"
                      strokeDasharray="2 2"
                      opacity="0.4"
                    />
                    
                    {/* Sparkles / floating particles */}
                    <circle cx="24" cy="30" r="2" className="sparkle p1" />
                    <circle cx="40" cy="24" r="1.5" className="sparkle p2" />
                    <circle cx="32" cy="20" r="2.5" className="sparkle p3" />

                    {/* Floating lid */}
                    <g className="box_lid_group">
                      <path
                        d="M12 20 L32 10 L52 20 L32 30 Z"
                        fill="rgba(32, 53, 39, 0.08)"
                      />
                    </g>

                    {/* Box body */}
                    <path d="M12 28 V48 L32 58 V38" />
                    <path d="M52 28 V48 L32 58" strokeLinecap="round" />
                    <path d="M12 28 L32 38 L52 28" />

                    {/* Magnifier searching */}
                    <g className="magnifier_group">
                      <circle cx="44" cy="40" r="7" fill="white" stroke="currentColor" strokeWidth="2.5" />
                      <line x1="49" y1="45" x2="56" y2="52" stroke="currentColor" strokeWidth="3" />
                      <path d="M41 38 A3 3 0 0 1 45 35" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </g>
                  </svg>
                </Box>
                <Typography variant="h3" className="no_results_title">
                  No Products Found
                </Typography>
                <Typography variant="body1" className="no_results_desc">
                  {"We couldn't find any products matching your active filter choices. Try adjusting your filters or resetting them."}
                </Typography>
                {(selectedCategories.length > 0 || selectedBadges.length > 0 || priceRange[0] !== 0 || priceRange[1] !== maxPriceLimit) && (
                  <button
                    className="clear_filters_btn"
                    onClick={() => {
                      setSelectedCategories([]);
                      setSelectedBadges([]);
                      setPriceRange([0, maxPriceLimit]);
                      setCurrentPage(1);
                    }}
                  >
                    Reset All Filters
                  </button>
                )}
              </Box>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Box className="pagination_container">
                <button
                  className="page_btn"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`page_btn ${currentPage === page ? "active" : ""}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  className="page_btn"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                >
                  &gt;
                </button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </ProductUIWrapper>
  );
}
