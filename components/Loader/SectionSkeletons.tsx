"use client";

import React from "react";
import { Box, Container, Grid, Skeleton, Typography } from "@mui/material";
import { HomeBannerWrapper } from "@/styles/StyledComponents/HomeBannerWrapper";
import { CuratedCategoriesWrapper } from "@/styles/StyledComponents/CuratedCategoriesWrapper";
import { BestSellingProductsWrapper } from "@/styles/StyledComponents/BestSellingProductsWrapper";
import { FeaturesSectionWrapper } from "@/styles/StyledComponents/FeaturesSectionWrapper";
import { GiftBannerWrapper } from "@/styles/StyledComponents/GiftBannerWrapper";
import { ProductDetailsSectionWrapper } from "@/styles/StyledComponents/ProductDetailsSectionWrapper";
import { HeritageTimelineWrapper } from "@/styles/StyledComponents/HeritageTimelineWrapper";
import { FaqSectionWrapper } from "@/styles/StyledComponents/FaqSectionWrapper";
import { SustainabilityHeroWrapper } from "@/styles/StyledComponents/SustainabilityHeroWrapper";
import { RegenerativeAgricultureWrapper } from "@/styles/StyledComponents/RegenerativeAgricultureWrapper";
import { ZeroPlasticMandateWrapper } from "@/styles/StyledComponents/ZeroPlasticMandateWrapper";
import { ClimateNeutralDeliveryWrapper } from "@/styles/StyledComponents/ClimateNeutralDeliveryWrapper";

const waveAnim = "wave";

// 1. HomeBanner Skeleton
export function HomeBannerSkeleton() {
  return (
    <HomeBannerWrapper sx={{ minHeight: 600, display: "flex", alignItems: "center", position: "relative" }}>
      {/* Background Image Placeholder */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation={waveAnim}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bgcolor: "rgba(32, 53, 39, 0.12)",
          zIndex: 1,
        }}
      />
      <Container fixed sx={{ position: "relative", zIndex: 2 }}>
        <Box className="bannerTxtBoxWrapper" sx={{ maxWidth: 650, p: 4, bgcolor: "rgba(255, 255, 255, 0.85)", borderRadius: 2 }}>
          <Skeleton variant="text" width="60%" height={24} animation={waveAnim} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="90%" height={56} animation={waveAnim} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="100%" height={20} animation={waveAnim} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="95%" height={20} animation={waveAnim} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" width={180} height={48} animation={waveAnim} sx={{ borderRadius: 1 }} />
        </Box>
      </Container>
    </HomeBannerWrapper>
  );
}

// 2. CuratedCategories Skeleton
export function CuratedCategoriesSkeleton() {
  return (
    <CuratedCategoriesWrapper>
      <Container fixed>
        <Box className="wrapper_titleBox" sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Skeleton variant="text" width={300} height={48} animation={waveAnim} />
        </Box>

        <Box className="desktop_grid">
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <Grid size={{ xs: 12, sm: 4, md: 2 }} key={idx}>
                <Box className="category_card" sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", p: 2 }}>
                  <Skeleton
                    variant="circular"
                    width={120}
                    height={120}
                    animation={waveAnim}
                    sx={{ mb: 2, bgcolor: "rgba(32, 53, 39, 0.08)" }}
                  />
                  <Skeleton variant="text" width="70%" height={24} animation={waveAnim} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="45%" height={16} animation={waveAnim} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </CuratedCategoriesWrapper>
  );
}

// 3. BestSellingProducts Skeleton
export function BestSellingProductsSkeleton() {
  return (
    <BestSellingProductsWrapper>
      <Container fixed>
        <Box className="best_selling_header" sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 6 }}>
          <Box sx={{ width: "100%" }}>
            <Skeleton variant="text" width={180} height={20} animation={waveAnim} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={350} height={40} animation={waveAnim} />
          </Box>
          <Skeleton variant="text" width={140} height={24} animation={waveAnim} />
        </Box>

        <Box className="desktop_grid">
          <Grid container spacing={2.5}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Box className="product_card" sx={{ p: 2, border: "1px solid rgba(0,0,0,0.05)", borderRadius: 2 }}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={220}
                    animation={waveAnim}
                    sx={{ mb: 2, borderRadius: 1, bgcolor: "rgba(32, 53, 39, 0.05)" }}
                  />
                  <Skeleton variant="text" width="85%" height={28} animation={waveAnim} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="30%" height={24} animation={waveAnim} sx={{ mb: 2 }} />
                  
                  {/* Sizes buttons */}
                  <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                    <Skeleton variant="rectangular" width={50} height={30} animation={waveAnim} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={50} height={30} animation={waveAnim} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={50} height={30} animation={waveAnim} sx={{ borderRadius: 1 }} />
                  </Box>

                  {/* Actions buttons */}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Skeleton variant="rectangular" width="55%" height={40} animation={waveAnim} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width="40%" height={40} animation={waveAnim} sx={{ borderRadius: 1 }} />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </BestSellingProductsWrapper>
  );
}

// 4. FeaturesSection Skeleton
export function FeaturesSectionSkeleton() {
  return (
    <FeaturesSectionWrapper>
      <Container fixed>
        <Box className="features_grid" sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: 4 }}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Box key={idx} className="feature_card" sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <Skeleton
                variant="circular"
                width={64}
                height={64}
                animation={waveAnim}
                sx={{ mb: 2.5, bgcolor: "rgba(32, 53, 39, 0.08)" }}
              />
              <Skeleton variant="text" width="60%" height={24} animation={waveAnim} sx={{ mb: 1.5 }} />
              <Skeleton variant="text" width="95%" height={16} animation={waveAnim} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={16} animation={waveAnim} />
            </Box>
          ))}
        </Box>
      </Container>
    </FeaturesSectionWrapper>
  );
}

// 5. GiftBanner Skeleton
export function GiftBannerSkeleton() {
  return (
    <GiftBannerWrapper>
      <Container fixed>
        <Box className="gift_banner_card" sx={{ position: "relative", minHeight: 400, borderRadius: 3, overflow: "hidden", display: "flex", alignItems: "center" }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation={waveAnim}
            sx={{ position: "absolute", top: 0, left: 0, bgcolor: "rgba(32, 53, 39, 0.05)", zIndex: 1 }}
          />
          <Box className="banner_content" sx={{ position: "relative", zIndex: 3, p: { xs: 4, md: 6 }, width: "100%", maxWidth: 600 }}>
            <Skeleton variant="text" width="25%" height={20} animation={waveAnim} sx={{ mb: 2, background:"#fff" }} />
            <Skeleton variant="text" width="80%" height={48} animation={waveAnim} sx={{ mb: 2, background:"#fff" }} />
            <Skeleton variant="text" width="100%" height={20} animation={waveAnim} sx={{ mb: 1, background:"#fff" }} />
            <Skeleton variant="text" width="90%" height={20} animation={waveAnim} sx={{ mb: 3, background:"#fff" }} />
            <Skeleton variant="rectangular" width={180} height={44} animation={waveAnim} sx={{ borderRadius: 1, background:"#fff" }} />
          </Box>
        </Box>
      </Container>
    </GiftBannerWrapper>
  );
}

// 6. ProductDetailsSection Skeleton
export function ProductDetailsSectionSkeleton() {
  return (
    <ProductDetailsSectionWrapper>
      <Container fixed>
        <Box className="details_container" sx={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Row 1 */}
          <Grid container spacing={{ xs: 4, md: 8 }} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box className="detail_content">
                <Skeleton variant="text" width="30%" height={20} animation={waveAnim} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="85%" height={40} animation={waveAnim} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="100%" height={18} animation={waveAnim} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="95%" height={18} animation={waveAnim} sx={{ mb: 3 }} />
                
                {/* Bullets */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {Array.from({ length: 3 }).map((_, bIdx) => (
                    <Box key={bIdx} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Skeleton variant="circular" width={20} height={20} animation={waveAnim} />
                      <Skeleton variant="text" width="45%" height={18} animation={waveAnim} />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={350}
                animation={waveAnim}
                sx={{ borderRadius: 2, bgcolor: "rgba(32, 53, 39, 0.05)" }}
              />
            </Grid>
          </Grid>

          {/* Row 2 */}
          <Grid container spacing={{ xs: 4, md: 8 }} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={350}
                animation={waveAnim}
                sx={{ borderRadius: 2, bgcolor: "rgba(32, 53, 39, 0.05)" }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
              <Box className="detail_content">
                <Skeleton variant="text" width="30%" height={20} animation={waveAnim} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="85%" height={40} animation={waveAnim} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="100%" height={18} animation={waveAnim} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="95%" height={18} animation={waveAnim} sx={{ mb: 3 }} />
                
                {/* Bullets */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {Array.from({ length: 3 }).map((_, bIdx) => (
                    <Box key={bIdx} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Skeleton variant="circular" width={20} height={20} animation={waveAnim} />
                      <Skeleton variant="text" width="45%" height={18} animation={waveAnim} />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ProductDetailsSectionWrapper>
  );
}

// 7. HeritageTimeline Skeleton
export function HeritageTimelineSkeleton() {
  return (
    <HeritageTimelineWrapper>
      <Container fixed>
        <Box className="timeline_header" sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 8 }}>
          <Skeleton variant="text" width={300} height={44} animation={waveAnim} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={200} height={20} animation={waveAnim} />
        </Box>

        <Box className="timeline_container" sx={{ position: "relative" }}>
          {Array.from({ length: 3 }).map((_, idx) => {
            const align = idx % 2 === 0 ? "left" : "right";
            return (
              <Box key={idx} className={`timeline_event event_${align}`} sx={{ mb: 6, display: "flex", flexDirection: "column", alignItems: align === "left" ? "flex-start" : "flex-end" }}>
                <Skeleton variant="circular" width={32} height={32} animation={waveAnim} className="event_node" sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }} />
                <Box sx={{ width: "45%", p: 3, border: "1px solid rgba(0,0,0,0.05)", borderRadius: 2, bgcolor: "#fff", display: "flex", flexDirection: "column", alignItems: align === "left" ? "flex-start" : "flex-end", textAlign: align }}>
                  <Skeleton variant="text" width={50} height={18} animation={waveAnim} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="70%" height={24} animation={waveAnim} sx={{ mb: 1.5 }} />
                  <Skeleton variant="text" width="100%" height={16} animation={waveAnim} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="90%" height={16} animation={waveAnim} />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
    </HeritageTimelineWrapper>
  );
}

// 8. FaqSection Skeleton
export function FaqSectionSkeleton() {
  return (
    <FaqSectionWrapper>
      <Container fixed>
        <Box className="faq_header" sx={{ mb: 5 }}>
          <Skeleton variant="text" width={350} height={40} animation={waveAnim} />
        </Box>

        <Box className="faq_container" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Box key={idx} className="faq_item" sx={{ border: "1px solid rgba(0,0,0,0.05)", borderRadius: 1.5, overflow: "hidden" }}>
              <Box sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Skeleton variant="text" width="60%" height={24} animation={waveAnim} />
                <Skeleton variant="circular" width={24} height={24} animation={waveAnim} />
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </FaqSectionWrapper>
  );
}

// 9. AboutBanner Skeleton
export function AboutBannerSkeleton() {
  return (
    <Box className="about_hero">
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation={waveAnim}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bgcolor: "rgba(32, 53, 39, 0.15)",
          zIndex: 1,
        }}
      />
      <Box className="hero_overlay" />
      <Container fixed>
        <Box className="hero_content">
          <Skeleton variant="text" width={120} height={24} animation={waveAnim} sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.15)" }} />
          <Skeleton variant="text" width="80%" height={60} animation={waveAnim} sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.15)" }} />
          <Skeleton variant="text" width="60%" height={24} animation={waveAnim} sx={{ bgcolor: "rgba(255, 255, 255, 0.15)" }} />
        </Box>
      </Container>
    </Box>
  );
}

// 10. StewardshipSection Skeleton
export function StewardshipSectionSkeleton() {
  return (
    <Box className="section_pad">
      <Container fixed>
        <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} sx={{ alignItems: 'center' }} className="stewardship_row">
          {/* Left Narrative Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="text" width={100} height={20} animation={waveAnim} className="section_title_small" sx={{ mb: 1.5 }} />
            <Skeleton variant="text" width="85%" height={48} animation={waveAnim} className="section_title_large" sx={{ mb: 3 }} />
            <Skeleton variant="text" width="100%" height={20} animation={waveAnim} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="95%" height={20} animation={waveAnim} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} animation={waveAnim} sx={{ mb: 4 }} />
            
            <Box className="stewardship_quote" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Skeleton variant="text" width="90%" height={20} animation={waveAnim} />
              <Skeleton variant="text" width="80%" height={20} animation={waveAnim} />
            </Box>
          </Grid>

          {/* Right Image Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="stewardship_imgBox" sx={{ position: "relative" }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={450}
                animation={waveAnim}
                sx={{ borderRadius: "20px", bgcolor: "rgba(32, 53, 39, 0.05)" }}
              />
              <Box className="floating_badge" sx={{ width: 180 }}>
                <Skeleton variant="text" width={60} height={32} animation={waveAnim} sx={{ bgcolor: "rgba(255, 255, 255, 0.2)" }} />
                <Skeleton variant="text" width="80%" height={16} animation={waveAnim} sx={{ bgcolor: "rgba(255, 255, 255, 0.2)" }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// 11. ArtisanalJourney Skeleton
export function ArtisanalJourneySkeleton() {
  return (
    <Box className="artisanal_journey section_pad">
      <Container fixed>
        <Box className="title_box" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Skeleton variant="text" width={100} height={20} animation={waveAnim} className="section_title_small" sx={{ mb: 1.5 }} />
          <Skeleton variant="text" width={300} height={44} animation={waveAnim} className="section_title_large" sx={{ mb: 4 }} />
        </Box>

        <Grid container spacing={4}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Box className="journey_card">
                <Box className="journey_imgBox">
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    animation={waveAnim}
                    sx={{ bgcolor: "rgba(32, 53, 39, 0.05)" }}
                  />
                </Box>
                <Skeleton variant="text" width="60%" height={28} animation={waveAnim} sx={{ mb: 1.5 }} />
                <Skeleton variant="text" width="95%" height={18} animation={waveAnim} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={18} animation={waveAnim} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// 12. QuoteSection Skeleton
export function QuoteSectionSkeleton() {
  return (
    <Box className="quote_banner" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Container fixed sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="span" className="quote_symbol">
          &ldquo;
        </Typography>
        <Skeleton variant="text" width="80%" height={32} animation={waveAnim} sx={{ mb: 1.5, bgcolor: "rgba(255, 255, 255, 0.15)" }} />
        <Skeleton variant="text" width="70%" height={32} animation={waveAnim} sx={{ mb: 3, bgcolor: "rgba(255, 255, 255, 0.15)" }} />
        <Skeleton variant="text" width="30%" height={20} animation={waveAnim} className="quote_author" sx={{ bgcolor: "rgba(255, 255, 255, 0.15)" }} />
      </Container>
    </Box>
  );
}

// 13. SustainabilityCharter Skeleton
export function SustainabilityCharterSkeleton() {
  return (
    <Box className="charter_section section_pad">
      <Container fixed>
        <Box className="charter_header" sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 6 }}>
          <Box sx={{ width: "100%", maxWidth: 600 }}>
            <Skeleton variant="text" width="60%" height={44} animation={waveAnim} className="section_title_large" sx={{ mb: 1.5 }} />
            <Skeleton variant="text" width="95%" height={20} animation={waveAnim} className="body_desc" sx={{ mb: 0 }} />
          </Box>
          <Skeleton variant="rectangular" width={180} height={44} animation={waveAnim} sx={{ borderRadius: 1 }} />
        </Box>

        <Grid container spacing={3}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
              <Box className="charter_card">
                <Skeleton variant="circular" width={48} height={48} animation={waveAnim} sx={{ mb: 2.5, bgcolor: "rgba(32, 53, 39, 0.08)" }} />
                <Skeleton variant="text" width="60%" height={20} animation={waveAnim} sx={{ mb: 1.5 }} />
                <Skeleton variant="text" width="90%" height={16} animation={waveAnim} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={16} animation={waveAnim} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// 14. SustainabilityHero Skeleton
export function SustainabilityHeroSkeleton() {
  return (
    <SustainabilityHeroWrapper>
      <Box className="sustainability_hero">
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation={waveAnim}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bgcolor: "rgba(32, 53, 39, 0.12)",
            zIndex: 1,
          }}
        />
        <Box className="hero_overlay" />
        <Box className="hero_content">
          <Skeleton variant="text" width={140} height={24} animation={waveAnim} className="section_tag" sx={{ mb: 2 }} />
          <Skeleton variant="text" width="80%" height={60} animation={waveAnim} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="60%" height={24} animation={waveAnim} className="hero_desc" />
        </Box>
      </Box>

      <Box className="quote_section" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Container fixed sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography className="quote_symbol">&ldquo;</Typography>
          <Skeleton variant="text" width="75%" height={32} animation={waveAnim} sx={{ mb: 1.5 }} />
          <Skeleton variant="text" width="60%" height={32} animation={waveAnim} />
        </Container>
      </Box>
    </SustainabilityHeroWrapper>
  );
}

// 15. RegenerativeAgriculture Skeleton
export function RegenerativeAgricultureSkeleton() {
  return (
    <RegenerativeAgricultureWrapper>
      <Container fixed>
        <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="text_col">
              <Skeleton variant="text" width={180} height={20} animation={waveAnim} className="section_tag" sx={{ mb: 1.5 }} />
              <Skeleton variant="text" width="85%" height={48} animation={waveAnim} className="section_title_large" sx={{ mb: 4 }} />
              
              <Box className="feature_list">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <Box className="feature_box" key={idx}>
                    <Skeleton variant="circular" width={44} height={44} animation={waveAnim} sx={{ bgcolor: "#fff", flexShrink: 0 }} />
                    <Box className="feature_text" sx={{ width: "100%" }}>
                      <Skeleton variant="text" width="30%" height={24} animation={waveAnim} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="95%" height={16} animation={waveAnim} sx={{ mb: 0.5 }} />
                      <Skeleton variant="text" width="80%" height={16} animation={waveAnim} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="crop_imgBox">
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation={waveAnim}
                sx={{ bgcolor: "rgba(32, 53, 39, 0.05)" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </RegenerativeAgricultureWrapper>
  );
}

// 16. ZeroPlasticMandate Skeleton
export function ZeroPlasticMandateSkeleton() {
  return (
    <ZeroPlasticMandateWrapper>
      <Container fixed>
        <Box className="mandate_header" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Skeleton variant="text" width={300} height={48} animation={waveAnim} sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.15)" }} />
          <Skeleton variant="text" width="80%" height={20} animation={waveAnim} sx={{ mb: 1, bgcolor: "rgba(255, 255, 255, 0.15)" }} />
          <Skeleton variant="text" width="70%" height={20} animation={waveAnim} sx={{ bgcolor: "rgba(255, 255, 255, 0.15)" }} />
        </Box>

        <Grid container spacing={4}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Box className="mandate_card">
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  animation={waveAnim}
                  sx={{ position: "absolute", top: 0, left: 0, bgcolor: "rgba(255, 255, 255, 0.08)" }}
                />
                <Box className="card_overlay" />
                <Box className="card_content">
                  <Skeleton variant="text" width="40%" height={16} animation={waveAnim} sx={{ mb: 1, bgcolor: "rgba(255, 255, 255, 0.15)" }} />
                  <Skeleton variant="text" width="75%" height={28} animation={waveAnim} sx={{ bgcolor: "rgba(255, 255, 255, 0.15)" }} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ZeroPlasticMandateWrapper>
  );
}

// 17. ClimateNeutralDelivery Skeleton
export function ClimateNeutralDeliverySkeleton() {
  return (
    <ClimateNeutralDeliveryWrapper>
      <Container fixed>
        <Grid container spacing={{ xs: 4, md: 6, lg: 8 }} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="stats_col">
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box className="stat_card">
                    <Skeleton variant="text" width="60%" height={44} animation={waveAnim} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={16} animation={waveAnim} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box className="stat_card">
                    <Skeleton variant="text" width="60%" height={44} animation={waveAnim} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={16} animation={waveAnim} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box className="stat_card">
                    <Skeleton variant="text" width="40%" height={44} animation={waveAnim} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" height={16} animation={waveAnim} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="narrative_col">
              <Skeleton variant="text" width={100} height={20} animation={waveAnim} className="section_tag" sx={{ mb: 1.5 }} />
              <Skeleton variant="text" width="80%" height={40} animation={waveAnim} className="section_title_large" sx={{ mb: 2.5 }} />
              <Skeleton variant="text" width="100%" height={18} animation={waveAnim} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="95%" height={18} animation={waveAnim} sx={{ mb: 4 }} />
              <Skeleton variant="rectangular" width={180} height={44} animation={waveAnim} sx={{ borderRadius: 1 }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ClimateNeutralDeliveryWrapper>
  );
}

