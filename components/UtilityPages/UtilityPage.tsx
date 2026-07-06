"use client";

import { assets } from "@/json/assest";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { Box, Chip, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import type { UtilityPageProps } from "./utilityPageData";

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const emptyCountdown: CountdownParts = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function getCountdownParts(target: string): CountdownParts {
  const distance = new Date(target).getTime() - Date.now();

  if (!Number.isFinite(distance) || distance <= 0) {
    return emptyCountdown;
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

export default function UtilityPage({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  countdownTo,
  highlights,
  notes,
  variant = "coming-soon",
}: UtilityPageProps) {
  const isMaintenance = variant === "maintenance";
  const showCountdown = !isMaintenance && Boolean(countdownTo);
  const rootRef = React.useRef<HTMLElement | null>(null);
  const [countdown, setCountdown] = React.useState<CountdownParts | null>(null);
  const [typedTitle, setTypedTitle] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || !showCountdown || !countdownTo) return undefined;

    const updateCountdown = () => setCountdown(getCountdownParts(countdownTo));
    updateCountdown();

    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, [countdownTo, showCountdown, mounted]);

  React.useEffect(() => {
    if (!mounted) return;
    let timeoutId: number;
    let characterIndex = 0;
    let isDeleting = false;

    const tick = () => {
      setTypedTitle(title.slice(0, characterIndex));

      if (!isDeleting && characterIndex < title.length) {
        characterIndex += 1;
        timeoutId = window.setTimeout(tick, 72);
        return;
      }

      if (!isDeleting && characterIndex === title.length) {
        isDeleting = true;
        timeoutId = window.setTimeout(tick, 1600);
        return;
      }

      if (isDeleting && characterIndex > 0) {
        characterIndex -= 1;
        timeoutId = window.setTimeout(tick, 34);
        return;
      }

      isDeleting = false;
      timeoutId = window.setTimeout(tick, 520);
    };

    tick();

    return () => window.clearTimeout(timeoutId);
  }, [title, mounted]);

  React.useEffect(() => {
    let ctx: { revert: () => void } | undefined;

    import("gsap").then(({ gsap }) => {
      if (!rootRef.current) return;

      ctx = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

        timeline
          .from(".utility-logo", { y: -16, opacity: 0, duration: 0.6 })
          .from(".utility-kicker", { y: 18, opacity: 0, duration: 0.65 })
          .from(".utility-title", { y: 42, opacity: 0, duration: 0.85 }, "-=0.35")
          .from(".utility-copy", { y: 24, opacity: 0, duration: 0.7 }, "-=0.45")
          .from(".utility-timer", { y: 22, opacity: 0, stagger: 0.07, duration: 0.55 }, "-=0.35")
          .from(".utility-stat", { y: 24, opacity: 0, stagger: 0.08, duration: 0.65 }, "-=0.2")
          .from(".utility-visual", { x: 48, opacity: 0, scale: 0.96, duration: 0.9 }, "-=0.8")
          .from(".utility-note", { y: 14, opacity: 0, stagger: 0.08, duration: 0.45 }, "-=0.3");

        gsap.to(".utility-visual", {
          y: -14,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".utility-accent", {
          rotate: isMaintenance ? -4 : 4,
          scale: 1.03,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".utility-note-panel", {
          y: -8,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }, rootRef);
    });

    return () => ctx?.revert();
  }, [isMaintenance]);

  return (
    <Box
      ref={rootRef}
      component="main"
      sx={{
        minHeight: "100svh",
        bgcolor: "customColors.lightCream",
        background: isMaintenance
          ? "radial-gradient(circle at 85% 20%, rgba(255, 232, 225, 0.9), transparent 32%), linear-gradient(135deg, #FCF9F2 0%, #FFF2D5 100%)"
          : "radial-gradient(circle at 84% 18%, rgba(208, 233, 212, 0.95), transparent 32%), linear-gradient(135deg, #FCF9F2 0%, #F0EEE7 100%)",
        display: "flex",
        alignItems: "center",
        py: { xs: 3, md: 5 },
        pt: { xs: 11, md: 12 },
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "auto auto -22% -12%",
          width: { xs: 260, md: 420 },
          height: { xs: 260, md: 420 },
          borderRadius: "50%",
          border: "1px solid rgba(32,53,39,0.12)",
        },
      }}
    >
      <Box
        className="utility-logo"
        sx={{
          position: "absolute",
          top: { xs: 22, md: 28 },
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 4,
          width: { xs: 148, md: 174 },
        }}
      >
        <Image
          src={assets.logo}
          alt="NutriHarvest"
          width={180}
          height={48}
          priority
          style={{ width: "100%", height: "auto" }}
        />
      </Box>

      <Container fixed>
        <Grid container spacing={{ xs: 3, lg: 7 }} sx={{ alignItems: "center", minHeight: { md: "calc(100svh - 116px)" } }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack spacing={{ xs: 2, md: 2.5 }}>
              <Chip
                className="utility-kicker"
                icon={<SpaOutlinedIcon />}
                label={eyebrow}
                sx={{
                  width: "fit-content",
                  bgcolor: isMaintenance ? "customColors.lightYellow" : "customColors.lightGreen",
                  color: "primary.main",
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  borderRadius: 1.5,
                  px: 0.75,
                }}
              />

              <Box>
                <Typography
                  className="utility-title"
                  variant="h1"
                  aria-label={title}
                  sx={{
                    maxWidth: 680,
                    minHeight: { xs: 76, sm: 88, md: 116 },
                    mb: 2,
                    color: "primary.dark",
                    "&::after": {
                      content: '"|"',
                      display: "inline-block",
                      ml: 0.5,
                      color: "secondary.light",
                      animation: "utilityCursorBlink 0.85s steps(2, start) infinite",
                    },
                    "@keyframes utilityCursorBlink": {
                      "0%, 42%": { opacity: 1 },
                      "43%, 100%": { opacity: 0 },
                    },
                  }}
                >
                  {mounted ? (typedTitle || "\u00a0") : title}
                </Typography>
                <Typography className="utility-copy" variant="body1" sx={{ maxWidth: 560, color: "customColors.textColor", fontSize: { md: 18 } }}>
                  {description}
                </Typography>
              </Box>

              {showCountdown && (
                <Grid container spacing={{lg:1.5, xs:0.5}} sx={{ maxWidth: '100%' }}>
                  {[
                    { label: "Days", value: mounted ? countdown?.days : undefined },
                    { label: "Hours", value: mounted ? countdown?.hours : undefined },
                    { label: "Minutes", value: mounted ? countdown?.minutes : undefined },
                    { label: "Seconds", value: mounted ? countdown?.seconds : undefined },
                  ].map(item => (
                    <Grid key={item.label} size={{ xs: 3, sm: 3 }}>
                      <Paper
                        className="utility-timer"
                        elevation={0}
                        sx={{
                          p: { xs: 1, md: 2 },
                          borderRadius: 2,
                          border: 1,
                          borderColor: "rgba(32,53,39,0.14)",
                          bgcolor: "rgba(255,255,255,0.76)",
                          textAlign: "center",
                          boxShadow: "0 16px 40px rgba(32,53,39,0.08)",
                        }}
                      >
                        <Typography variant="h2" sx={{ fontSize: {xs:22, md: 28, lg: 38 }, color: "primary.main", lineHeight: 1.2 }}>
                          {typeof item.value === "number" ? item.value.toString().padStart(2, "0") : "--"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "customColors.textColor", fontWeight: 700 }}>
                          {item.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}

              <Grid container spacing={1.5}>
                {highlights.map(item => {
                  const Icon = item.icon;

                  return (
                    <Grid key={item.label} size={{ xs: 12, sm: 4 }}>
                      <Paper
                        className="utility-stat"
                        elevation={0}
                        sx={{
                          height: "100%",
                          p: 2,
                          borderRadius: 2,
                          border: 1,
                          borderColor: "divider",
                          bgcolor: "rgba(255,255,255,0.72)",
                        }}
                      >
                        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                          <Stack
                            sx={{
                              width: 40,
                              height: 40,
                              flexShrink: 0,
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 1.5,
                              bgcolor: isMaintenance ? "customColors.lightOrange" : "customColors.lightGreen",
                              color: "primary.main",
                            }}
                          >
                            <Icon fontSize="small" />
                          </Stack>
                          <Box>
                            <Typography variant="h4">{item.value}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.label}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Box
              sx={{
                position: "relative",
                minHeight: { xs: 330, sm: 430, md: 560 },
              }}
            >
              <Box
                className="utility-accent"
                sx={{
                  position: "absolute",
                  inset: { xs: "8% 0 0 9%", md: "8% 0 0 15%" },
                  bgcolor: isMaintenance ? "customColors.lightYellow" : "customColors.lightGreen",
                  borderRadius: 4,
                }}
              />
              <Box
                className="utility-visual"
                sx={{
                  position: "relative",
                  height: { xs: 300, sm: 390, md: 520 },
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 24px 80px rgba(32, 53, 39, 0.18)",
                }}
              >
                <Image src={image} alt={imageAlt} fill priority sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: "cover" }} />
              </Box>

              <Paper
                className="utility-note-panel"
                elevation={0}
                sx={{
                  position: { xs: "relative", sm: "absolute" },
                  left: { sm: 24 },
                  bottom: { sm: 24 },
                  mt: { xs: -5, sm: 0 },
                  mx: { xs: 2, sm: 0 },
                  maxWidth: 360,
                  p: 2.5,
                  borderRadius: 2,
                  border: 1,
                  borderColor: "rgba(255,255,255,0.72)",
                  bgcolor: "rgba(252,249,242,0.92)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <Stack spacing={1.25}>
                  {notes.map(note => (
                    <Stack className="utility-note" key={note} direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <VerifiedOutlinedIcon sx={{ color: "primary.main", fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: "customColors.textColor", fontWeight: 600 }}>
                        {note}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
