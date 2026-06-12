'use client';

import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { FaqSectionWrapper } from '@/styles/StyledComponents/FaqSectionWrapper';
import { useHomeSection } from '@/hooks/useContent';

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "How do you ensure the freshness of your dry fruits?",
    answer: "We source our products directly from selected farms during the peak harvest season. Each batch is cold-stored in temperature-controlled facilities and packed in airtight, eco-friendly resealable bags right before dispatch to ensure optimal crunch, flavor, and nutritional value."
  },
  {
    question: "Are your products completely organic?",
    answer: "Yes, our entire curated selection is 100% organic, pesticide-free, and grown using natural farming practices. We hold quality certifications verifying our commitment to clean food without any artificial preservatives or chemical processing."
  },
  {
    question: "What is your shipping policy?",
    answer: "We offer carbon-neutral express shipping across the country. Orders are processed within 24 hours, and delivery typically takes 2–4 business days. Free shipping is automatically applied to all orders over $50."
  }
];

export default function FaqSection() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const { data: sectionData } = useHomeSection("faq");

  const handleToggle = (index: number) => {
    setActiveId(activeId === index ? null : index);
  };

  const heading = sectionData?.content?.heading || "Frequently Asked Questions";
  const faqItemsRaw = (sectionData?.content?.faqItems as string) || "";

  let faqs = faqData;
  if (faqItemsRaw && faqItemsRaw.trim()) {
    const parsedFaqs = faqItemsRaw
      .split("\n")
      .map(line => {
        const parts = line.split("|");
        return {
          question: parts[0]?.trim() || "",
          answer: parts[1]?.trim() || ""
        };
      })
      .filter((f): f is FaqItem => Boolean(f.question && f.answer));
    if (parsedFaqs.length > 0) {
      faqs = parsedFaqs;
    }
  }

  return (
    <FaqSectionWrapper>
      <Container fixed>
        <Box className="faq_header">
          <Typography variant="h2">{heading}</Typography>
        </Box>

        <Box className="faq_container">
          {faqs.map((item, index) => {
            const isActive = activeId === index;
            return (
              <Box 
                key={index} 
                className={`faq_item ${isActive ? 'active' : ''}`}
              >
                <button 
                  className="faq_trigger" 
                  onClick={() => handleToggle(index)}
                  aria-expanded={isActive}
                >
                  <span>{item.question}</span>
                  <Box className="faq_caret">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Box>
                </button>
                <Box className="faq_content_wrapper">
                  <Box className="faq_content">
                    {item.answer}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
    </FaqSectionWrapper>
  );
}
