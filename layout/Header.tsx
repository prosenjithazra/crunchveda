"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useState, useEffect } from "react";
import {
  HeaderWrapper,
  MobileMenuWrapper,
  SearchDrawer,
} from "@/styles/StyledComponents/HeaderWrapper";
import { assets } from "@/json/assest";
import SearchIcon from "@/ui/Icons/SearchIcon";
import CartIcon from "@/ui/Icons/CartIcon";
import CommonInput from "@/ui/CommonInput/CommonInput";
import HomeIcon from "@/ui/Icons/HomeIcon";
import ShopingBagIcon from "@/ui/Icons/ShopingBagIcon";
import HeartBtnIcon from "@/ui/Icons/HeartBtnIcon";
import WhatsAppIcon from "@/ui/Icons/WhatsAppIcon";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/product" },
  { label: "Categories", href: "/categories" },
  { label: "Our Story", href: "/our-story" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact", href: "/contact-us" },
];

const mobileMenuData = [
  {
    iconPath: <HomeIcon />,
    href: "/",
    label: "Home",
  },
  {
    iconPath: <ShopingBagIcon />,
    href: "/product",
    label: "Shop",
  },
  {
    iconPath: <HeartBtnIcon />,
    href: "/saved",
    label: "Saved",
  },
  {
    iconPath: <WhatsAppIcon />,
    href: "https://wa.me/+1234567890",
    label: "Contact",
  },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrollDir, setScrollDir] = useState<"up" | "down" | "top">("top");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setScrollDir("top");
        return;
      }

      if (currentScrollY > lastScrollY) {
        setScrollDir("down");
      } else {
        setScrollDir("up");
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClass =
    scrollDir === "up"
      ? "scroll-up"
      : scrollDir === "down"
        ? "scroll-down"
        : "scroll-top";

  return (
    <>
      <HeaderWrapper className={headerClass}>
        <Container fixed>
          <Box className="mainHeaderWrapper" component={"nav"}>
            <Box className="logoBox">
              <Link href={"/"}>
                <Image
                  src={assets.logo}
                  width={600}
                  height={400}
                  alt="NutriHarvest logo"
                  title="NutriHarvest"
                  style={{ width: "100%", height: "auto" }}
                />
              </Link>
            </Box>
            <Box className="menulistBox">
              <List disablePadding>
                {navItems.map((item) => (
                  <ListItem key={item.href} disablePadding>
                    <Link
                      href={item.href}
                      className={pathname === item.href ? "active" : ""}
                    >
                      {item.label}
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box className="wrapper_rightListBox">
              <IconButton
                disableRipple
                className="searchBtn"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
              >
                <SearchIcon />
              </IconButton>
              <IconButton
                disableRipple
                className="cartBtn"
                component={Link}
                href="/cart"
              >
                <CartIcon />
                <Typography variant="caption">0</Typography>
              </IconButton>
              <Button
                variant="contained"
                color="primary"
                disableRipple
                className="whatsAppBtn"
              >
                Order on WhatsApp
              </Button>
            </Box>
          </Box>
        </Container>

        {/* ── Full-screen Search Drawer ── */}
        <SearchDrawer
          anchor="top"
          open={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        >
          <Box className="innerDrawerWrapper">
            {/* Close button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
              <IconButton
                onClick={() => setIsSearchOpen(false)}
                disableRipple
                aria-label="Close search"
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "50%",
                  p: 1,
                }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Box>

            <Typography variant="h2" sx={{ mb: 1, fontWeight: 700 }}>
              What are you looking for?
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: "text.secondary" }}>
              Search products, categories, and more.
            </Typography>

            {/* Search row */}
            <Stack direction={"row"} sx={{ alignItems: "center", gap: "8px" }}>
              <Box sx={{ flex: 1 }}>
                <CommonInput
                  fullWidth
                  placeholder="Search for products…"
                  autoFocus
                  startAdornment={<SearchIcon />}
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                disableRipple
                className="searchBtn"
              >
                Search
              </Button>
            </Stack>
          </Box>
        </SearchDrawer>

        {/* ── Mobile Nav Drawer ── */}
        <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
          <Stack sx={{ width: 280, p: 3 }} spacing={3}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              NutriHarvest
            </Typography>
            {navItems.map((item) => (
              <Typography
                key={item.href}
                component={Link}
                href={item.href}
                onClick={() => setIsOpen(false)}
                sx={{ color: "text.secondary", fontWeight: 700 }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>
        </Drawer>
      </HeaderWrapper>
      <MobileMenuWrapper>
        <Box className="mobileMenuListBox">
          <List disablePadding>
            {mobileMenuData.map((item) => (
              <ListItem key={item.label} disablePadding>
                <Link href={item.href}>
                  <i>{item.iconPath}</i>
                  {item.label}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </MobileMenuWrapper>
    </>
  );
}
