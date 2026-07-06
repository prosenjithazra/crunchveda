/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import toast from "react-hot-toast";
import type { IProductCategory } from "@/types/product";
import { generateSlug } from "@/services/admin/productService";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ProductFormState = {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: (string | File)[]; // images[0] = thumbnail, images[1+] = gallery
  category: string;
  badge: string;
  dietary: string[];
  sizePrices: Record<string, number>;
  defaultSize: string;
  isActive: boolean;
  isBestseller?: boolean;
  rating?: number;
};

type Props = {
  initialForm: ProductFormState;
  categories: IProductCategory[];
  saving: boolean;
  onSave: (form: ProductFormState) => void;
  onCancel: () => void;
};

// ─── Steps Config ──────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Basic Info" },
  { label: "Pricing & Stock" },
  { label: "Description & Tags" },
  { label: "Images" },
];

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0, mb: 4 }}>
      {STEPS.map((s, i) => {
        const isActive = i === step;
        const isCompleted = i < step;
        return (
          <React.Fragment key={s.label}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 15,
                  bgcolor: isCompleted
                    ? "success.main"
                    : isActive
                    ? "primary.main"
                    : "action.disabledBackground",
                  color: isCompleted || isActive ? "white" : "text.disabled",
                  transition: "all 0.25s ease",
                  boxShadow: isActive
                    ? "0 0 0 5px rgba(33,150,83, 0.15)"
                    : "none",
                }}
              >
                {isCompleted ? <CheckRoundedIcon sx={{ fontSize: 20 }} /> : i + 1}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  mt: 0.75,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive
                    ? "primary.main"
                    : isCompleted
                    ? "success.main"
                    : "text.disabled",
                  whiteSpace: "nowrap",
                  fontSize: 12,
                }}
              >
                {s.label}
              </Typography>
            </Box>
            {i < STEPS.length - 1 && (
              <Box
                sx={{
                  flex: 2,
                  height: 3,
                  mb: 3,
                  bgcolor: i < step ? "success.main" : "action.disabledBackground",
                  transition: "background-color 0.3s ease",
                  borderRadius: 2,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
}

// ─── Size Prices Editor ────────────────────────────────────────────────────────

function SizePricesEditor({
  value,
  onChange,
}: {
  value: Record<string, number>;
  onChange: (v: Record<string, number>) => void;
}) {
  const [newKey, setNewKey] = React.useState("");
  const [newVal, setNewVal] = React.useState("");

  const addEntry = () => {
    const k = newKey.trim();
    const v = parseFloat(newVal);
    if (!k || isNaN(v) || v < 0) {
      toast.error("Enter a valid size and price.");
      return;
    }
    onChange({ ...value, [k]: v });
    setNewKey("");
    setNewVal("");
  };

  const removeEntry = (key: string) => {
    const next = { ...value };
    delete next[key];
    onChange(next);
  };

  return (
    <Stack spacing={1.5}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>
        Size → Price Variants
      </Typography>
      {Object.keys(value).length === 0 ? (
        <Typography variant="caption" color="text.disabled" sx={{ fontStyle: "italic" }}>
          No size variants added yet. Use the fields below to add one.
        </Typography>
      ) : (
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
          {Object.entries(value).map(([k, v]) => (
            <Chip
              key={k}
              label={`${k}: ₹${v}`}
              onDelete={() => removeEntry(k)}
              size="small"
              variant="outlined"
              sx={{ fontFamily: "monospace", borderRadius: 1.5 }}
            />
          ))}
        </Stack>
      )}
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <TextField
          size="small"
          label="Size"
          placeholder="e.g. 250g"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          size="small"
          label="Price"
          type="number"
          placeholder="800"
          value={newVal}
          onChange={(e) => setNewVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addEntry();
            }
          }}
          slotProps={{
            input: { startAdornment: <InputAdornment position="start">₹</InputAdornment> },
          }}
          sx={{ width: 140 }}
        />
        <Tooltip title="Add size variant">
          <IconButton size="small" color="primary" onClick={addEntry}>
            <AddCircleOutlineRoundedIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}

// ─── Single Image Uploader ─────────────────────────────────────────────────────

function SingleImageUploader({
  onFileSelect,
  label = "Choose Image",
}: {
  onFileSelect: (file: File) => void;
  label?: string;
}) {
  const ref = React.useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <>
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      <Button
        size="small"
        variant="outlined"
        startIcon={<CloudUploadOutlinedIcon fontSize="small" />}
        onClick={() => ref.current?.click()}
        sx={{ textTransform: "none", borderRadius: 1.5 }}
      >
        {label}
      </Button>
    </>
  );
}

// ─── Multi Image Uploader ──────────────────────────────────────────────────────

function MultiImageUploader({ onFilesSelect }: { onFilesSelect: (files: File[]) => void }) {
  const ref = React.useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      onFilesSelect(files);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <>
      <input ref={ref} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleFiles} />
      <Button
        variant="outlined"
        startIcon={<CollectionsOutlinedIcon fontSize="small" />}
        onClick={() => ref.current?.click()}
        sx={{ textTransform: "none", borderRadius: 1.5 }}
      >
        Add Gallery Images
      </Button>
    </>
  );
}

// ─── Step 1: Basic Info ────────────────────────────────────────────────────────

function Step1BasicInfo({
  form,
  patch,
  categories,
}: {
  form: ProductFormState;
  patch: (p: Partial<ProductFormState>) => void;
  categories: IProductCategory[];
}) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          required
          label="Product Name"
          value={form.name}
          onChange={(e) => {
            const name = e.target.value;
            patch({ name, slug: form._id ? form.slug : generateSlug(name) });
          }}
          helperText="The public display name of this product"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          required
          label="Slug (URL key)"
          value={form.slug}
          onChange={(e) =>
            patch({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })
          }
          helperText="Auto-generated from name. Must be unique across all products."
          slotProps={{ input: { style: { fontFamily: "monospace" } } }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => patch({ category: e.target.value })}
          >
            {categories.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
          <InputLabel>Badge</InputLabel>
          <Select
            label="Badge"
            value={form.badge}
            onChange={(e) => patch({ badge: e.target.value })}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="BEST SELLER">Best Seller</MenuItem>
            <MenuItem value="DISCOUNT">New Launch</MenuItem>
            <MenuItem value="TOP RATED">Top Rated</MenuItem>
            <MenuItem value="ORGANIC">Organic</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Rating (0 - 5)"
          type="number"
          value={form.rating ?? 5}
          slotProps={{
            htmlInput: { min: 0, max: 5, step: 0.1 }
          }}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            patch({ rating: isNaN(val) ? undefined : val });
          }}
          helperText="Average product rating score"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            p: 2.5,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            bgcolor: "action.hover",
          }}
        >
          <Switch
            checked={form.isActive}
            onChange={(e) => patch({ isActive: e.target.checked })}
            color="success"
          />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {form.isActive ? "Active — Visible on storefront" : "Inactive — Hidden from storefront"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Toggle to control whether this product appears on the public site
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            p: 2.5,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            bgcolor: "action.hover",
          }}
        >
          <Switch
            checked={!!form.isBestseller}
            onChange={(e) => patch({ isBestseller: e.target.checked })}
            color="warning"
          />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {form.isBestseller ? "Bestseller — Promoted to Bestselling collections" : "Regular Product"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Toggle to promote this product to the bestseller lists
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

// ─── Step 2: Pricing & Stock ───────────────────────────────────────────────────

function Step2Pricing({
  form,
  patch,
}: {
  form: ProductFormState;
  patch: (p: Partial<ProductFormState>) => void;
}) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          required
          label="Base Price (₹)"
          type="number"
          value={form.price}
          onChange={(e) => patch({ price: parseFloat(e.target.value) || 0 })}
          slotProps={{
            input: { startAdornment: <InputAdornment position="start">₹</InputAdornment> },
          }}
          helperText="Starting or default price before size selection"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          required
          label="Stock Count"
          type="number"
          value={form.stock}
          onChange={(e) => patch({ stock: parseInt(e.target.value) || 0 })}
          helperText="Available inventory quantity"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Default Size"
          placeholder="e.g. 500g"
          value={form.defaultSize}
          onChange={(e) => patch({ defaultSize: e.target.value })}
          helperText="Most popular / pre-selected size variant"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Box sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 2, bgcolor: "background.paper" }}>
          <SizePricesEditor
            value={form.sizePrices}
            onChange={(v) => patch({ sizePrices: v })}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

// ─── Step 3: Description & Tags ───────────────────────────────────────────────

function Step3Description({
  form,
  patch,
}: {
  form: ProductFormState;
  patch: (p: Partial<ProductFormState>) => void;
}) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          required
          multiline
          minRows={6}
          label="Product Description"
          value={form.description}
          onChange={(e) => patch({ description: e.target.value })}
          helperText="Shown on the product detail page. Describe flavour, origin, uses, and health benefits."
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Dietary Tags"
          placeholder="e.g. Organic, Raw, Gluten-Free, Vegan"
          value={form.dietary.join(", ")}
          onChange={(e) =>
            patch({
              dietary: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
          helperText="Separate tags with commas"
        />
        {form.dietary.length > 0 && (
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75, mt: 1.5 }}>
            {form.dietary.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                onDelete={() => patch({ dietary: form.dietary.filter((t) => t !== tag) })}
                sx={{ borderRadius: 2, fontSize: 12 }}
              />
            ))}
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}

// ─── Step 4: Images ────────────────────────────────────────────────────────────

function Step4Images({
  form,
  patch,
}: {
  form: ProductFormState;
  patch: (p: Partial<ProductFormState>) => void;
}) {
  const thumbnail = form.images[0] || "";
  const gallery = form.images.slice(1);
  const [thumbUrlInput, setThumbUrlInput] = React.useState("");
  const [galleryUrlInput, setGalleryUrlInput] = React.useState("");

  const getImagePreview = (img: string | File) => {
    if (!img) return "";
    if (img instanceof File) {
      return URL.createObjectURL(img);
    }
    return img;
  };

  const setThumbnail = (fileOrUrl: string | File) => {
    patch({ images: [fileOrUrl, ...form.images.slice(1)] });
  };

  const removeThumbnail = () => {
    patch({ images: form.images.slice(1) });
  };

  const addGalleryImages = (filesOrUrls: (string | File)[]) => {
    const current = form.images[0] ? form.images : [];
    patch({ images: [...current, ...filesOrUrls] });
  };

  const removeGalleryImage = (idx: number) => {
    const newGallery = gallery.filter((_, i) => i !== idx);
    patch({ images: [thumbnail, ...newGallery].filter((x) => x !== undefined) });
  };

  return (
    <Stack spacing={5}>
      {/* ── Thumbnail ── */}
      <Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageOutlinedIcon sx={{ fontSize: 18, color: "white" }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1 }}>
              Thumbnail Image
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Primary image shown in product listings
            </Typography>
          </Box>
          <Chip label="Required" size="small" color="primary" variant="outlined" sx={{ fontSize: 11, height: 22, ml: "auto !important" }} />
        </Stack>

        <Grid container spacing={3}>
          {/* Preview */}
          <Grid size={{ xs: 12, sm: "auto" }}>
            <Box
              sx={{
                width: 200,
                height: 200,
                borderRadius: 3,
                border: "2px dashed",
                borderColor: thumbnail ? "primary.main" : "divider",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "action.hover",
                transition: "border-color 0.2s",
              }}
            >
              {thumbnail ? (
                <>
                  <Box
                    component="img"
                    src={getImagePreview(thumbnail)}
                    alt="Thumbnail preview"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      left: 10,
                      bgcolor: "primary.main",
                      color: "white",
                      fontSize: 10,
                      fontWeight: 800,
                      px: 1,
                      py: 0.3,
                      borderRadius: 1,
                      letterSpacing: 1,
                    }}
                  >
                    THUMBNAIL
                  </Box>
                  <IconButton
                    size="small"
                    color="error"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(255,255,255,0.9)",
                      "&:hover": { bgcolor: "white" },
                      p: 0.5,
                    }}
                    onClick={removeThumbnail}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </>
              ) : (
                <Stack sx={{ alignItems: "center", gap: 1 }}>
                  <ImageOutlinedIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                  <Typography variant="caption" color="text.disabled" sx={{ textAlign: "center", px: 2 }}>
                    No thumbnail yet
                  </Typography>
                </Stack>
              )}
            </Box>
          </Grid>

          {/* Controls */}
          <Grid size={{ xs: 12, sm: "grow" }}>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <SingleImageUploader
                onFileSelect={setThumbnail}
                label={thumbnail ? "Replace Thumbnail" : "Choose Thumbnail"}
              />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                  Or paste an image URL:
                </Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    placeholder="https://res.cloudinary.com/…"
                    value={thumbUrlInput}
                    onChange={(e) => setThumbUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (thumbUrlInput.trim()) {
                          setThumbnail(thumbUrlInput.trim());
                          setThumbUrlInput("");
                        }
                      }
                    }}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      if (thumbUrlInput.trim()) {
                        setThumbnail(thumbUrlInput.trim());
                        setThumbUrlInput("");
                      }
                    }}
                    sx={{ textTransform: "none", borderRadius: 1.5, whiteSpace: "nowrap" }}
                  >
                    Set Thumbnail
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Divider */}
      <Box sx={{ borderTop: "1px solid", borderColor: "divider" }} />

      {/* ── Gallery ── */}
      <Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: "secondary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CollectionsOutlinedIcon sx={{ fontSize: 18, color: "white" }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1 }}>
              Gallery Images
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Additional images shown in the product slider
            </Typography>
          </Box>
          <Chip
            label={`${gallery.length} added`}
            size="small"
            color="secondary"
            variant="outlined"
            sx={{ fontSize: 11, height: 22, ml: "auto !important" }}
          />
        </Stack>

        {/* Gallery grid */}
        {gallery.length > 0 && (
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 2, mb: 3 }}>
            {gallery.map((img, i) => (
              <Box key={i} sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={getImagePreview(img)}
                  alt={`Gallery image ${i + 1}`}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    display: "block",
                  }}
                />
                <IconButton
                  size="small"
                  color="error"
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    p: 0.3,
                    "&:hover": { bgcolor: "error.light", color: "white" },
                  }}
                  onClick={() => removeGalleryImage(i)}
                >
                  <CloseRoundedIcon sx={{ fontSize: 13 }} />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    bottom: 5,
                    left: 5,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    fontSize: 9,
                    px: 0.75,
                    py: 0.15,
                    borderRadius: 0.75,
                    fontWeight: 700,
                  }}
                >
                  #{i + 1}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}

        {/* Upload + paste controls */}
        <Stack spacing={2}>
          <Box>
            <MultiImageUploader onFilesSelect={addGalleryImages} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: "block" }}>
              You can select multiple files at once from the file picker
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
            <TextField
              size="small"
              placeholder="Paste gallery image URL here…"
              value={galleryUrlInput}
              onChange={(e) => setGalleryUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (galleryUrlInput.trim()) {
                    addGalleryImages([galleryUrlInput.trim()]);
                    setGalleryUrlInput("");
                  }
                }
              }}
              sx={{ flex: 1 }}
              helperText="Press Enter or click Add to add"
            />
            <Button
              variant="outlined"
              size="small"
              sx={{ textTransform: "none", borderRadius: 1.5, mt: 0.5 }}
              onClick={() => {
                if (galleryUrlInput.trim()) {
                  addGalleryImages([galleryUrlInput.trim()]);
                  setGalleryUrlInput("");
                }
              }}
            >
              Add
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}

// ─── Main Page-Style Stepper Component ────────────────────────────────────────

export default function ProductFormStepper({
  initialForm,
  categories,
  saving,
  onSave,
  onCancel,
}: Props) {
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState<ProductFormState>(initialForm);

  const patch = (partial: Partial<ProductFormState>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  };

  // ── Per-step validation ────────────────────────────────────────────────────
  const validateStep = (): boolean => {
    if (step === 0) {
      if (!form.name.trim()) { toast.error("Product name is required."); return false; }
      if (!form.slug.trim()) { toast.error("Slug is required."); return false; }
      if (!form.category) { toast.error("Please select a category."); return false; }
    }
    if (step === 1) {
      if (form.price < 0) { toast.error("Price cannot be negative."); return false; }
      if (form.stock < 0) { toast.error("Stock cannot be negative."); return false; }
    }
    if (step === 2) {
      if (!form.description.trim()) { toast.error("Description is required."); return false; }
    }
    if (step === 3) {
      if (!form.images.filter(Boolean).length) {
        toast.error("Please upload at least a thumbnail image.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    onSave(form);
  };

  const isEditing = Boolean(form._id);

  return (
    <Box>
      {/* ── Step Indicator ── */}
      <Box
        sx={{
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
          p: 3,
          mb: 3,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <StepIndicator step={step} />

        {/* Step label */}
        <Box sx={{ textAlign: "center", mt: -1 }}>
          <Typography variant="caption" color="text.secondary">
            Step {step + 1} of {STEPS.length}
          </Typography>
        </Box>
      </Box>

      {/* ── Step Content ── */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        id="product-form"
        sx={{
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
          p: { xs: 2.5, md: 4 },
          mb: 3,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          {STEPS[step].label}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {step === 0 && "Set the product's identity — name, URL, category, and visibility."}
          {step === 1 && "Define pricing, inventory, and available size variants."}
          {step === 2 && "Write a compelling description and add dietary labels."}
          {step === 3 && "Upload the main thumbnail and any additional gallery images."}
        </Typography>

        {step === 0 && <Step1BasicInfo form={form} patch={patch} categories={categories} />}
        {step === 1 && <Step2Pricing form={form} patch={patch} />}
        {step === 2 && <Step3Description form={form} patch={patch} />}
        {step === 3 && <Step4Images form={form} patch={patch} />}
      </Box>

      {/* ── Navigation Bar ── */}
      <Box
        sx={{
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={step === 0 ? onCancel : handleBack}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          {step === 0 ? "Cancel" : "Back"}
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {STEPS[step].label}
        </Typography>

        {step < STEPS.length - 1 ? (
          <Button
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={handleNext}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
          >
            Next: {STEPS[step + 1].label}
          </Button>
        ) : (
          <Button
            variant="contained"
            type="submit"
            form="product-form"
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SaveOutlinedIcon />
              )
            }
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 600,
              bgcolor: "success.main",
              "&:hover": { bgcolor: "success.dark" },
              px: 3,
            }}
          >
            {saving ? "Saving…" : isEditing ? "Update Product" : "Create Product"}
          </Button>
        )}
      </Box>
    </Box>
  );
}
