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
  Avatar,
  Menu,
  MenuItem,
  Divider,
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
import { usePathname, useRouter } from "next/navigation";
import { useUser, useLogout } from "@/hooks/useAuth";
import { cartService } from "@/services/cartService";
import { useCart } from "@/contexts/CartContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
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
    href: "/products",
    label: "Shop",
  },
  {
    iconPath: <HeartBtnIcon />,
    href: "/saved",
    label: "Saved",
  },
  {
    iconPath: <WhatsAppIcon />,
    href: "https://wa.me/6296909031",
    label: "Contact",
  },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrollDir, setScrollDir] = useState<"up" | "down" | "top">("top");

  const { user } = useUser();
  const { cartCount } = useCart();
  const logoutMutation = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
    handleMenuClose();
  };

  const dynamicMobileMenu = [
    {
      iconPath: <HomeIcon />,
      href: "/",
      label: "Home",
    },
    {
      iconPath: <ShopingBagIcon />,
      href: "/products",
      label: "Shop",
    },
    {
      iconPath: <HeartBtnIcon />,
      href: "/saved",
      label: "Saved",
    },
    {
      iconPath: <WhatsAppIcon />,
      href: "/contact-us",
      label: "Contact",
    },
  ];

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
                  alt="crunchveda logo"
                  title="crunchveda"
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
                <Typography variant="caption">{cartCount}</Typography>
              </IconButton>
              <Button
                variant="contained"
                color="primary"
                disableRipple
                className="whatsAppBtn"
              >
                <WhatsAppIcon />
                Order on WhatsApp
              </Button>
              {user ? (
                <>
                  <IconButton
                    onClick={handleAvatarClick}
                    size="small"
                    sx={{ p: 0.5 }}
                    aria-controls={isMenuOpen ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? "true" : undefined}
                  >
                    <Avatar
                      src={user.avatar || undefined}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "primary.main",
                        fontSize: "14px",
                        fontWeight: 600,
                        border: "2px solid",
                        borderColor: "primary.light",
                      }}
                    >
                      {user.name
                        ? user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)
                        : "U"}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.08))",
                          mt: 1.5,
                          borderRadius: 3,
                          border: "1px solid",
                          borderColor: "divider",
                          minWidth: 200,
                          bgcolor: "background.paper",
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                            borderLeft: "1px solid",
                            borderTop: "1px solid",
                            borderColor: "divider",
                          },
                        },
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: "primary.main" }}
                      >
                        {user.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", display: "block" }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem
                      component={Link}
                      href="/profile"
                      sx={{ fontSize: "14px", py: 1, fontWeight: 600 }}
                    >
                      My Profile
                    </MenuItem>
                    {user.role === "admin" && (
                      <MenuItem
                        component={Link}
                        href="/admin"
                        sx={{ fontSize: "14px", py: 1, fontWeight: 600 }}
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        fontSize: "14px",
                        py: 1,
                        fontWeight: 600,
                        color: "error.main",
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  disableRipple
                  component={Link}
                  href="/login"
                >
                  Login
                </Button>
              )}
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
              Crunchveda
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
            <Divider />
            {user ? (
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: "center" }}
                >
                  <Avatar
                    src={user.avatar || undefined}
                    sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
                  >
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {user.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {user.email}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="outlined"
                  component={Link}
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  fullWidth
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  My Profile
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  fullWidth
                  sx={{
                    borderRadius: "20px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Logout
                </Button>
              </Stack>
            ) : (
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/login"
                onClick={() => setIsOpen(false)}
                fullWidth
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Login
              </Button>
            )}
          </Stack>
        </Drawer>
      </HeaderWrapper>
      <MobileMenuWrapper>
        <Box className="mobileMenuListBox">
          <List disablePadding>
            {dynamicMobileMenu.map((item) => (
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
