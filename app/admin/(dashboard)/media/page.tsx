"use client";

import AdminBreadcrumb from "@/components/AdminComponents/AdminBreadcrumb";
import AdminDataTable, { type AdminTableColumn } from "@/components/AdminComponents/AdminDataTable";
import AdminPageHeader from "@/components/AdminComponents/AdminPageHeader";
import { assets } from "@/json/assest";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

type MediaItem = {
  id: string;
  name: string;
  path: string;
  usage: string;
};

const mediaItems: MediaItem[] = [
  { id: "home-banner", name: "Home banner", path: assets.homeBannerImg, usage: "Homepage hero" },
  { id: "gift-banner", name: "Gift banner", path: assets.giftBannerBg, usage: "Homepage and gifts" },
  { id: "about-banner", name: "About banner", path: assets.aboutBanner, usage: "About page" },
  { id: "sustainability-hero", name: "Sustainability hero", path: assets.sustainabilityHeroBg, usage: "Sustainability page" },
  { id: "contact-hero", name: "Contact hero", path: assets.contactHeroShirt, usage: "Contact page" },
];

const columns: AdminTableColumn<MediaItem>[] = [
  { key: "name", label: "Asset", render: row => <Typography sx={{ fontWeight: 700 }}>{row.name}</Typography> },
  { key: "path", label: "Path", render: row => row.path },
  { key: "usage", label: "Usage", render: row => row.usage },
];

export default function AdminMediaPage() {
  return (
    <>
      <AdminBreadcrumb items={[{ label: "Media" }]} />
      <AdminPageHeader
        title="Media Library"
        description="Manage image references for banners, cards, galleries, and page content. Uploads are represented as mock path fields until a backend storage service is connected."
      >
        <Button variant="contained" startIcon={<CloudUploadOutlinedIcon />}>
          Upload asset
        </Button>
      </AdminPageHeader>

      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 2, bgcolor: "customColors.lightCream" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "center" } }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              Upload workflow placeholder
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Future API integration can replace these path fields with file upload, CDN URLs, validation, and image
              transformations.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <AdminDataTable
        columns={columns}
        rows={mediaItems}
        getRowKey={row => row.id}
        emptyTitle="No media assets"
        emptyDescription="Upload images for page banners, product galleries, and content cards."
      />
    </>
  );
}
