/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, Box, Typography } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import { PolicyWrapper } from "@/styles/StyledComponents/PolicyWrapper";
import { assets } from "@/json/assest";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
export default function PrivacyPolicy() {
  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleConciergeInquiry = () => {
    window.open("mailto:concierge@nutriharvest.com?subject=Privacy%20Policy%20Inquiry", "_blank");
  };

  return (
    <PolicyWrapper>
      <Container fixed>
        <Box className="policy_container">
          
          {/* Header Block */}
          <Box className="policy_header">
            <Box className="header_left_block">
              <Typography className="gov_tag">Information Governance</Typography>
              <Typography variant="h1">Privacy Policy</Typography>
              <Typography className="header_desc">
                Your trust is the foundation of our heritage. This policy outlines how NutriHarvest gathers, processes, and protects your information when using our curation platforms and WhatsApp checkout nodes.
              </Typography>
            </Box>
            
            <Box className="effective_date_box">
              <Typography className="date_label">Effective Date</Typography>
              <Typography className="date_val">Oct 2024</Typography>
            </Box>
          </Box>

          {/* Quick Nav Row */}
          <Box className="policy_nav_row">
            <Typography component="a" className="nav_item" onClick={() => handleScrollToSection("data-collection")}>
              <span>01</span> Data Collection
            </Typography>
            <Typography component="a" className="nav_item" onClick={() => handleScrollToSection("cookie-usage")}>
              <span>02</span> Cookie Usage
            </Typography>
            <Typography component="a" className="nav_item" onClick={() => handleScrollToSection("data-sharing")}>
              <span>03</span> Data Sharing
            </Typography>
            <Typography component="a" className="nav_item" onClick={() => handleScrollToSection("data-rights")}>
              <span>04</span> Data Security &amp; Rights
            </Typography>
          </Box>

          {/* Two-Column Split Layout */}
          <Box className="split_layout">
            
            {/* Left Column: Privacy Policy Content */}
            <Box className="doc_main_column">
              
              {/* Section 01: Data Collection */}
              <Box id="data-collection" className="section_block">
                <Box className="section_title_row">
                  <Typography className="section_num">01</Typography>
                  <Typography variant="h2">Data Collection</Typography>
                </Box>
                <Box className="section_body">
                  <Typography>
                    We collect personal coordinates such as name, email, and phone descriptors when you voluntarily subscribe to our harvest lists or inquire about our premium estate provisions. This allows us to keep you updated with seasonal dates and batch drops.
                  </Typography>
                  <Typography>
                    We track order variables like saved items and harvest basket items. This data is utilized solely to format purchase requests, enabling manual transaction coordination when checking out via our custom WhatsApp chat links.
                  </Typography>
                  <Box className="warning_blockquote">
                    <Typography>
                      &ldquo;We strictly safeguard all personal identifiers, orders, and inquiries to ensure absolute confidentiality and trust across our systems.&rdquo;
                    </Typography>
                  </Box>
                  
                  {/* Sub-grid columns */}
                  <Box className="sub_columns_grid">
                    <Box className="sub_col">
                      <Typography variant="h3">Collected Data</Typography>
                      <Typography>
                        We collect name, email, and phone coordinates when you request concierge support or sign up for our seasonal crop reports.
                      </Typography>
                    </Box>
                    <Box className="sub_col">
                      <Typography variant="h3">Usage Metadata</Typography>
                      <Typography>
                        Device and browsing attributes are analyzed to refine page responsiveness and speed up harvest layouts.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Section 02: Cookie Usage */}
              <Box id="cookie-usage" className="section_block">
                <Box className="section_title_row">
                  <Typography className="section_num">02</Typography>
                  <Typography variant="h2">Cookie Usage</Typography>
                </Box>
                <Box className="section_body">
                  <Typography>
                    NutriHarvest utilizes cookies and local browser storage to streamline user selections. By saving key parameters locally, we prevent selections from clearing when you navigate between categories, story paths, and details.
                  </Typography>
                  
                  <Box className="sub_columns_grid">
                    <Box className="sub_col">
                      <Typography variant="h3">Curated Harvests</Typography>
                      <Typography>
                        Local storage preserves your favorited selections across visits so you can manage your wishlist over time.
                      </Typography>
                    </Box>
                    <Box className="sub_col">
                      <Typography variant="h3">Cart Memory</Typography>
                      <Typography>
                        Cookies remember basket items as you browse other pages, ensuring your order compiles perfectly for WhatsApp.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Section 03: Data Sharing */}
              <Box id="data-sharing" className="section_block">
                <Box className="section_title_row">
                  <Typography className="section_num">03</Typography>
                  <Typography variant="h2">Data Sharing</Typography>
                </Box>
                <Box className="section_body">
                  <Typography>
                    We do not rent, sell, or disclose your data to third-party advertising companies or lists brokers. All personal information remains encrypted in our protected data blocks.
                  </Typography>
                  <Typography>
                    We share relevant delivery information only with trusted fulfillment and logistics providers (such as climate-neutral offset transport teams) to complete the physical shipping of your organic harvest crate.
                  </Typography>
                </Box>
              </Box>

              {/* Section 04: Data Security & Rights */}
              <Box id="data-rights" className="section_block">
                <Box className="section_title_row">
                  <Typography className="section_num">04</Typography>
                  <Typography variant="h2">Data Security &amp; Rights</Typography>
                </Box>
                <Box className="section_body">
                  <Typography>
                    Your rights to information governance are respected at NutriHarvest. You can request access to your stored profile data, request corrections, or request deletion of contact options from our customer index.
                  </Typography>
                  <Typography>
                    We maintain secure server databases and audit security parameters regularly to shield personal variables from unauthorized data breaches or exposure.
                  </Typography>
                </Box>
              </Box>

            </Box>

            {/* Right Column: Sidebar */}
            <Box className="doc_sidebar_column">
              
              {/* Card 1: Concierge Questions */}
              <Box className="concierge_card">
                <Typography variant="h3">Questions regarding our terms?</Typography>
                <Typography>
                  Our legal concierge is available to clarify any aspect of our documentation for your peace of mind.
                </Typography>
                <button className="concierge_btn" onClick={handleConciergeInquiry}>
                  Contact Concierge
                </button>
              </Box>

              {/* Card 2: Related Docs links */}
              <Box className="related_docs_card">
                <Typography variant="h3">Related Documents</Typography>
                <Box className="docs_links_list">
                  <Link href="/terms-condition">
                    Terms &amp; Conditions <ArrowForwardIosIcon />
                  </Link>
                  <Link href="#cookie-statement">
                    Cookie Statement <ArrowForwardIosIcon />
                  </Link>
                  <Link href="#accessibility">
                    Accessibility <ArrowForwardIosIcon />
                  </Link>
                </Box>
              </Box>

              {/* Card 3: Image Overlay Card */}
              <Box className="heritage_img_card">
                <Image 
                  src={assets.bestSellerOrchard} 
                  alt="NutriHarvest sunlit orchard hills" 
                  fill 
                  sizes="(max-width: 900px) 100vw, 30vw"
                />
                <Box className="overlay">
                  <Link href="/our-story" className="heritage_card_btn">
                    Estate Heritage
                  </Link>
                </Box>
              </Box>

            </Box>

          </Box>

          {/* Bottom Unrivaled Service Section */}
          <Box className="unrivaled_service_block">
            <Typography variant="h2">Unrivaled Service</Typography>
            <Typography className="service_desc">
              At NutriHarvest, we believe transparency is the foundation of luxury. Should you require further assistance with our documentation, our dedicated team is at your disposal.
            </Typography>
            <Box className="contact_links_row">
              <a href="mailto:concierge@nutriharvest.com" className="contact_item">
                <EmailOutlinedIcon /> concierge@nutriharvest.com
              </a>
              <span className="separator_dot" />
              <a href="tel:18004374824" className="contact_item">
                <PhoneInTalkIcon /> 1.800.HERITAGE
              </a>
            </Box>
          </Box>

        </Box>
      </Container>
    </PolicyWrapper>
  );
}
