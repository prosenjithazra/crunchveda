"use client";

import AdminBreadcrumb from "@/components/AdminComponents/AdminBreadcrumb";
import AdminDataTable, { type AdminTableColumn } from "@/components/AdminComponents/AdminDataTable";
import AdminPageHeader from "@/components/AdminComponents/AdminPageHeader";
import AdminStatusChip from "@/components/AdminComponents/AdminStatusChip";
import { adminContentService } from "@/services/admin/contentService";
import type { AdminModule, AdminProductRecord } from "@/json/mock/admin";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import PublishedWithChangesOutlinedIcon from "@mui/icons-material/PublishedWithChangesOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Box, Button, Chip, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const moduleColumns: AdminTableColumn<AdminModule>[] = [
  {
    key: "title",
    label: "Module",
    render: row => (
      <Stack spacing={0.5}>
        <Typography sx={{ fontWeight: 700 }}>{row.title}</Typography>
        <Typography variant="caption" color="text.secondary">
          {row.route}
        </Typography>
      </Stack>
    ),
  },
  { key: "type", label: "Type", render: row => row.pageType },
  { key: "records", label: "Records", render: row => row.records.length },
  {
    key: "status",
    label: "Primary status",
    render: row => <AdminStatusChip status={row.records[0]?.status ?? "Draft"} />,
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [modules, setModules] = React.useState<AdminModule[]>([]);
  const [products, setProducts] = React.useState<AdminProductRecord[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([adminContentService.getModules(), adminContentService.getProducts()]).then(([moduleData, productData]) => {
      setModules(moduleData);
      setProducts(productData);
      setLoading(false);
    });
  }, []);

  const allSections = modules.flatMap(module => module.records);
  const publishedCount = allSections.filter(section => section.status === "Published").length;
  const draftCount = allSections.filter(section => section.status === "Draft").length;
  const policyCount = modules.filter(module => module.pageType === "Policy").length;
  const commerceCount = modules.filter(module => module.pageType === "Commerce").length;
  const completion = allSections.length ? Math.round((publishedCount / allSections.length) * 100) : 0;

  const metrics = [
    { label: "Content modules", value: modules.length.toString(), icon: ArticleOutlinedIcon },
    { label: "Product records", value: products.length.toString(), icon: Inventory2OutlinedIcon },
    { label: "Published sections", value: publishedCount.toString(), icon: PublishedWithChangesOutlinedIcon },
    { label: "Draft queue", value: draftCount.toString(), icon: PendingActionsOutlinedIcon },
  ];

  const quickActions = [
    {
      title: "Homepage content",
      description: "Hero, categories, product cards, gift banner, and FAQ",
      href: "/admin/content/home",
      icon: EditNoteOutlinedIcon,
    },
    {
      title: "Product manager",
      description: "SKUs, prices, ratings, categories, images, and descriptions",
      href: "/admin/products",
      icon: Inventory2OutlinedIcon,
    },
    {
      title: "Category page",
      description: "Collection cards, gifting banner, and assurance feature row",
      href: "/admin/content/categories",
      icon: CategoryOutlinedIcon,
    },
    {
      title: "Media library",
      description: "Banner, card, hero, and gallery image references",
      href: "/admin/media",
      icon: ImageOutlinedIcon,
    },
  ];

  const pageTypeStats = [
    { label: "Commerce pages", value: commerceCount, color: "customColors.lightGreen" },
    { label: "Content pages", value: modules.filter(module => module.pageType === "Content").length, color: "customColors.lightYellow" },
    { label: "Utility pages", value: modules.filter(module => module.pageType === "Utility").length, color: "customColors.lightOrange" },
    { label: "Policy pages", value: policyCount, color: "customColors.lightGray" },
  ];

  return (
    <>
      <AdminBreadcrumb items={[{ label: "Dashboard" }]} />
      <AdminPageHeader
        title="Dashboard"
        description="A central workspace for managing NutriHarvest page sections, commerce content, products, media references, and admin settings."
        actionLabel="Edit homepage"
        actionIcon={<AddRoundedIcon />}
        onAction={() => router.push("/admin/content/home")}
      />

      <Paper
        sx={{
          mb: 3,
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          overflow: "hidden",
        }}
      >
        <Grid container spacing={3} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Stack spacing={2}>
              <Chip
                label="Admin content control"
                sx={{
                  width: "fit-content",
                  bgcolor: "customColors.lightGreen",
                  color: "primary.main",
                  fontWeight: 700,
                }}
              />
              <Box>
                <Typography variant="h2" sx={{ color: "inherit", fontSize: { xs: 28, md: 40 }, mb: 1 }}>
                  Manage every storefront page from one place
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.76)", maxWidth: 760 }}>
                  The admin modules now follow the actual frontend structure, including page headers, cards,
                  banners, filters, forms, policy sections, product records, and image fields.
                </Typography>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button component={Link} href="/admin/products" variant="contained" color="info">
                  Manage products
                </Button>
                <Button
                  component={Link}
                  href="/admin/media"
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(255,255,255,0.5)",
                    color: "primary.contrastText",
                    "&:hover": { borderColor: "primary.contrastText", bgcolor: "rgba(255,255,255,0.08)" },
                  }}
                >
                  Open media
                </Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: "rgba(255,255,255,0.1)", color: "inherit" }}>
              <Stack spacing={2}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h4" sx={{ color: "inherit" }}>
                    Publishing health
                  </Typography>
                  <Typography variant="h3" sx={{ color: "inherit" }}>
                    {completion}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={completion}
                  sx={{
                    height: 10,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.16)",
                    "& .MuiLinearProgress-bar": { bgcolor: "customColors.lightGreen" },
                  }}
                />
                <Grid container spacing={1.5}>
                  {pageTypeStats.map(item => (
                    <Grid key={item.label} size={{ xs: 6 }}>
                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(255,255,255,0.1)" }}>
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.72)" }}>
                          {item.label}
                        </Typography>
                        <Typography variant="h4" sx={{ color: "inherit" }}>
                          {item.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {metrics.map(metric => {
          const Icon = metric.icon;

          return (
            <Grid key={metric.label} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper sx={{ p: 2.5, borderRadius: 2, height: "100%" }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                  <Stack spacing={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      {metric.label}
                    </Typography>
                    <Typography variant="h2" sx={{ fontSize: 30 }}>
                      {metric.value}
                    </Typography>
                  </Stack>
                  <Stack
                    sx={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: "customColors.lightGreen",
                      color: "primary.main",
                    }}
                  >
                    <Icon />
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {quickActions.map(action => {
          const Icon = action.icon;

          return (
            <Grid key={action.href} size={{ xs: 12, md: 6, xl: 3 }}>
              <Paper
                component={Link}
                href={action.href}
                sx={{
                  display: "block",
                  height: "100%",
                  p: 2.5,
                  borderRadius: 2,
                  border: 1,
                  borderColor: "divider",
                  color: "inherit",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Stack spacing={2}>
                  <Stack
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 2,
                      bgcolor: "customColors.lightCream",
                      color: "primary.main",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon />
                  </Stack>
                  <Box>
                    <Typography variant="h4" sx={{ mb: 0.75 }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Paper sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, mb: 2 }}
        >
          <Box>
            <Typography variant="h4">Editable page modules</Typography>
            <Typography variant="body2" color="text.secondary">
              Each row maps to an existing frontend route and contains section-level admin fields.
            </Typography>
          </Box>
          <Button component={Link} href="/admin/settings" variant="outlined" startIcon={<SettingsOutlinedIcon />}>
            Settings
          </Button>
        </Stack>
        <AdminDataTable
          columns={moduleColumns}
          rows={modules}
          loading={loading}
          getRowKey={row => row.id}
          emptyTitle="No content modules"
          emptyDescription="Create a module to begin managing frontend content."
          onEdit={row => router.push(`/admin/content/${row.id}`)}
        />
      </Paper>
    </>
  );
}
