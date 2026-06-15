"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { mapApiProductToUi } from "@/services/productService";

const dietaryOptions = ["Organic", "Gluten-Free", "Raw"];

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
  const [selectedSize, setSelectedSize] = useState(product.defaultSize);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const price = product.sizePrices[selectedSize];

  return (
    <Box className="product_card">
      <Box className="product_img_box">
        {product.badge && (
          <Box
            className={`card_badge ${product.badge === "ORGANIC" ? "badge_organic" : "badge_bestseller"}`}
          >
            {product.badge}
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
        <Link href={`/product/${product.id}`} style={{ display: "block", width: "100%", height: "100%" }}>
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
          />
        </Link>
      </Box>
      <Box className="card_title_row">
        <Link href={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
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
    if (!categoriesData?.data) return [];
    return categoriesData.data.map(cat => cat.name);
  }, [categoriesData]);

  const productsList = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(mapApiProductToUi);
  }, [data]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([5, 100]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Premium First");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterBox, setMobileFilterBox] = useState(false);
  const handleFilterBoxToggle = () => {
    setMobileFilterBox(!mobileFilterBox);
  };
  const itemsPerPage = 6;

  // Toggle Category
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    setCurrentPage(1);
  };

  // Toggle Dietary Tags
  const handleDietaryToggle = (dietary: string) => {
    setSelectedDietary((prev) =>
      prev.includes(dietary)
        ? prev.filter((d) => d !== dietary)
        : [...prev, dietary],
    );
    setCurrentPage(1);
  };

  // Inquiry WhatsApp Link Generator
  const handleWhatsAppInquiry = (product: ProductItem, size: string) => {
    const text = `Hi, I am interested in purchasing ${product.name} (${size}) from your Dry Fruit Collections.`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/+1234567890?text=${encodedText}`, "_blank");
  };

  // Add to Cart logger
  const handleAddToCart = (
    product: ProductItem,
    size: string,
    price: number,
  ) => {
    alert(`Added ${product.name} (${size}) to cart at $${price.toFixed(2)}!`);
  };

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    let result = productsList;

    // Filter by Categories
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Filter by Dietary
    if (selectedDietary.length > 0) {
      result = result.filter((p) =>
        selectedDietary.every((d) => p.dietary.includes(d)),
      );
    }

    // Filter by Price range (evaluating the default size price)
    result = result.filter((p) => {
      const defaultPrice = p.sizePrices[p.defaultSize];
      return defaultPrice >= priceRange[0] && defaultPrice <= priceRange[1];
    });

    // Sorting
    if (sortBy === "Premium First") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Price: Low to High") {
      result = [...result].sort(
        (a, b) => a.sizePrices[a.defaultSize] - b.sizePrices[b.defaultSize],
      );
    } else if (sortBy === "Price: High to Low") {
      result = [...result].sort(
        (a, b) => b.sizePrices[b.defaultSize] - a.sizePrices[a.defaultSize],
      );
    } else if (sortBy === "Name: A-Z") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [productsList, selectedCategories, selectedDietary, priceRange, sortBy]);

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

        <Grid container spacing={{lg:4, xs:0}}>
          {/* Sidebar Filters */}
          <Grid size={{ xs: 12, lg: 3 }}>
            <Box className={mobileFilterBox ?'sidebar_container active':"sidebar_container"}>
              {/* Category Filter */}
              <IconButton disableRipple className="closeBtn" onClick={handleFilterBoxToggle}><CloseIcon/></IconButton>
              <Box className="filter_section">
                <Typography className="filter_title">Categories</Typography>
                <Box className="category_list">
                  {categoryOptions.map((cat) => (
                    <label className="category_checkbox_label" key={cat}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
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
                    min={5}
                    max={100}
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
                      ${priceRange[1] === 100 ? "$100+" : `$${priceRange[1]}`}
                    </span>
                  </Box>
                </Box>
              </Box>

              {/* Dietary Filter */}
              <Box className="filter_section">
                <Typography className="filter_title">Dietary</Typography>
                <Box className="dietary_chips_container">
                  {dietaryOptions.map((diet) => {
                    const isActive = selectedDietary.includes(diet);
                    return (
                      <button
                        key={diet}
                        className={`dietary_chip ${isActive ? "active" : ""}`}
                        onClick={() => handleDietaryToggle(diet)}
                      >
                        {diet}
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
              <Box sx={{ py: 8, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  No products found matching your active filter choices.
                </Typography>
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
