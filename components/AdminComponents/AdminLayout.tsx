"use client";

import { adminAuthService, type AdminSession } from "@/services/admin/authService";
import { assets } from "@/json/assest";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import {
  Collapse,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useContentModules } from "@/hooks/useContent";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

const moduleIconMap: Record<string, SvgIconComponent> = {
  "home": StorefrontOutlinedIcon,
  "categories": CategoryOutlinedIcon,
  "products": Inventory2OutlinedIcon,
  "product-detail": Inventory2OutlinedIcon,
  "best-seller": StarBorderOutlinedIcon,
  "gifts": LocalMallOutlinedIcon,
  "about-us": ArticleOutlinedIcon,
  "our-story": ArticleOutlinedIcon,
  "sustainability": SpaOutlinedIcon,
  "contact-us": ContactSupportOutlinedIcon,
  "cart": ShoppingCartOutlinedIcon,
  "saved": FavoriteBorderOutlinedIcon,
  "privacy-policy": GavelOutlinedIcon,
  "terms-condition": GavelOutlinedIcon,
};

const drawerWidth = 280;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = React.useState(false);
  const [session, setSession] = React.useState<AdminSession | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openModules, setOpenModules] = React.useState<Record<string, boolean>>({});

  const { data: modules = [] } = useContentModules();

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (pathname) {
      const parts = pathname.split("/");
      if (parts[2] === "content" && parts[3]) {
        const activeModule = parts[3];
        setOpenModules(prev => {
          if (prev[activeModule]) return prev;
          return { ...prev, [activeModule]: true };
        });
      }
    }
  }

  React.useEffect(() => {
    queueMicrotask(() => {
      const currentSession = adminAuthService.getSession();

      if (!currentSession) {
        router.replace("/admin/login");
        return;
      }

      setSession(currentSession);
      setIsReady(true);
    });
  }, [router]);

  const handleLogout = () => {
    adminAuthService.logout();
    router.replace("/admin/login");
  };

  const handleToggleModule = (moduleId: string) => {
    setOpenModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const sidebar = (
    <Stack
      sx={{
        height: "100%",
        bgcolor: "customColors.headerBg",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Image
          src={assets.logo}
          alt="NutriHarvest"
          width={150}
          height={40}
          priority
          style={{ width: "150px", height: "auto" }}
        />
        <Typography variant="body2" color="text.secondary">
          Admin workspace
        </Typography>
      </Stack>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flex: 1, overflowY: "auto" }}>
        {/* Dashboard Link */}
        <ListItemButton
          component={Link}
          href="/admin"
          className="menuListSidebar"
          onClick={() => setMobileOpen(false)}
          selected={pathname === "/admin"}
          sx={{
            mb: 0.5,
            borderRadius: 2,
            color: pathname === "/admin" ? "primary.contrastText" : "text.primary",
            bgcolor: pathname === "/admin" ? "primary.main" : "transparent",
            "&.Mui-selected, &.Mui-selected:hover": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
            },
            "&:hover": {
              bgcolor: pathname === "/admin" ? "primary.main" : "action.hover",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: theme.spacing(5), color: "inherit" }}>
            <DashboardOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: pathname === "/admin" ? 700 : 500 }}>
                Dashboard
              </Typography>
            }
          />
        </ListItemButton>

        {/* Products Link */}
        <ListItemButton
          component={Link}
          href="/admin/products"
          onClick={() => setMobileOpen(false)}
          selected={pathname.startsWith("/admin/products")}
          className="menuListSidebar"
          sx={{
            mb: 0.5,
            borderRadius: 2,
            color: pathname.startsWith("/admin/products") ? "primary.contrastText" : "text.primary",
            bgcolor: pathname.startsWith("/admin/products") ? "primary.main" : "transparent",
            "&.Mui-selected, &.Mui-selected:hover": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
            },
            "&:hover": {
              bgcolor: pathname.startsWith("/admin/products") ? "primary.main" : "action.hover",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: theme.spacing(5), color: "inherit" }}>
            <Inventory2OutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: pathname.startsWith("/admin/products") ? 700 : 500 }}>
                Products
              </Typography>
            }
          />
        </ListItemButton>

        <Divider sx={{ my: 2 }} />

        {/* CMS Pages Header */}
        <Typography variant="overline" sx={{ px: 2, py: 1, display: "block", color: "text.secondary", fontWeight: 700, letterSpacing: "0.1em" }}>
          CMS Pages
        </Typography>

        {/* Dynamic Pages/Modules */}
        {modules.map(moduleData => {
          const mId = moduleData.moduleId || moduleData.id;
          const Icon = moduleIconMap[mId] || ArticleOutlinedIcon;
          const isOpen = Boolean(openModules[mId]);
          const isActiveModule = pathname.includes(`/content/${mId}/`);

          return (
            <React.Fragment key={mId}>
              <ListItemButton
                onClick={() => handleToggleModule(mId)}
                className="menuListSidebar"
                sx={{
                  mb: 0.5,
                  borderRadius: 2,
                  color: isActiveModule ? "primary.main" : "text.primary",
                  "&:hover": {
                    bgcolor: "action.hover",
                   
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: theme.spacing(5), color: "inherit" }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: isActiveModule ? 700 : 500 }}>
                      {moduleData.title}
                    </Typography>
                  }
                />
                {isOpen ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
              </ListItemButton>
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 2.5 }}>
                  {moduleData.records.map(record => {
                    const sectionPath = `/admin/content/${mId}/${record.id}`;
                    const active = pathname === sectionPath;

                    return (
                      <ListItemButton
                        key={record.id}
                        component={Link}
                        href={sectionPath}
                        onClick={() => setMobileOpen(false)}
                        selected={active}
                        className="menuListSidebar"
                        sx={{
                          mb: 0.5,
                          borderRadius: 2.5,
                          py: 0.75,
                          color: active ? "primary.contrastText" : "text.secondary",
                          bgcolor: active ? "primary.main" : "transparent",
                          "&.Mui-selected, &.Mui-selected:hover": {
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                          },
                          "&:hover": {
                            bgcolor: active ? "primary.main" : "action.hover",
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontSize: "0.8rem", fontWeight: active ? 700 : 500 }}>
                              {record.title}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}

        <Divider sx={{ my: 2 }} />

        {/* Media Link */}
        <ListItemButton
          component={Link}
          href="/admin/media"
          className="menuListSidebar"
          onClick={() => setMobileOpen(false)}
          selected={pathname === "/admin/media"}
          sx={{
            mb: 0.5,
            borderRadius: 2,
            color: pathname === "/admin/media" ? "primary.contrastText" : "text.primary",
            bgcolor: pathname === "/admin/media" ? "primary.main" : "transparent",
            "&.Mui-selected, &.Mui-selected:hover": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
            },
            "&:hover": {
              bgcolor: pathname === "/admin/media" ? "primary.main" : "action.hover",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: theme.spacing(5), color: "inherit" }}>
            <PhotoLibraryOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: pathname === "/admin/media" ? 700 : 500 }}>
                Media
              </Typography>
            }
          />
        </ListItemButton>

        {/* Settings Link */}
        <ListItemButton
          component={Link}
          href="/admin/settings"
          onClick={() => setMobileOpen(false)}
          selected={pathname === "/admin/settings"}
          className="menuListSidebar"
          sx={{
            mb: 0.5,
            borderRadius: 2,
            color: pathname === "/admin/settings" ? "primary.contrastText" : "text.primary",
            bgcolor: pathname === "/admin/settings" ? "primary.main" : "transparent",
            "&.Mui-selected, &.Mui-selected:hover": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
            },
            "&:hover": {
              bgcolor: pathname === "/admin/settings" ? "primary.main" : "action.hover",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: theme.spacing(5), color: "inherit" }}>
            <SettingsOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: pathname === "/admin/settings" ? 700 : 500 }}>
                Settings
              </Typography>
            }
          />
        </ListItemButton>
      </List>
      <Divider />
      <Stack spacing={1.5} sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 38, height: 38 }}>N</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
              {session?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {session?.role}
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<LogoutRoundedIcon />}
          onClick={handleLogout}
          sx={{ justifyContent: "flex-start", borderRadius: 2, textTransform: "none" }}
        >
          Logout
        </Button>
      </Stack>
    </Stack>
  );

  if (!isReady) {
    return (
      <Stack
        sx={{
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "customColors.lightCream",
        }}
      >
        <CircularProgress color="primary" />
      </Stack>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "customColors.greyLightBg" }}>
      {isDesktop ? (
        <Box component="aside" sx={{ width: drawerWidth, flexShrink: 0 }}>
          <Box sx={{ position: "fixed", width: drawerWidth, height: "100vh" }}>{sidebar}</Box>
        </Box>
      ) : (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}
        >
          {sidebar}
        </Drawer>
      )}

      <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
        <Stack
          component="header"
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: theme.zIndex.appBar,
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            px: { xs: 2, md: 4 },
            py: 2,
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            {!isDesktop && (
              <IconButton onClick={() => setMobileOpen(true)} aria-label="Open admin menu">
                <MenuRoundedIcon />
              </IconButton>
            )}
            <Box>
              <Typography variant="h4">Admin Dashboard</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage NutriHarvest content and commerce modules
              </Typography>
            </Box>
          </Stack>
          <Avatar sx={{ bgcolor: "secondary.main" }}>A</Avatar>
        </Stack>
        <Box sx={{ p: { xs: 2, md: 4 } }}>{children}</Box>
      </Box>
    </Box>
  );
}
