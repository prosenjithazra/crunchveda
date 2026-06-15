"use client";

import React, { useEffect, useState } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Box, styled, Typography } from "@mui/material";

// Styling for the full-screen loader container
const LoaderOverlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isFadeOut" && prop !== "isVisible",
})<{ isFadeOut: boolean; isVisible: boolean }>(({ theme, isFadeOut, isVisible }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "#0B2013", // Premium dark forest green
  display: isVisible ? "flex" : "none",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 99999,
  opacity: isFadeOut ? 0 : 1,
  visibility: isFadeOut ? "hidden" : "visible",
  transition: "opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), visibility 0.8s",
  pointerEvents: isFadeOut ? "none" : "all",
  overflow: "hidden",
}));

const ContentContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
});

const VisualWrapper = styled(Box)({
  position: "relative",
  width: 220,
  height: 220,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 24,
});

// Floating leaf style
const FloatingLeaf = styled(Box)({
  position: "absolute",
  top: -10,
  right: -10,
  zIndex: 3,
  animation: "floatLeaf 3s ease-in-out infinite",
});

// Loading text style
const LoadingText = styled(Typography)({
  color: "#DCEFE4",
  marginTop: 16,
  fontSize: "14px",
  letterSpacing: "4px",
  textTransform: "uppercase",
  fontWeight: 500,
  opacity: 0.8,
  animation: "pulseText 2s ease-in-out infinite",
});

// Helper to generate zigzag paths
function getZigzagPath(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  pointsCount: number
): string {
  const points: string[] = [];
  for (let i = 0; i <= pointsCount * 2; i++) {
    const angle = (i * Math.PI) / pointsCount;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return points.join(" ") + " Z";
}

export default function CmsLoader() {
  const isFetching = useIsFetching();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  // We enforce a minimum loading time of 1.5 seconds to show the beautiful branding animation
  useEffect(() => {
    let active = true;
    const minLoadTimer = setTimeout(() => {
      if (active && isFetching === 0) {
        setLoading(false);
      }
    }, 1500);

    return () => {
      active = false;
      clearTimeout(minLoadTimer);
    };
  }, [pathname]);

  // Once queries finish fetching, if we have passed the minimum loading time, fade out
  useEffect(() => {
    if (isFetching === 0) {
      const checkTimer = setTimeout(() => {
        setLoading(false);
      }, 300); // extra grace period
      return () => clearTimeout(checkTimer);
    } else {
      setLoading(true);
      setShouldRender(true);
    }
  }, [isFetching]);

  // Manage rendering state after fade out completes
  useEffect(() => {
    if (!loading) {
      const fadeTimer = setTimeout(() => {
        setShouldRender(false);
      }, 850); // wait for 800ms fade transition
      return () => clearTimeout(fadeTimer);
    }
  }, [loading]);

  const outerZigzag = getZigzagPath(100, 100, 92, 82, 36);
  const innerZigzag = getZigzagPath(100, 100, 72, 64, 28);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes spinClockwise {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
            @keyframes spinCounterClockwise {
              0% {
                transform: rotate(360deg);
              }
              100% {
                transform: rotate(0deg);
              }
            }
            @keyframes floatLeaf {
              0% {
                transform: translateY(0px) rotate(0deg) scale(1);
              }
              50% {
                transform: translateY(-12px) rotate(15deg) scale(1.08);
              }
              100% {
                transform: translateY(0px) rotate(0deg) scale(1);
              }
            }
            @keyframes pulseText {
              0%, 100% {
                opacity: 0.5;
                transform: scale(0.97);
              }
              50% {
                opacity: 0.95;
                transform: scale(1.03);
              }
            }
            @keyframes pulseLogo {
              0%, 100% {
                transform: scale(0.95);
                opacity: 0.9;
              }
              50% {
                transform: scale(1.02);
                opacity: 1;
              }
            }
          `,
        }}
      />

      <LoaderOverlay isFadeOut={!loading} isVisible={shouldRender}>
        <ContentContainer>
          <VisualWrapper>
            {/* Outer Spinning Zigzag Progress - Gold/Mint Gradient */}
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              style={{
                position: "absolute",
                animation: "spinClockwise 10s linear infinite",
              }}
            >
              <defs>
                <linearGradient id="outerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DCEFE4" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#28C76F" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#B88900" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <path
                d={outerZigzag}
                fill="none"
                stroke="url(#outerGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="16 8"
              />
            </svg>

            {/* Inner Spinning Zigzag Progress - Mint Gradient */}
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              style={{
                position: "absolute",
                animation: "spinCounterClockwise 7s linear infinite",
                opacity: 0.75,
              }}
            >
              <defs>
                <linearGradient id="innerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#28C76F" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#D0E9D4" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#28C76F" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path
                d={innerZigzag}
                fill="none"
                stroke="url(#innerGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="12 6"
              />
            </svg>

            {/* Central Logo Mark */}
            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                backgroundColor: "#0E3A26",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                animation: "pulseLogo 4s ease-in-out infinite",
                zIndex: 2,
                overflow: "hidden",
                border: "2px solid rgba(220, 239, 228, 0.2)",
              }}
            >
              <Image
                src="/assets/logo-mark.svg"
                alt="NutriHarvest Logo Mark"
                width={50}
                height={50}
                style={{ objectFit: "contain" }}
              />
            </Box>

            {/* Floating Leaf Decorative Element */}
            <FloatingLeaf>
              <svg viewBox="0 0 24 24" width="36" height="36">
                <path
                  d="M17 8C14.28 8 11.23 9.58 9 11.8C6.77 14.03 5.2 17.08 5.2 19.8C5.2 20.46 5.74 21 6.4 21C9.12 21 12.17 19.42 14.4 17.2C16.63 14.97 18.2 11.92 18.2 9.2C18.2 8.54 17.66 8 17 8Z"
                  fill="#DCEFE4"
                />
                <path
                  d="M17 8C14.28 8 11.23 9.58 9 11.8C6.77 14.03 5.2 17.08 5.2 19.8C6.4 19.8 8.5 18 10 16C12 13.5 15 10.5 17 8Z"
                  fill="#28C76F"
                />
                <path
                  d="M5.2 19.8L3 22"
                  stroke="#DCEFE4"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </FloatingLeaf>
          </VisualWrapper>

          {/* Full Branding Logo under the spinner */}
          <Box sx={{ maxWidth: 220, opacity: 0.95, filter: "brightness(0) invert(1)" }}>
            <Image
              src="/assets/mainLogo.png"
              alt="NutriHarvest Logo"
              width={180}
              height={50}
              style={{ objectFit: "contain", height: "auto" }}
            />
          </Box>

          {/* Fading text */}
          <LoadingText variant="caption">Loading Wellness</LoadingText>
        </ContentContainer>
      </LoaderOverlay>
    </>
  );
}
