"use client";

import { adminAuthService, type AdminSession } from "@/services/admin/authService";
import { assets } from "@/json/assest";
import { adminNavigation } from "./adminNavigation";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import {
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

const drawerWidth = 280;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = React.useState(false);
  const [session, setSession] = React.useState<AdminSession | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

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
        {adminNavigation.map(item => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              selected={active}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                color: active ? "primary.contrastText" : "text.primary",
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
              <ListItemIcon sx={{ minWidth: theme.spacing(5), color: "inherit" }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: active ? 700 : 500 }}>
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
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
