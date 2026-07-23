'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import { HelpSupportWrapper } from '@/styles/StyledComponents/HelpSupportWrapper';

interface FAQItem {
  id: string;
  category: 'Logistics' | 'Authenticity' | 'Returns' | 'Product' | 'Orders';
  question: string;
  answer: string;
}

const staticFaqs: FAQItem[] = [
  // ── Logistics ──
  {
    id: 'log-1',
    category: 'Logistics',
    question: 'How are shipments dispatched and tracked?',
    answer:
      'All Crunchveda orders are processed within 24 hours of confirmation. Orders are dispatched in temperature-controlled, climate-neutral protective packaging. Tracking details with real-time updates are dispatched via SMS and email immediately upon shipment.',
  },
  {
    id: 'log-2',
    category: 'Logistics',
    question: 'What are the delivery timelines across India and overseas?',
    answer:
      'Domestic metro express deliveries arrive within 2–4 business days, while tier 2/3 locations take 4–6 business days. International concierge shipments typically arrive within 5–9 business days with customs clearance assistance.',
  },
  {
    id: 'log-3',
    category: 'Logistics',
    question: 'Is climate-neutral and eco-friendly packaging used?',
    answer:
      'Yes, 100% of our shipment boxes, sealing tapes, and glass/jar cushioning are crafted from biodegradable, recyclable materials. Our logistics partners offset carbon emissions for every kilometer driven.',
  },
  {
    id: 'log-4',
    category: 'Logistics',
    question: 'What are the shipping charges and free delivery thresholds?',
    answer:
      'Complimentary express shipping is provided on all domestic orders over ₹999. Standard delivery for orders below ₹999 is charged at a flat rate of ₹99.',
  },

  // ── Authenticity ──
  {
    id: 'auth-1',
    category: 'Authenticity',
    question: 'How does Crunchveda guarantee single-estate organic purity?',
    answer:
      'Every harvest batch is directly sourced from certified single-origin heritage orchards. We perform stringent third-party laboratory tests verifying zero pesticide residues, zero heavy metals, and zero artificial preservatives.',
  },
  {
    id: 'auth-2',
    category: 'Authenticity',
    question: 'Can I verify the origin and batch certificate of my product?',
    answer:
      'Yes! Every Crunchveda package features a unique QR code on the back label. Scanning it reveals the origin estate, harvest date, nutritional analysis, and lab purity certification for that exact batch.',
  },
  {
    id: 'auth-3',
    category: 'Authenticity',
    question: 'Are Crunchveda dry fruits raw, unpasteurized, and chemical-free?',
    answer:
      'Absolutely. Our produce is naturally sun-dried or cold-processed without sulfur dioxide, artificial colors, paraffin wax, or added refined sugars.',
  },

  // ── Returns ──
  {
    id: 'ret-1',
    category: 'Returns',
    question: 'What is the 100% Quality Satisfaction Return Policy?',
    answer:
      'We stand firmly behind the pinnacle quality of our harvest. If your item arrives damaged, tampered, or fails to meet your expectations, we offer a hassle-free 7-day replacement or full refund guarantee.',
  },
  {
    id: 'ret-2',
    category: 'Returns',
    question: 'How do I initiate a replacement or refund request?',
    answer:
      'Simply email info@crunchvedastore.com or contact our WhatsApp Concierge within 7 days of delivery with your order ID and a quick photo/video of the package. Our concierge team will arrange a reverse pickup or dispatch a immediate replacement.',
  },
  {
    id: 'ret-3',
    category: 'Returns',
    question: 'How quickly are refunds processed back to my account?',
    answer:
      'Once a return request is approved, refunds are credited back to your original payment method within 3–5 business days. Store credits are issued instantly.',
  },

  // ── Product ──
  {
    id: 'prod-1',
    category: 'Product',
    question: 'How should I store organic dry fruits to maintain peak freshness?',
    answer:
      'Store your dry fruits in a cool, dry place away from direct sunlight. Once opened, keep them tightly sealed in an airtight glass container or refrigerate them (especially walnuts and pine nuts) to preserve natural oils and crispness.',
  },
  {
    id: 'prod-2',
    category: 'Product',
    question: 'What dietary certifications do Crunchveda products hold?',
    answer:
      'All Crunchveda products are naturally 100% Vegan, Gluten-Free, Non-GMO, Keto-friendly, and USDA / FSSAI Organic Certified.',
  },
  {
    id: 'prod-3',
    category: 'Product',
    question: 'What do the sizing grades (e.g. Jumbo, Super Mammoth) signify?',
    answer:
      'Sizing grades denote kernel size and density. Jumbo and Super Mammoth represent the top 5% largest, hand-sorted kernels from the harvest, delivering maximum crunch, butteriness, and nutrient density.',
  },

  // ── Orders ──
  {
    id: 'ord-1',
    category: 'Orders',
    question: 'Can I place orders directly through WhatsApp Concierge?',
    answer:
      'Yes! Our direct WhatsApp Concierge enables personalized assistance, custom order combinations, corporate gifting inquiries, and rapid checkout. Simply click "WhatsApp Order" on any product card or contact page.',
  },
  {
    id: 'ord-2',
    category: 'Orders',
    question: 'Which payment methods are accepted on the website?',
    answer:
      'We accept all major Credit/Debit Cards (Visa, Mastercard, Amex), UPI (Google Pay, PhonePe, Paytm), NetBanking across 50+ banks, and Cash on Delivery (COD).',
  },
  {
    id: 'ord-3',
    category: 'Orders',
    question: 'How do I modify or cancel an existing order?',
    answer:
      'Orders can be modified or canceled within 2 hours of placement before dispatch. Contact info@crunchvedastore.com or reach our WhatsApp Concierge immediately with your order ID.',
  },
];

const categories = ['All', 'Logistics', 'Authenticity', 'Returns', 'Product', 'Orders'] as const;

export default function HelpSupportMain() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expanded, setExpanded] = useState<string | false>('log-1');

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const filteredFaqs = useMemo(() => {
    return staticFaqs.filter((faq) => {
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const groupedFaqs = useMemo(() => {
    const map: Record<string, FAQItem[]> = {
      Logistics: [],
      Authenticity: [],
      Returns: [],
      Product: [],
      Orders: [],
    };
    filteredFaqs.forEach((faq) => {
      if (map[faq.category]) {
        map[faq.category].push(faq);
      }
    });
    return map;
  }, [filteredFaqs]);

  return (
    <HelpSupportWrapper>
      <Container fixed>
        <Box className="help_container">
          
          {/* Header Block */}
          <Box className="help_header">
            <Typography className="help_tag">Concierge Assistance</Typography>
            <Typography variant="h1">Help &amp; Support</Typography>
            <Typography className="header_desc">
              Everything you need to know about our organic logistics, single-estate authenticity, returns, and ordering process.
            </Typography>

            {/* Interactive Search Input */}
            <Box className="search_box">
              <SearchIcon className="search_icon" />
              <input
                type="text"
                className="search_input"
                placeholder="Search logistics, returns, authenticity, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Box>

            {/* Category Filter Pills */}
            <Box className="category_pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`pill_btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </Box>
          </Box>

          {/* Two-Column Split Layout */}
          <Box className="split_layout">
            
            {/* Left Column: FAQ Items */}
            <Box className="doc_main_column">
              {Object.entries(groupedFaqs).map(([catName, items], catIdx) => {
                if (items.length === 0) return null;
                const catNumber = String(catIdx + 1).padStart(2, '0');

                return (
                  <Box key={catName} className="faq_section_block" id={catName.toLowerCase()}>
                    <Box className="section_title_row">
                      <Typography className="section_num">{catNumber}</Typography>
                      <Typography variant="h2">{catName}</Typography>
                    </Box>

                    <Box className="accordion_group">
                      {items.map((faq) => (
                        <Accordion
                          key={faq.id}
                          expanded={expanded === faq.id}
                          onChange={handleAccordionChange(faq.id)}
                          className="help_accordion"
                          elevation={0}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className="faq_question">{faq.question}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography className="faq_answer">{faq.answer}</Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  </Box>
                );
              })}

              {filteredFaqs.length === 0 && (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 4,
                    background: '#FFF',
                    borderRadius: '20px',
                    border: '1px solid rgba(0,0,0,0.04)',
                  }}
                >
                  <Typography variant="h3" sx={{ fontFamily: 'Georgia, serif', mb: 1, color: '#0B2013' }}>
                    No results found for &ldquo;{searchQuery}&rdquo;
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                    Try searching for different terms or contact our concierge directly.
                  </Typography>
                  <Link
                    href="/contact-us"
                    style={{
                      display: 'inline-block',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      background: '#0B2013',
                      color: '#FFF',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '13px',
                      letterSpacing: '1px',
                    }}
                  >
                    Contact Concierge
                  </Link>
                </Box>
              )}
            </Box>

            {/* Right Column: Sidebar */}
            <Box className="doc_sidebar_column">
              
              {/* Concierge Support Card */}
              <Box className="concierge_card">
                <Typography variant="h3">Need Personal Assistance?</Typography>
                <Typography>
                  Our concierge team is available round-the-clock to guide you through order status, bulk inquiries, or custom gifting.
                </Typography>
                <Link href="/contact-us" className="concierge_btn">
                  Contact Concierge
                </Link>
              </Box>

              {/* Quick Links Card */}
              <Box className="quick_links_card">
                <Typography variant="h3">Quick Navigation</Typography>
                <Box className="links_list">
                  <Link href="/privacy-policy">
                    Privacy Policy <ArrowForwardIosIcon />
                  </Link>
                  <Link href="/terms-condition">
                    Terms &amp; Conditions <ArrowForwardIosIcon />
                  </Link>
                  <Link href="/sustainability">
                    Sustainability Charter <ArrowForwardIosIcon />
                  </Link>
                  <Link href="/our-story">
                    Estate Story <ArrowForwardIosIcon />
                  </Link>
                </Box>
              </Box>

            </Box>

          </Box>

          {/* Bottom Service Block */}
          <Box className="support_service_block">
            <Typography variant="h2">Unrivaled Service</Typography>
            <Typography className="service_desc">
              Transparency and excellence are at the core of Crunchveda. Should you have any questions regarding your harvest order, our dedicated team is at your disposal.
            </Typography>
            <Box className="contact_links_row">
              <a href="mailto:info@crunchvedastore.com" className="contact_item">
                <EmailOutlinedIcon /> info@crunchvedastore.com
              </a>
              <span className="separator_dot" />
              <a href="tel:+442079460123" className="contact_item">
                <PhoneInTalkIcon /> +44 (0) 20 7946 0123
              </a>
            </Box>
          </Box>

        </Box>
      </Container>
    </HelpSupportWrapper>
  );
}
