/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import toast from "react-hot-toast";
import AdminBreadcrumb from "@/components/AdminComponents/AdminBreadcrumb";
import AdminPageHeader from "@/components/AdminComponents/AdminPageHeader";
import { adminAuthService } from "@/services/admin/authService";

type SectionKey = "banner" | "stewardship" | "journey" | "quote" | "charter";

export default function AboutUsAdminPage() {
  const [activeTab, setActiveTab] = useState<SectionKey>("banner");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchSectionData = async (section: SectionKey) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/about-us/${section}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch section data");
      const json = await res.json();
      if (json.status === "success" && json.data?.[section]) {
        setFormData(json.data[section]);
      } else {
        setFormData({});
      }
    } catch (error) {
      console.error(error);
      toast.error(`Error loading ${section} section data.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionData(activeTab);
  }, [activeTab]);

  const handleFieldChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const session = adminAuthService.getSession();
      const token = session?.token || "";

      const res = await fetch(`/api/about-us/${activeTab}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save changes");
      const json = await res.json();
      if (json.status === "success") {
        toast.success("Section updated successfully.");
      } else {
        throw new Error(json.message || "Failed to save changes");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  const renderFormFields = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      );
    }

    switch (activeTab) {
      case "banner":
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Hero subtitle (Eyebrow)"
                value={formData.bannerLabel || ""}
                onChange={(e) => handleFieldChange("bannerLabel", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Hero Image URL"
                value={formData.bannerImage || ""}
                onChange={(e) => handleFieldChange("bannerImage", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="H1 headline"
                value={formData.bannerTitle || ""}
                onChange={(e) => handleFieldChange("bannerTitle", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Hero description paragraph"
                value={formData.bannerDescription || ""}
                onChange={(e) => handleFieldChange("bannerDescription", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.showSection !== false}
                    onChange={(e) => handleFieldChange("showSection", e.target.checked)}
                  />
                }
                label="Show Banner Section"
              />
            </Grid>
          </Grid>
        );

      case "stewardship":
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Eyebrow"
                value={formData.eyebrow || ""}
                onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Heading"
                value={formData.heading || ""}
                onChange={(e) => handleFieldChange("heading", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.image || ""}
                onChange={(e) => handleFieldChange("image", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Badge Number (e.g. 100+)"
                value={formData.badgeNumber || ""}
                onChange={(e) => handleFieldChange("badgeNumber", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Badge Text"
                value={formData.badgeText || ""}
                onChange={(e) => handleFieldChange("badgeText", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Quote"
                value={formData.quote || ""}
                onChange={(e) => handleFieldChange("quote", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.showSection !== false}
                    onChange={(e) => handleFieldChange("showSection", e.target.checked)}
                  />
                }
                label="Show Stewardship Section"
              />
            </Grid>
          </Grid>
        );

      case "journey":
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Eyebrow"
                value={formData.eyebrow || ""}
                onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Heading"
                value={formData.heading || ""}
                onChange={(e) => handleFieldChange("heading", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Steps (Format: Title | Description - Newline separated)"
                placeholder="Seed Heritage | Description...&#10;Mineral Enrichment | Description..."
                value={formData.steps || ""}
                onChange={(e) => handleFieldChange("steps", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Images Set (One URL per line)"
                placeholder="https://ik.imagekit.io/...&#10;https://ik.imagekit.io/..."
                value={formData.imageSet || ""}
                onChange={(e) => handleFieldChange("imageSet", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.showSection !== false}
                    onChange={(e) => handleFieldChange("showSection", e.target.checked)}
                  />
                }
                label="Show Artisanal Journey Section"
              />
            </Grid>
          </Grid>
        );

      case "quote":
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Quote Text"
                value={formData.quote || ""}
                onChange={(e) => handleFieldChange("quote", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Author Attribution"
                value={formData.author || ""}
                onChange={(e) => handleFieldChange("author", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.showSection !== false}
                    onChange={(e) => handleFieldChange("showSection", e.target.checked)}
                  />
                }
                label="Show Philosophy Quote Section"
              />
            </Grid>
          </Grid>
        );

      case "charter":
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Heading"
                value={formData.heading || ""}
                onChange={(e) => handleFieldChange("heading", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Report Link Href"
                value={formData.reportHref || ""}
                onChange={(e) => handleFieldChange("reportHref", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Report CTA Label"
                value={formData.reportLabel || ""}
                onChange={(e) => handleFieldChange("reportLabel", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={formData.description || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Sustainability Charters (Format: Title | Description - Newline separated)"
                placeholder="Water Safety | Description...&#10;CO2 Reduction | Description..."
                value={formData.charters || ""}
                onChange={(e) => handleFieldChange("charters", e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.showSection !== false}
                    onChange={(e) => handleFieldChange("showSection", e.target.checked)}
                  />
                }
                label="Show Sustainability Charter Section"
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <AdminBreadcrumb items={[{ label: "Content", href: "/admin" }, { label: "About Us Page" }]} />
      <AdminPageHeader
        title="About Us Page Editor"
        description="Edit the content, descriptions, and media elements on the public About Us page."
      />

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          aria-label="About Us page sections tabs"
        >
          <Tab value="banner" label="Hero Banner" />
          <Tab value="stewardship" label="Roots & Stewardship" />
          <Tab value="journey" label="Artisanal Journey" />
          <Tab value="quote" label="Philosophy Quote" />
          <Tab value="charter" label="Sustainability Charter" />
        </Tabs>
      </Box>

      <Paper sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 2 }} component="form" onSubmit={handleSave}>
        <Stack spacing={4}>
          <Box>{renderFormFields()}</Box>
          <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || saving}
              sx={{ minWidth: 140 }}
            >
              {saving ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}
