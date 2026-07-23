'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { toast } from 'react-hot-toast';

import { assets } from '@/json/assest';
import { GiftsWrapper } from '@/styles/StyledComponents/GiftsWrapper';

export default function GiftsMain() {
  const [banner, setBanner] = useState({
    bannerLabel: 'Artisanal Gifting',
    bannerTitle: 'Curated with\nIntention.',
    bannerDescription: 'Discover our message of special celebrations, unique business appreciation, and hand-selected gestures for every occasion. Offering custom options for individual and corporate client projects.'
  });

  const [giftCollections, setGiftCollections] = useState({
    sectionTitle: "The Executive",
    sectionButtonText: "Explore The Set",
    sectionButtonLink: "/gifts/executive",
    collections: [
      {
        image: assets.foundersReserve,
        label: "THE SIGNATURE",
        title: "The Founder's Reserve",
        description: "Handmade wood chest with gourmet dried fruits, chocolate, wildflower honey & olive oil.",
        buttonText: "Read details",
        buttonLink: "/gifts/founders-reserve",
        _id: "6a4ba83368a084edc873a777"
      },
      {
        image: assets.royalHarvest,
        label: "",
        title: "Royal Harvest",
        description: "A sampling box of raw honey, medjool dates & handpicked nuts.",
        buttonText: "VIEW DETAILS",
        buttonLink: "/gifts/royal-harvest",
        _id: "6a4ba83368a084edc873a778"
      },
      {
        image: assets.teaBotanical,
        label: "",
        title: "The Tea Botanical",
        description: "Loose leaf organic herbal tea selection with handmade tea infuser.",
        buttonText: "VIEW DETAILS",
        buttonLink: "/gifts/tea-botanical",
        _id: "6a4ba83368a084edc873a779"
      }
    ]
  });

  const [customChest, setCustomChest] = useState({
    sectionLabel: "MADE FOR YOU",
    sectionTitle: "Build your own Custom Chest",
    sectionDescription: "Select what fits, select the size, choose from our premium chest selections. Share history, start a custom basket for individual gifts.",
    buttonText: "Start building",
    buttonLink: "/categories",
    backgroundImage: assets.customChestBg
  });

  const [giftProducts, setGiftProducts] = useState({
    categories: [
      {
        categoryTitle: "The Heritage",
        products: [
          {
            image: assets.oldOrchardClassic,
            title: "Old Orchard Classic",
            description: "Heritage cider, heirloom apples & seasonal fruit.",
            price: "₹110.00",
            _id: "6a4bac669970b0ba46cf9ce4"
          },
          {
            image: assets.orchardSpa,
            title: "The Orchard Spa",
            description: "Botanical body mist, lavender oil & organic tea.",
            price: "₹75.00",
            _id: "6a4bac669970b0ba46cf9ce5"
          }
        ],
        _id: "6a4bac669970b0ba46cf9ce3"
      },
      {
        categoryTitle: "The Seasonal",
        products: [
          {
            image: assets.winterSolstice,
            title: "Winter Solstice",
            description: "Spiced honey, dark chocolate & hand-poured candle.",
            price: "₹120.00",
            _id: "6a4bac669970b0ba46cf9ce7"
          },
          {
            image: assets.morningHarvest,
            title: "The Morning Harvest",
            description: "Blueberry jam, wildflower honey & signature blend.",
            price: "₹95.00",
            _id: "6a4bac669970b0ba46cf9ce8"
          }
        ],
        _id: "6a4bac669970b0ba46cf9ce6"
      }
    ]
  });

  React.useEffect(() => {
    fetch('/api/gifts/banner', { cache: 'no-store' })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data?.banner) {
          setBanner(json.data.banner);
        }
      })
      .catch(err => console.error('Failed to load gifts banner:', err));

    fetch('/api/gifts/gift-collections', { cache: 'no-store' })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data?.giftCollections) {
          setGiftCollections(json.data.giftCollections);
        }
      })
      .catch(err => console.error('Failed to load gifts collections:', err));

    fetch('/api/gifts/custom-chest', { cache: 'no-store' })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data?.customChest) {
          setCustomChest(json.data.customChest);
        }
      })
      .catch(err => console.error('Failed to load custom chest:', err));

    Promise.all([
      fetch('/api/gifts/heritage', { cache: 'no-store' }).then(res => res.json()),
      fetch('/api/gifts/seasonal', { cache: 'no-store' }).then(res => res.json())
    ])
      .then(([heritageJson, seasonalJson]) => {
        const categories = [];
        if (heritageJson.success && heritageJson.data?.category) {
          categories.push(heritageJson.data.category);
        } else {
          categories.push({
            categoryTitle: "The Heritage",
            products: []
          });
        }
        if (seasonalJson.success && seasonalJson.data?.category) {
          categories.push(seasonalJson.data.category);
        } else {
          categories.push({
            categoryTitle: "The Seasonal",
            products: []
          });
        }
        setGiftProducts({ categories });
      })
      .catch(err => console.error('Failed to load heritage and seasonal collections:', err));
  }, []);

  const handleAddToCart = (itemName: string) => {
    toast.success(`Added ${itemName} to your harvest basket!`);
  };

  return (
    <GiftsWrapper>
      <Container fixed>
        
        {/* Intro / Header Section */}
        <Box className="header_section">
          <Box className="header_left">
            <Typography className="section_subtitle">
              {banner.bannerLabel}
            </Typography>
            <Typography variant="h1" className="section_title">
              {banner.bannerTitle.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < banner.bannerTitle.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </Typography>
          </Box>
          <Box className="header_right">
            <Typography>
              {banner.bannerDescription}
            </Typography>
          </Box>
        </Box>

        {/* The Executive Section */}
        <Box className="executive_header">
          <Typography variant="h2">{giftCollections.sectionTitle}</Typography>
          <Link href={giftCollections.sectionButtonLink} className="explore_link">
            {giftCollections.sectionButtonText} 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </Box>

        <Grid container spacing={3} className="executive_grid">
          {/* Large Card: Left */}
          {giftCollections.collections[0] && (
            <Grid size={{ xs: 12, md: 7.5 }}>
              <Box className="large_gift_card">
                <Box className="card_bg_img">
                  <Image 
                    src={giftCollections.collections[0].image || assets.foundersReserve} 
                    alt={giftCollections.collections[0].title} 
                    fill 
                    priority
                    sizes="(max-width: 900px) 100vw, 65vw"
                  />
                </Box>
                <Box className="card_overlay" />
                <Box className="card_content">
                  {giftCollections.collections[0].label && (
                    <Typography className="card_badge">{giftCollections.collections[0].label}</Typography>
                  )}
                  <Typography variant="h3">{giftCollections.collections[0].title}</Typography>
                  <Typography>
                    {giftCollections.collections[0].description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="info"
                    disableRipple
                    onClick={() => handleAddToCart(giftCollections.collections[0].title)}
                    component={Link}
                    href={`/gifts/${giftCollections.collections[0].title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}`}
                  >
                    {giftCollections.collections[0].buttonText || "Read details"}
                  </Button>
                </Box>
              </Box>
            </Grid>
          )}

          {/* Stacked Cards: Right */}
          <Grid size={{ xs: 12, md: 4.5 }}>
            <Box className="right_cards_col">
              {giftCollections.collections.slice(1).map((item, index) => (
                <Box key={item._id || index} className={`small_gift_card${index % 2 === 1 ? " dark_bg" : ""}`}>
                  <Box className="small_card_content">
                    {item.label && <Typography className="card_badge">{item.label}</Typography>}
                    <Typography variant="h3">{item.title}</Typography>
                    <Typography>
                      {item.description}
                    </Typography>
                    <Typography 
                      onClick={() => handleAddToCart(item.title)}
                      className="small_card_link"
                      component={Link}
                      href={`/gifts/${item.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}`}
                    >
                      {item.buttonText || "View details"}
                    </Typography>
                  </Box>
                  {item.image && (
                    <Box className="small_card_img">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        sizes="(max-width: 900px) 100vw, 20vw"
                      />
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Custom Chest Banner Section */}
        <Box className="custom_chest_banner">
          <Box className="banner_img_overlay">
            <Image 
              src={customChest.backgroundImage || assets.customChestBg} 
              alt={customChest.sectionTitle} 
              fill 
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </Box>
          <Box className="banner_content">
            <Typography className="banner_subtitle">{customChest.sectionLabel}</Typography>
            <Typography variant="h2">
              {customChest.sectionTitle}
            </Typography>
            <Typography>
              {customChest.sectionDescription}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              disableRipple
              component={Link}
              href={customChest.buttonLink || "/categories"}
              endIcon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              }
            >
              {customChest.buttonText}
            </Button>
          </Box>
        </Box>

        {/* Collections Split Layout */}
        <Grid container spacing={6} className="collections_grid">
          {giftProducts.categories.map((category, catIdx) => (
            <Grid size={{ xs: 12, md: 6 }} key={category._id || catIdx}>
              <Typography variant="h2" className="column_header">{category.categoryTitle}</Typography>
              <Box className="column_cards">
                {(category.products || []).map((product, prodIdx) => (
                  <Box 
                    key={product._id || prodIdx} 
                    className="product_card" 
                    component="div" 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => handleAddToCart(product.title)}
                  >
                    <Box className="product_img_box">
                      <Image 
                        src={product.image || (catIdx === 0 ? (prodIdx === 0 ? assets.oldOrchardClassic : assets.orchardSpa) : (prodIdx === 0 ? assets.winterSolstice : assets.morningHarvest))} 
                        alt={product.title} 
                        fill 
                        sizes="(max-width: 900px) 100vw, 45vw"
                      />
                    </Box>
                    <Typography variant="h3" className="product_title">{product.title}</Typography>
                    <Typography className="product_desc">{product.description}</Typography>
                    <Typography className="product_price">₹{product.price}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

      </Container>
    </GiftsWrapper>
  );
}
