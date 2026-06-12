'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { toast } from 'react-hot-toast';

import { assets } from '@/json/assest';
import { GiftsWrapper } from '@/styles/StyledComponents/GiftsWrapper';

export default function GiftsMain() {
  const [email, setEmail] = useState('');

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    toast.success(`Thank you! Inquiry request sent for: ${email}`);
    setEmail('');
  };

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
              Artisanal Gifting
            </Typography>
            <Typography variant="h1" className="section_title">
              Curated with<br />Intention.
            </Typography>
          </Box>
          <Box className="header_right">
            <Typography>
              Discover our message of special celebrations, unique business appreciation, and hand-selected gestures for every occasion. Offering custom options for individual and corporate client projects.
            </Typography>
          </Box>
        </Box>

        {/* The Executive Section */}
        <Box className="executive_header">
          <Typography variant="h2">The Executive</Typography>
          <Link href="/product?category=gifting" className="explore_link">
            Explore The Set 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </Box>

        <Grid container spacing={3} className="executive_grid">
          {/* Large Card: Left (Founder's Reserve) */}
          <Grid size={{ xs: 12, md: 7.5 }}>
            <Box className="large_gift_card">
              <Box className="card_bg_img">
                <Image 
                  src={assets.foundersReserve} 
                  alt="The Founder's Reserve" 
                  fill 
                  priority
                  sizes="(max-width: 900px) 100vw, 65vw"
                />
              </Box>
              <Box className="card_overlay" />
              <Box className="card_content">
                <Typography className="card_badge">The Signature</Typography>
                <Typography variant="h3">The Founder&apos;s Reserve</Typography>
                <Typography>
                  Handmade wood chest with gourmet dried fruits, chocolate, wildflower honey &amp; olive oil.
                </Typography>
                <Button
                  variant="contained"
                  color="info"
                  disableRipple
                  onClick={() => handleAddToCart("The Founder's Reserve")}
                >
                  Read details
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Stacked Cards: Right */}
          <Grid size={{ xs: 12, md: 4.5 }}>
            <Box className="right_cards_col">
              {/* Card 1: Royal Harvest */}
              <Box className="small_gift_card">
                <Box className="small_card_content">
                  <Typography variant="h3">Royal Harvest</Typography>
                  <Typography>
                    A sampling box of raw honey, medjool dates &amp; handpicked nuts.
                  </Typography>
                  <Typography 
                    onClick={() => handleAddToCart("Royal Harvest")}
                    className="small_card_link"
                  >
                    View details
                  </Typography>
                </Box>
                <Box className="small_card_img">
                  <Image 
                    src={assets.royalHarvest} 
                    alt="Royal Harvest" 
                    fill 
                    sizes="(max-width: 900px) 100vw, 20vw"
                  />
                </Box>
              </Box>

              {/* Card 2: The Tea Botanical */}
              <Box className="small_gift_card dark_bg">
                <Box className="small_card_content">
                  <Typography variant="h3">The Tea Botanical</Typography>
                  <Typography>
                    Loose leaf organic herbal tea selection with handmade tea infuser.
                  </Typography>
                  <Typography 
                    onClick={() => handleAddToCart("The Tea Botanical")}
                    className="small_card_link"
                  >
                    View details
                  </Typography>
                </Box>
                <Box className="small_card_img">
                  <Image 
                    src={assets.teaBotanical} 
                    alt="The Tea Botanical" 
                    fill 
                    sizes="(max-width: 900px) 100vw, 20vw"
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Custom Chest Banner Section */}
        <Box className="custom_chest_banner">
          <Box className="banner_img_overlay">
            <Image 
              src={assets.customChestBg} 
              alt="Build your own Custom Chest" 
              fill 
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </Box>
          <Box className="banner_content">
            <Typography className="banner_subtitle">Made For You</Typography>
            <Typography variant="h2">
              Build your own <span>Custom Chest.</span>
            </Typography>
            <Typography>
              Select what fits, select the size, choose from our premium chest selections. Share history, start a custom basket for individual gifts.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              disableRipple
              component={Link}
              href="/categories"
              endIcon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              }
            >
              Start building
            </Button>
          </Box>
        </Box>

        {/* Collections Split Layout */}
        <Grid container spacing={6} className="collections_grid">
          {/* Left Column: The Heritage */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h2" className="column_header">The Heritage</Typography>
            <Box className="column_cards">
              
              {/* Product 1: Old Orchard Classic */}
              <Box className="product_card" component="div" style={{ cursor: 'pointer' }} onClick={() => handleAddToCart("Old Orchard Classic")}>
                <Box className="product_img_box">
                  <Image 
                    src={assets.oldOrchardClassic} 
                    alt="Old Orchard Classic" 
                    fill 
                    sizes="(max-width: 900px) 100vw, 45vw"
                  />
                </Box>
                <Typography variant="h3" className="product_title">Old Orchard Classic</Typography>
                <Typography className="product_desc">Heritage cider, heirloom apples &amp; seasonal fruit.</Typography>
                <Typography className="product_price">$110.00</Typography>
              </Box>

              {/* Product 2: The Orchard Spa */}
              <Box className="product_card" component="div" style={{ cursor: 'pointer' }} onClick={() => handleAddToCart("The Orchard Spa")}>
                <Box className="product_img_box">
                  <Image 
                    src={assets.orchardSpa} 
                    alt="The Orchard Spa" 
                    fill 
                    sizes="(max-width: 900px) 100vw, 45vw"
                  />
                </Box>
                <Typography variant="h3" className="product_title">The Orchard Spa</Typography>
                <Typography className="product_desc">Botanical body mist, lavender oil &amp; organic tea.</Typography>
                <Typography className="product_price">$75.00</Typography>
              </Box>

            </Box>
          </Grid>

          {/* Right Column: The Seasonal */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h2" className="column_header">The Seasonal</Typography>
            <Box className="column_cards">

              {/* Product 1: Winter Solstice */}
              <Box className="product_card" component="div" style={{ cursor: 'pointer' }} onClick={() => handleAddToCart("Winter Solstice")}>
                <Box className="product_img_box">
                  <Image 
                    src={assets.winterSolstice} 
                    alt="Winter Solstice" 
                    fill 
                    sizes="(max-width: 900px) 100vw, 45vw"
                  />
                </Box>
                <Typography variant="h3" className="product_title">Winter Solstice</Typography>
                <Typography className="product_desc">Spiced honey, dark chocolate &amp; hand-poured candle.</Typography>
                <Typography className="product_price">$120.00</Typography>
              </Box>

              {/* Product 2: The Morning Harvest */}
              <Box className="product_card" component="div" style={{ cursor: 'pointer' }} onClick={() => handleAddToCart("The Morning Harvest")}>
                <Box className="product_img_box">
                  <Image 
                    src={assets.morningHarvest} 
                    alt="The Morning Harvest" 
                    fill 
                    sizes="(max-width: 900px) 100vw, 45vw"
                  />
                </Box>
                <Typography variant="h3" className="product_title">The Morning Harvest</Typography>
                <Typography className="product_desc">Blueberry jam, wildflower honey &amp; signature blend.</Typography>
                <Typography className="product_price">$95.00</Typography>
              </Box>

            </Box>
          </Grid>
        </Grid>

        {/* Gift Concierge Inquiry Section */}
        <Box className="concierge_section">
          <Box className="concierge_card">
            <Typography variant="h2">Gift Concierge</Typography>
            <Typography>
              Need help sending gifts for your team or event? Our concierge service provides personalized guidance to curate the perfect gift set.
            </Typography>
            <form className="inquiry_form" onSubmit={handleInquirySubmit}>
              <input 
                type="email" 
                placeholder="Your Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">
                Inquire
              </button>
            </form>
          </Box>
        </Box>

      </Container>
    </GiftsWrapper>
  );
}
