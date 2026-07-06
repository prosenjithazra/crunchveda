'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Container, Grid, Typography, Dialog, IconButton } from '@mui/material';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

import { assets } from '@/json/assest';
import { InstagramGridWrapper } from '@/styles/StyledComponents/InstagramGridWrapper';
import { useQuery } from '@tanstack/react-query';

const fallbackReels = [
  { id: 1, image: assets.instagram1, alt: "Smoothie bowl breakfast", link: "" },
  { id: 2, image: assets.instagram2, alt: "Pouring walnuts into jar", link: "" },
  { id: 3, image: assets.instagram3, alt: "Citrus fruits flat lay", link: "" },
  { id: 4, image: assets.instagram4, alt: "Stacked roasted cashews", link: "" }
];

/** Strip trailing encoded/raw quotes added by some image kit URLs */
const cleanUrl = (url: string): string => {
  if (typeof url !== "string") return "";
  return url.replace(/%22$/, "").replace(/"$/, "").trim();
};

/** Returns true if url points to a raw video file we can play with <video> */
const isDirectVideo = (url: string): boolean => {
  const path = url.toLowerCase().split("?")[0].split("#")[0];
  return [".mp4", ".webm", ".ogg", ".mov", ".m4v"].some(ext => path.endsWith(ext));
};

/** Convert a normal YouTube/Shorts URL to its embeddable form */
const toYoutubeEmbed = (url: string): string | null => {
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.slice(1).split("/")[0];
    } else if (u.hostname.includes("youtube.com")) {
      id = u.searchParams.get("v") || u.pathname.split("/").pop() || null;
    }
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  } catch {}
  return null;
};

/**
 * Convert an Instagram reel URL to its embeddable form.
 * e.g. https://www.instagram.com/reel/DabeWBVRrg0/?utm_source=...
 *   → https://www.instagram.com/reel/DabeWBVRrg0/embed/
 */
const toInstagramEmbed = (url: string): string | null => {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("instagram.com")) return null;
    // Match /reel/<ID>/ or /p/<ID>/
    const match = u.pathname.match(/\/(reel|p)\/([A-Za-z0-9_-]+)/);
    if (match) {
      const [, type, id] = match;
      return `https://www.instagram.com/${type}/${id}/embed/`;
    }
  } catch {}
  return null;
};

type ActiveReel =
  | { type: "video"; url: string }
  | { type: "iframe"; url: string }
  | { type: "external"; url: string };

const resolveReel = (url: string): ActiveReel => {
  if (!url) return { type: "external", url: "#" };

  if (isDirectVideo(url)) return { type: "video", url };

  const ytEmbed = toYoutubeEmbed(url);
  if (ytEmbed) return { type: "iframe", url: ytEmbed };

  // Instagram reel / post → use the /embed/ endpoint
  const igEmbed = toInstagramEmbed(url);
  if (igEmbed) return { type: "iframe", url: igEmbed };

  // For all other embeddable URLs, try iframe
  return { type: "iframe", url };
};

export default function InstagramGrid() {
  const [activeReel, setActiveReel] = React.useState<ActiveReel | null>(null);

  const { data: reelsRes, isLoading } = useQuery({
    queryKey: ["reels-section"],
    queryFn: async () => {
      const res = await fetch("/api/cms/reels-section");
      if (!res.ok) throw new Error("Failed to fetch reels section");
      return res.json();
    }
  });

  if (isLoading) return null;

  const heading = reelsRes?.sectionTitle || "Trending Reels";
  const description = reelsRes?.sectionDescription || "Discover our products in action through these short videos";

  let reels = fallbackReels;
  if (Array.isArray(reelsRes?.reels) && reelsRes.reels.length > 0) {
    reels = reelsRes.reels.map((r: any, idx: number) => {
      let defaultImg: string = assets.instagram1;
      if (idx === 1) defaultImg = assets.instagram2;
      if (idx === 2) defaultImg = assets.instagram3;
      if (idx >= 3) defaultImg = assets.instagram4;

      return {
        id: idx + 1,
        image: cleanUrl(r.reelsImage || "") || defaultImg,
        link: cleanUrl(r.reelsVideo || ""),
        alt: "Trending Reel"
      };
    });
  }

  const handleReelClick = (link: string) => {
    if (!link) return;
    const resolved = resolveReel(link);
    if (resolved.type === "external") {
      window.open(resolved.url, "_blank", "noopener,noreferrer");
    } else {
      setActiveReel(resolved);
    }
  };

  const ReelCard = ({ item }: { item: typeof reels[0] }) => (
    <Box
      className="instagram_card"
      sx={{ cursor: item.link ? "pointer" : "default", position: "relative" }}
      onClick={() => handleReelClick(item.link)}
    >
      <Image src={item.image} alt={item.alt} width={500} height={500} />
      {/* Play icon overlay when there's a video link */}
      {item.link && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0,0,0,0)",
            transition: "bgcolor 0.2s",
            "&:hover": { bgcolor: "rgba(0,0,0,0.3)" }
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transform: "scale(0.8)",
              transition: "opacity 0.2s, transform 0.2s",
              ".instagram_card:hover &": { opacity: 1, transform: "scale(1)" }
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#1a1a1a">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <InstagramGridWrapper>
      <Container fixed>
        <Box className="instagram_header">
          <Typography variant="h2">{heading}</Typography>
          <Typography variant="body1">{description}</Typography>
        </Box>

        {/* Desktop Grid Layout */}
        <Box className="desktop_grid">
          <Grid container spacing={{ lg: 3, xs: 2 }}>
            {reels.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
                <ReelCard item={item} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Mobile Splide Slider Layout */}
        <Box className="mobile_slider">
          <Splide
            options={{
              type: "slide",
              perPage: 1,
              gap: "16px",
              arrows: false,
              pagination: true,
              breakpoints: { 480: { perPage: 1.5, gap: "12px" } }
            }}
          >
            {reels.map((item) => (
              <SplideSlide key={item.id}>
                <ReelCard item={item} />
              </SplideSlide>
            ))}
          </Splide>
        </Box>
      </Container>

      {/* Reel Player Popup */}
      <Dialog
        open={Boolean(activeReel)}
        onClose={() => setActiveReel(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#000",
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
            m: 2,
            position: "relative"
          }
        }}
      >
        {/* 9:16 portrait aspect ratio */}
        <Box sx={{ position: "relative", width: "100%", pt: "177.77%", bgcolor: "#000" }}>
          {activeReel?.type === "video" && (
            <video
              key={activeReel.url}
              src={activeReel.url}
              autoPlay
              controls
              loop
              playsInline
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
            />
          )}
          {activeReel?.type === "iframe" && (
            <iframe
              key={activeReel.url}
              src={activeReel.url}
              title="Reel Video"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write"
              allowFullScreen
              scrolling="no"
              frameBorder="0"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: "none",
                background: "#000"
              }}
            />
          )}
        </Box>

        {/* Close Button */}
        <IconButton
          onClick={() => setActiveReel(null)}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "rgba(0,0,0,0.6)",
            color: "#fff",
            zIndex: 20,
            width: 36,
            height: 36,
            "&:hover": { bgcolor: "rgba(0,0,0,0.9)", transform: "scale(1.1)" },
            transition: "all 0.2s"
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </IconButton>
      </Dialog>
    </InstagramGridWrapper>
  );
}
