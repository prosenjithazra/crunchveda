"use client";

import { adminAuthService, type AdminSession } from "@/services/admin/authService";
import { assets } from "@/json/assest";
import { adminModules, type AdminModule } from "@/json/mock/admin";
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
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useContentModules } from "@/hooks/useContent";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
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
  "cart": ShoppingCartOutlinedIcon,
  "saved": FavoriteBorderOutlinedIcon,
};

// CMS modules excluded from sidebar (managed via dedicated pages)
const EXCLUDED_CMS_MODULES = ["contact-us", "privacy-policy", "terms-condition"];

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

  const sidebarModules = React.useMemo<AdminModule[]>(() => {
    if (!modules.length) return adminModules;

    const mergedModules: AdminModule[] = modules.map(moduleData => {
      const moduleId = moduleData.moduleId || moduleData.id;
      const fallbackModule = adminModules.find(item => item.id === moduleId || item.moduleId === moduleId);

      return {
        ...fallbackModule,
        ...moduleData,
        id: moduleData.id || fallbackModule?.id || moduleId,
        moduleId,
        title: moduleData.title || fallbackModule?.title || moduleId,
        records: moduleData.records?.length ? moduleData.records : fallbackModule?.records || [],
      };
    });

    adminModules.forEach(fallbackModule => {
      const exists = mergedModules.some(moduleData => (moduleData.moduleId || moduleData.id) === fallbackModule.id);
      if (!exists) {
        mergedModules.push(fallbackModule);
      }
    });

    return mergedModules;
  }, [modules]);

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
          alt="Crunchveda"
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

        {/* Categories Link */}
        <ListItemButton
          component={Link}
          href="/admin/categories"
          onClick={() => setMobileOpen(false)}
          selected={pathname.startsWith("/admin/categories")}
          className="menuListSidebar"
          sx={{
            mb: 0.5,
            borderRadius: 2,
            color: pathname.startsWith("/admin/categories") ? "primary.contrastText" : "text.primary",
            bgcolor: pathname.startsWith("/admin/categories") ? "primary.main" : "transparent",
            "&.Mui-selected, &.Mui-selected:hover": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
            },
            "&:hover": {
              bgcolor: pathname.startsWith("/admin/categories") ? "primary.main" : "action.hover",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: theme.spacing(5), color: "inherit" }}>
            <CategoryOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: pathname.startsWith("/admin/categories") ? 700 : 500 }}>
                Categories
              </Typography>
            }
          />
        </ListItemButton>

        {/* Orders Link */}
        <ListItemButton
          component={Link}
          href="/admin/orders"
          onClick={() => setMobileOpen(false)}
          selected={pathname.startsWith("/admin/orders")}
          className="menuListSidebar"
          sx={{
            mb: 0.5,
            borderRadius: 2,
            color: pathname.startsWith("/admin/orders") ? "primary.contrastText" : "text.primary",
            bgcolor: pathname.startsWith("/admin/orders") ? "primary.main" : "transparent",
            "&.Mui-selected, &.Mui-selected:hover": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
            },
            "&:hover": {
              bgcolor: pathname.startsWith("/admin/orders") ? "primary.main" : "action.hover",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: theme.spacing(5), color: "inherit" }}>
            <ShoppingBagOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: pathname.startsWith("/admin/orders") ? 700 : 500 }}>
                Orders Management
              </Typography>
            }
          />
        </ListItemButton>

        {/* Bestsellers Link */}
        <ListItemButton
          component={Link}
          href="/admin/bestsellers"
          onClick={() => setMobileOpen(false)}
          selected={pathname.startsWith("/admin/bestsellers")}
          className="menuListSidebar"
          sx={{
            mb: 0.5,
            borderRadius: 2,
            color: pathname.startsWith("/admin/bestsellers") ? "primary.contrastText" : "text.primary",
            bgcolor: pathname.startsWith("/admin/bestsellers") ? "primary.main" : "transparent",
            "&.Mui-selected, &.Mui-selected:hover": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
            },
            "&:hover": {
              bgcolor: pathname.startsWith("/admin/bestsellers") ? "primary.main" : "action.hover",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: theme.spacing(5), color: "inherit" }}>
            <StarBorderOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: pathname.startsWith("/admin/bestsellers") ? 700 : 500 }}>
                Bestsellers
              </Typography>
            }
          />
        </ListItemButton>

        {/* Users Link */}
        <ListItemButton
          component={Link}
          href="/admin/users"
          onClick={() => setMobileOpen(false)}
          selected={pathname.startsWith("/admin/users")}
          className="menuListSidebar"
          sx={{
            mb: 0.5,
            borderRadius: 2,
            color: pathname.startsWith("/admin/users") ? "primary.contrastText" : "text.primary",
            bgcolor: pathname.startsWith("/admin/users") ? "primary.main" : "transparent",
            "&.Mui-selected, &.Mui-selected:hover": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
            },
            "&:hover": {
              bgcolor: pathname.startsWith("/admin/users") ? "primary.main" : "action.hover",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: theme.spacing(5), color: "inherit" }}>
            <PeopleOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: pathname.startsWith("/admin/users") ? 700 : 500 }}>
                Users Management
              </Typography>
            }
          />
        </ListItemButton>

        {/* Contact Queries Link */}
        <ListItemButton
          component={Link}
          href="/admin/contacts"
          onClick={() => setMobileOpen(false)}
          selected={pathname.startsWith("/admin/contacts")}
          className="menuListSidebar"
          sx={{
            mb: 0.5,
            borderRadius: 2,
            color: pathname.startsWith("/admin/contacts") ? "primary.contrastText" : "text.primary",
            bgcolor: pathname.startsWith("/admin/contacts") ? "primary.main" : "transparent",
            "&.Mui-selected, &.Mui-selected:hover": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
            },
            "&:hover": {
              bgcolor: pathname.startsWith("/admin/contacts") ? "primary.main" : "action.hover",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: theme.spacing(5), color: "inherit" }}>
            <ContactMailOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: pathname.startsWith("/admin/contacts") ? 700 : 500 }}>
                Contact Queries
              </Typography>
            }
          />
        </ListItemButton>

        {/* Newsletter Subscribers Link */}
        <ListItemButton
          component={Link}
          href="/admin/newsletter"
          onClick={() => setMobileOpen(false)}
          selected={pathname.startsWith("/admin/newsletter")}
          className="menuListSidebar"
          sx={{
            mb: 0.5,
            borderRadius: 2,
            color: pathname.startsWith("/admin/newsletter") ? "primary.contrastText" : "text.primary",
            bgcolor: pathname.startsWith("/admin/newsletter") ? "primary.main" : "transparent",
            "&.Mui-selected, &.Mui-selected:hover": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
            },
            "&:hover": {
              bgcolor: pathname.startsWith("/admin/newsletter") ? "primary.main" : "action.hover",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: theme.spacing(5), color: "inherit" }}>
            <EmailOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: pathname.startsWith("/admin/newsletter") ? 700 : 500 }}>
                Newsletter List
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
        {sidebarModules.filter(m => !EXCLUDED_CMS_MODULES.includes(m.moduleId || m.id)).map(moduleData => {
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

        {/* Store Config Link */}
        <ListItemButton
          component={Link}
          href="/admin/store-config"
          onClick={() => setMobileOpen(false)}
          selected={pathname.startsWith("/admin/store-config")}
          className="menuListSidebar"
          sx={{
            mb: 0.5,
            borderRadius: 2,
            color: pathname.startsWith("/admin/store-config") ? "primary.contrastText" : "text.primary",
            bgcolor: pathname.startsWith("/admin/store-config") ? "primary.main" : "transparent",
            "&.Mui-selected, &.Mui-selected:hover": { bgcolor: "primary.main", color: "primary.contrastText" },
            "&:hover": { bgcolor: pathname.startsWith("/admin/store-config") ? "primary.main" : "action.hover" },
          }}
        >
          <ListItemIcon sx={{ minWidth: theme.spacing(5), color: "inherit" }}>
            <TuneOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: pathname.startsWith("/admin/store-config") ? 700 : 500 }}>
                Store Config
              </Typography>
            }
          />
        </ListItemButton>

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
          <Avatar sx={{ bgcolor: "primary.main", width: 38, height: 38 }}>{session?.name.charAt(0).toUpperCase()}</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 700, lineHeight:'1' }}>
              {session?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{lineHeight:'1'}}>
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
                Manage Crunchveda content and commerce modules
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
