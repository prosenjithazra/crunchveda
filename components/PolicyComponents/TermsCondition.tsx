/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, Box, Typography } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';

import { PolicyWrapper } from "@/styles/StyledComponents/PolicyWrapper";
import { assets } from "@/json/assest";

export default function TermsCondition() {
  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleConciergeInquiry = () => {
    window.open("mailto:concierge@crunchveda.com?subject=Legal%20Terms%20Inquiry", "_blank");
  };

  return (
    <PolicyWrapper>
      <Container fixed>
        <Box className="policy_container">
          
          {/* Header Block */}
          <Box className="policy_header">
            <Box className="header_left_block">
              <Typography className="gov_tag">Information Governance</Typography>
              <Typography variant="h1">Legal Documentation</Typography>
              <Typography className="header_desc">
                Welcome to Crunchveda. These terms outline the rules and regulations for the use of our high-end artisanal estate and provisions platform. By accessing this website, we assume you accept these terms and conditions in full.
              </Typography>
            </Box>
            
            <Box className="effective_date_box">
              <Typography className="date_label">Effective Date</Typography>
              <Typography className="date_val">Oct 2024</Typography>
            </Box>
          </Box>

          {/* Quick Nav Row */}
          <Box className="policy_nav_row">
            <Typography component="a" className="nav_item" onClick={() => handleScrollToSection("use-of-site")}>
              <span>01</span> Use of Site
            </Typography>
            <Typography component="a" className="nav_item" onClick={() => handleScrollToSection("product-authenticity")}>
              <span>02</span> Product Authenticity
            </Typography>
            <Typography component="a" className="nav_item" onClick={() => handleScrollToSection("intellectual-property")}>
              <span>03</span> Intellectual Property
            </Typography>
            <Typography component="a" className="nav_item" onClick={() => handleScrollToSection("liability")}>
              <span>04</span> Liability
            </Typography>
          </Box>

          {/* Two-Column Split Layout */}
          <Box className="split_layout">
            
            {/* Left Column: Documentation Content */}
            <Box className="doc_main_column">
              
              {/* Section 01: Use of Site */}
              <Box id="use-of-site" className="section_block">
                <Box className="section_title_row">
                  <Typography className="section_num">01</Typography>
                  <Typography variant="h2">Use of Site</Typography>
                </Box>
                <Box className="section_body">
                  <Typography>
                    By engaging with the Crunchveda digital environment, you warrant that you are at least 18 years of age or are accessing the site under the supervision of a parent or guardian. We grant you a limited, revocable, and non-exclusive license to access and make personal use of this site.
                  </Typography>
                  <Typography>
                    You are strictly prohibited from reproducing, duplicating, copying, copying, selling, or otherwise exploiting our digital estate for any commercial purpose without express written consent from our legal department. Any unauthorized use terminates the permission or license granted by Crunchveda immediately.
                  </Typography>
                  <Box className="warning_blockquote">
                    <Typography>
                      &ldquo;We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion, including, without limitation, if we believe that customer conduct violates applicable law or is harmful to the interests of Crunchveda.&rdquo;
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Section 02: Product Authenticity */}
              <Box id="product-authenticity" className="section_block">
                <Box className="section_title_row">
                  <Typography className="section_num">02</Typography>
                  <Typography variant="h2">Product Authenticity</Typography>
                </Box>
                <Box className="section_body">
                  <Typography>
                    Crunchveda is committed to the highest standards of provenance and artisanal integrity. All descriptions, images, and references to products or services on the site are subject to change without notice. We make every effort to display as accurately as possible the colors and features of our organic provisions.
                  </Typography>
                  
                  {/* Sub-grid columns */}
                  <Box className="sub_columns_grid">
                    <Box className="sub_col">
                      <Typography variant="h3">Artisanal Variations</Typography>
                      <Typography>
                        Due to the organic nature of our products, slight variations in color, texture, and flavor profiles are expected and celebrated as marks of authenticity.
                      </Typography>
                    </Box>
                    <Box className="sub_col">
                      <Typography variant="h3">Traceability</Typography>
                      <Typography>
                        Each batch is tracked via our proprietary blockchain-enabled ledger to ensure the path from estate to table is fully documented.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Section 03: Intellectual Property */}
              <Box id="intellectual-property" className="section_block">
                <Box className="section_title_row">
                  <Typography className="section_num">03</Typography>
                  <Typography variant="h2">Intellectual Property</Typography>
                </Box>
                <Box className="section_body">
                  <Typography>
                    All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Crunchveda or its content suppliers and protected by international copyright laws.
                  </Typography>
                  <Typography>
                    The Crunchveda trademark and trade dress may not be used in connection with any product or service that is not Crunchveda&apos;s, in any manner that is likely to cause confusion among customers, or in any manner that disparages or discredits the brand.
                  </Typography>
                </Box>
              </Box>

              {/* Section 04: Liability */}
              <Box id="liability" className="section_block">
                <Box className="section_title_row">
                  <Typography className="section_num">04</Typography>
                  <Typography variant="h2">Liability</Typography>
                </Box>
                <Box className="section_body">
                  <Typography>
                    Crunchveda provides the site on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We make no representations or warranties of any kind, express or implied, as to the operation of the site or the information, content, materials, or products included.
                  </Typography>
                  <Typography>
                    To the full extent permissible by applicable law, Crunchveda disclaims all warranties, express or implied. Crunchveda will not be liable for any damages of any kind arising from the use of this site, including, but not limited to direct, indirect, incidental, punitive, and consequential damages.
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
                  <Link href="/privacy-policy">
                    Privacy Policy <ArrowForwardIosIcon />
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
                  alt="Crunchveda sunlit orchard hills" 
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
              At Crunchveda, we believe transparency is the foundation of luxury. Should you require further assistance with our documentation, our dedicated team is at your disposal.
            </Typography>
            <Box className="contact_links_row">
              <a href="mailto:concierge@crunchveda.com" className="contact_item">
                <EmailOutlinedIcon /> concierge@crunchveda.com
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
