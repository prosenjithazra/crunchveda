"use client";

import type { ICategory } from "@/types/category";
import { categoryService, type CategoryPayload } from "@/services/admin/categoryService";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import AdminBreadcrumb from "@/components/AdminComponents/AdminBreadcrumb";
import AdminPageHeader from "@/components/AdminComponents/AdminPageHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type CategoryFormProps = {
  /** Existing category when editing; undefined when creating */
  existing?: ICategory;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function CategoryForm({ existing }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = Boolean(existing);

  const [form, setForm] = useState<CategoryPayload>({
    name: existing?.name ?? "",
    slug: existing?.slug ?? "",
    description: existing?.description ?? "",
    image: existing?.image ?? "",
    isActive: existing?.isActive ?? true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (key: keyof CategoryPayload, value: string | boolean) => {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      // Auto-generate slug from name (only when creating or slug hasn't been manually edited)
      if (key === "name" && !isEdit) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    // Generate a temporary local URL for preview
    setForm(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    toast.success("Image selected!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) { toast.error("Category name is required."); return; }
    if (!form.slug.trim()) { toast.error("Slug is required."); return; }
    if (!form.description.trim()) { toast.error("Description is required."); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("slug", form.slug.trim());
      formData.append("description", form.description.trim());
      formData.append("isActive", String(form.isActive));

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (form.image) {
        formData.append("image", form.image);
      }

      if (isEdit && existing) {
        await categoryService.update(existing._id, formData);
        toast.success(`"${form.name}" updated successfully.`);
      } else {
        await categoryService.create(formData);
        toast.success(`"${form.name}" created successfully.`);
      }
      router.push("/admin/categories");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <AdminBreadcrumb
        items={[
          { label: "Categories", href: "/admin/categories" },
          { label: isEdit ? "Edit Category" : "Add Category" },
        ]}
      />
      <AdminPageHeader
        title={isEdit ? `Edit — ${existing?.name}` : "Add Category"}
        description={isEdit ? "Update the details of this category." : "Fill in the details to create a new product category."}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => router.push("/admin/categories")}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Back to list
        </Button>
      </AdminPageHeader>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: { xs: 2.5, md: 3.5 },
          border: 1,
          borderColor: "divider",
          borderRadius: 2.5,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5 }}>
          Category Details
        </Typography>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="Category Name"
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              placeholder="e.g. Almonds"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="Slug"
              value={form.slug}
              onChange={e => handleChange("slug", slugify(e.target.value))}
              placeholder="e.g. almonds"
              helperText="URL-friendly identifier. Auto-filled from name."
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              required
              label="Description"
              multiline
              minRows={3}
              value={form.description}
              onChange={e => handleChange("description", e.target.value)}
              placeholder="Brief description of this category…"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 0.5 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 2 }}>
              Category Image
            </Typography>

            <Stack spacing={1.5}>
              <TextField
                fullWidth
                label="Image URL"
                value={form.image ?? ""}
                onChange={e => handleChange("image", e.target.value)}
                placeholder="/assets/almonds.png or https://…"
              />

              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <Box
                onClick={() => fileRef.current?.click()}
                sx={{
                  p: 2.5,
                  border: "1px dashed",
                  borderColor: "primary.main",
                  borderRadius: 2,
                  bgcolor: "customColors.lightCream",
                  cursor: "pointer",
                  textAlign: "center",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "center" }}>
                  <CloudUploadOutlinedIcon color="primary" />
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                    Click to choose category image
                  </Typography>
                </Stack>
              </Box>

              {form.image && (
                <Box
                  sx={{
                    mt: 1,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    overflow: "hidden",
                    maxWidth: 180,
                  }}
                >
                  <img
                    src={form.image}
                    alt="Preview"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </Box>
              )}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 0.5 }} />
            <FormControlLabel
              sx={{ mt: 2 }}
              control={
                <Switch
                  checked={form.isActive}
                  onChange={e => handleChange("isActive", e.target.checked)}
                  color="success"
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {form.isActive ? "Active (visible on site)" : "Inactive (hidden from site)"}
                </Typography>
              }
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={() => router.push("/admin/categories")}
            sx={{ textTransform: "none", borderRadius: 2 }}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SaveRoundedIcon />}
            disabled={submitting}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
          >
            {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Category"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
