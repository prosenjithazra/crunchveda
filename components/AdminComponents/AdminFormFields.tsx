"use client";

import type { AdminSectionField } from "@/json/mock/admin";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";


type SectionFieldEditorProps = {
  field: AdminSectionField;
  onChange: (field: AdminSectionField) => void;
};

// ─── Dedicated sub-component so hooks are ALWAYS at the top level ─────────────
function ImageFieldUploader({ field, onChange }: SectionFieldEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const extractUrl = (result: any): string =>
    result?.data?.url        ||
    result?.data?.secure_url ||
    result?.data?.imageUrl   ||
    result?.url              ||
    result?.secure_url       ||
    result?.imageUrl         ||
    result?.data?.path       ||
    result?.path             ||
    "";

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    onChange({ ...field, value: localUrl } as AdminSectionField);

    // Upload to backend via Next.js proxy (/api/upload/image → backend /upload/image)
    // This is the same endpoint as product images — no Cloudinary involved
    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const token =
        window.localStorage.getItem("token") ||
        window.localStorage.getItem("tocken") ||
        "";
      const res = await fetch("/api/upload/image", {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(result?.message || "Upload failed");
      }
      const uploadedUrl = extractUrl(result);
      if (!uploadedUrl) {
        // Backend uploaded but returned no URL — keep the local blob preview
        toast.success("Image uploaded. Preview shown.");
        return;
      }
      // Replace local blob URL with the permanent backend URL
      onChange({ ...field, value: uploadedUrl } as AdminSectionField);
      toast.success("Image uploaded successfully!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Image upload failed");
      // Keep the local preview so the user can retry save with the blob URL
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const previewSrc = typeof field.value === "string" ? field.value : "";

  return (
    <Stack spacing={1.5}>
      <TextField
        fullWidth
        label={field.label}
        value={previewSrc}
        onChange={(event) =>
          onChange({ ...field, value: event.target.value } as AdminSectionField)
        }
        placeholder="Paste image URL or pick a file below"
        helperText="Paste a URL directly, or click below to upload."
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Box
        onClick={() => !uploading && fileInputRef.current?.click()}
        sx={{
          p: 2,
          border: "1px dashed",
          borderColor: "primary.main",
          borderRadius: 2,
          bgcolor: "customColors.lightCream",
          cursor: uploading ? "not-allowed" : "pointer",
          textAlign: "center",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "center" }}>
          {uploading ? (
            <>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Uploading…
              </Typography>
            </>
          ) : (
            <>
              <CloudUploadOutlinedIcon color="primary" />
              <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                Click to upload image
              </Typography>
            </>
          )}
        </Stack>
      </Box>
      {previewSrc && (
        <Box sx={{ mt: 1, border: 1, borderColor: "divider", borderRadius: 2, overflow: "hidden", maxWidth: 220 }}>
          <img src={previewSrc} alt={field.label} style={{ width: "100%", height: "auto", display: "block" }} />
        </Box>
      )}
    </Stack>
  );
}

const VIDEO_UPLOAD_API = "/api/upload/video";

function VideoFieldUploader({ field, onChange }: SectionFieldEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const readApiJson = async (response: Response) => {
    const text = await response.text();

    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch {
      const preview = text.slice(0, 80).replace(/\s+/g, " ").trim();
      throw new Error(`Expected JSON from upload API but received: ${preview || "empty response"}`);
    }
  };

  const getUploadedUrl = (result: any) =>
    result?.data?.url ||
    result?.data?.secure_url ||
    result?.data?.videoUrl ||
    result?.url ||
    result?.secure_url ||
    result?.videoUrl ||
    "";

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (field.id === "bannerImage" || field.id === "bannerVideo") {
      const localUrl = URL.createObjectURL(file);
      onChange({ ...field, value: localUrl, file } as any);
      toast.success("File selected. It will be uploaded when you save.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    setUploading(true);
    try {
      const token = window.localStorage.getItem("token") || window.localStorage.getItem("tocken") || "";
      const res = await fetch(VIDEO_UPLOAD_API, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      const result = await readApiJson(res);
      if (!res.ok) {
        throw new Error(result.message || "Failed to upload video");
      }
      const uploadedUrl = getUploadedUrl(result);
      if (!uploadedUrl) {
        throw new Error("Video uploaded, but the API did not return a video URL.");
      }
      onChange({ ...field, value: uploadedUrl } as AdminSectionField);
      toast.success("Video uploaded successfully!");
    } catch (error: unknown) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Video upload failed",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Stack spacing={1.5}>
      <TextField
        fullWidth
        label={field.label}
        value={field.value}
        onChange={(event) =>
          onChange({ ...field, value: event.target.value } as AdminSectionField)
        }
        placeholder="/assets/example.mp4"
      />
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Box
        onClick={() => !uploading && fileInputRef.current?.click()}
        sx={{
          p: 2,
          border: "1px dashed",
          borderColor: "primary.main",
          borderRadius: 2,
          bgcolor: "customColors.lightCream",
          cursor: uploading ? "not-allowed" : "pointer",
          textAlign: "center",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          {uploading ? (
            <>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Uploading video to Cloudinary...
              </Typography>
            </>
          ) : (
            <>
              <CloudUploadOutlinedIcon color="primary" />
              <Typography
                variant="body2"
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                Click to upload video to Cloudinary
              </Typography>
            </>
          )}
        </Stack>
      </Box>
      {typeof field.value === "string" && field.value && (
        <Box
          sx={{
            mt: 1,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
            maxWidth: 320,
          }}
        >
          <video
            src={field.value}
            controls
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </Box>
      )}
    </Stack>
  );
}

const FEATURE_ICON_OPTIONS = [
  { value: "leaf", label: "Leaf (Organic)" },
  { value: "badge-check", label: "Badge Check (Quality)" },
  { value: "truck", label: "Truck (Delivery)" },
  { value: "package", label: "Package (Packing)" },
  { value: "eco", label: "Eco (Eco-Friendly)" },
  { value: "star", label: "Star (Top Rated)" },
  { value: "shield", label: "Shield (Safety)" },
  { value: "heart", label: "Heart (Health)" },
  { value: "spa", label: "Spa (Wellness)" },
  { value: "verified", label: "Verified (Certified)" },
  { value: "shipping", label: "Shipping (Logistics)" },
  { value: "inventory", label: "Inventory (Stock)" },
];

type FeatureItem = { icon: string; title: string; description: string };

export function FeatureItemsEditor({
  value,
  onChange,
}: {
  value: FeatureItem[];
  onChange: (items: FeatureItem[]) => void;
}) {
  const items: FeatureItem[] = value.length > 0 ? value : [
    { icon: "leaf", title: "", description: "" },
  ];

  const handleChange = (idx: number, key: keyof FeatureItem, val: string) => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, [key]: val } : item
    );
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...items, { icon: "leaf", title: "", description: "" }]);
  };

  const handleRemove = (idx: number) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Feature Cards
      </Typography>
      {items.map((item, idx) => (
        <Box
          key={idx}
          sx={{
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.paper",
            position: "relative",
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", minWidth: 60 }}>
                Feature {idx + 1}
              </Typography>
              <Box sx={{ flex: 1 }} />
              {items.length > 1 && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemove(idx)}
                  title="Remove feature"
                >
                  <RemoveCircleOutlineRoundedIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>

            <FormControl fullWidth size="small">
              <InputLabel>Icon</InputLabel>
              <Select
                label="Icon"
                value={item.icon}
                onChange={(e) => handleChange(idx, "icon", e.target.value)}
              >
                {FEATURE_ICON_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              label="Title"
              value={item.title}
              onChange={(e) => handleChange(idx, "title", e.target.value)}
              placeholder="e.g. 100% Organic"
            />

            <TextField
              fullWidth
              size="small"
              label="Description"
              value={item.description}
              onChange={(e) => handleChange(idx, "description", e.target.value)}
              multiline
              minRows={2}
              placeholder="Short description of this feature..."
            />
          </Stack>
        </Box>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddCircleOutlineRoundedIcon />}
        onClick={handleAdd}
        sx={{ textTransform: "none", borderRadius: 2, alignSelf: "flex-start" }}
      >
        Add Feature
      </Button>
    </Stack>
  );
}

type TimelineItem = { year: string; title: string; description: string; image?: string; _id?: string };

/** Inner component so hooks run at top level per milestone */
function MilestoneImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const extractUrl = (result: any): string =>
    result?.data?.url ||
    result?.data?.secure_url ||
    result?.data?.imageUrl ||
    result?.url ||
    result?.secure_url ||
    result?.imageUrl ||
    result?.data?.path ||
    result?.path ||
    "";

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Immediate local preview
    const localUrl = URL.createObjectURL(file);
    onChange(localUrl);

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const token =
        window.localStorage.getItem("token") ||
        window.localStorage.getItem("tocken") ||
        "";
      const res = await fetch("/api/upload/image", {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result?.message || "Upload failed");
      const uploadedUrl = extractUrl(result);
      if (uploadedUrl) {
        onChange(uploadedUrl);
        toast.success("Image uploaded successfully!");
      } else {
        toast.success("Image uploaded. Preview shown.");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <Stack spacing={1}>
      <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
        Milestone Image
      </Typography>

      {/* URL paste field */}
      <TextField
        fullWidth
        size="small"
        label="Image URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste image URL or click below to upload"
        helperText="Paste a URL, or click the area below to upload a file."
      />

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Upload dropzone */}
      <Box
        onClick={() => !uploading && fileInputRef.current?.click()}
        sx={{
          p: 1.5,
          border: "1px dashed",
          borderColor: "primary.main",
          borderRadius: 2,
          bgcolor: "customColors.lightCream",
          cursor: uploading ? "not-allowed" : "pointer",
          textAlign: "center",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "center" }}>
          {uploading ? (
            <>
              <CircularProgress size={16} />
              <Typography variant="caption" color="text.secondary">Uploading…</Typography>
            </>
          ) : (
            <>
              <CloudUploadOutlinedIcon color="primary" fontSize="small" />
              <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                Click to upload image
              </Typography>
            </>
          )}
        </Stack>
      </Box>

      {/* Preview */}
      {value && (
        <Box
          sx={{
            mt: 0.5,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
            maxWidth: 200,
          }}
        >
          <img
            src={value}
            alt="Milestone preview"
            style={{ width: "100%", height: "auto", display: "block" }}
            onError={(e: any) => { e.target.style.display = "none"; }}
          />
        </Box>
      )}
    </Stack>
  );
}

export function TimelineItemsEditor({
  value,
  onChange,
}: {
  value: TimelineItem[];
  onChange: (items: TimelineItem[]) => void;
}) {
  const items: TimelineItem[] =
    value.length > 0 ? value : [{ year: "", title: "", description: "", image: "" }];

  const handleChange = (
    idx: number,
    key: keyof Omit<TimelineItem, "_id">,
    val: string
  ) => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, [key]: val } : item
    );
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...items, { year: "", title: "", description: "", image: "" }]);
  };

  const handleRemove = (idx: number) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Timeline Milestones
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {items.length} milestone{items.length !== 1 ? "s" : ""}
        </Typography>
      </Stack>

      {items.map((item, idx) => (
        <Box
          key={item._id || idx}
          sx={{
            border: "1.5px solid",
            borderColor: "divider",
            borderRadius: 2.5,
            overflow: "hidden",
            bgcolor: "background.paper",
          }}
        >
          {/* Card Header */}
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              px: 2,
              py: 1.2,
              bgcolor: "action.hover",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 24,
                borderRadius: 1,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                mr: 1.5,
                flexShrink: 0,
                px: 1,
              }}
            >
              {item.year || `#${idx + 1}`}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
              {item.title || `Milestone ${idx + 1}`}
            </Typography>
            {item._id && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.disabled",
                  fontFamily: "monospace",
                  fontSize: 10,
                  mr: 1,
                }}
              >
                _id: {item._id.slice(-6)}
              </Typography>
            )}
            {items.length > 1 && (
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemove(idx)}
                title="Remove milestone"
              >
                <RemoveCircleOutlineRoundedIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>

          {/* Card Fields */}
          <Stack spacing={2} sx={{ p: 2 }}>
            {/* year + title row */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Year"
                  value={item.year}
                  onChange={(e) => handleChange(idx, "year", e.target.value)}
                  placeholder="e.g. 1924"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 9 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Title"
                  value={item.title}
                  onChange={(e) => handleChange(idx, "title", e.target.value)}
                  placeholder="e.g. The Founding Soil"
                />
              </Grid>
            </Grid>

            {/* description */}
            <TextField
              fullWidth
              size="small"
              label="Description"
              value={item.description}
              onChange={(e) => handleChange(idx, "description", e.target.value)}
              multiline
              minRows={2}
              placeholder="The first 40 acres are purchased..."
            />

            {/* image — uploadable */}
            <MilestoneImageUploader
              value={item.image || ""}
              onChange={(url) => handleChange(idx, "image", url)}
            />
          </Stack>
        </Box>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddCircleOutlineRoundedIcon />}
        onClick={handleAdd}
        sx={{ textTransform: "none", borderRadius: 2, alignSelf: "flex-start" }}
      >
        Add Milestone
      </Button>
    </Stack>
  );
}

type FaqItem = { question: string; answer: string };

export function FaqItemsEditor({
  value,
  onChange,
}: {
  value: FaqItem[];
  onChange: (items: FaqItem[]) => void;
}) {
  const items: FaqItem[] = value.length > 0 ? value : [
    { question: "", answer: "" },
  ];

  const handleChange = (idx: number, key: keyof FaqItem, val: string) => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, [key]: val } : item
    );
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...items, { question: "", answer: "" }]);
  };

  const handleRemove = (idx: number) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Frequently Asked Questions
      </Typography>
      {items.map((item, idx) => (
        <Box
          key={idx}
          sx={{
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.paper",
            position: "relative",
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", minWidth: 80 }}>
                FAQ #{idx + 1}
              </Typography>
              <Box sx={{ flex: 1 }} />
              {items.length > 1 && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemove(idx)}
                  title="Remove FAQ"
                >
                  <RemoveCircleOutlineRoundedIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>

            <TextField
              fullWidth
              size="small"
              label="Question"
              value={item.question}
              onChange={(e) => handleChange(idx, "question", e.target.value)}
              placeholder="e.g. How do you ensure freshness?"
            />

            <TextField
              fullWidth
              size="small"
              label="Answer"
              value={item.answer}
              onChange={(e) => handleChange(idx, "answer", e.target.value)}
              multiline
              minRows={2}
              placeholder="e.g. We source directly from farms..."
            />
          </Stack>
        </Box>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddCircleOutlineRoundedIcon />}
        onClick={handleAdd}
        sx={{ textTransform: "none", borderRadius: 2, alignSelf: "flex-start" }}
      >
        Add FAQ
      </Button>
    </Stack>
  );
}

type ReelItem = { image: string; link: string; alt: string };

type PhilosophyItem = { icon: string; title: string; description: string; _id?: string };

export function PhilosophyItemsEditor({
  value,
  onChange,
}: {
  value: PhilosophyItem[];
  onChange: (items: PhilosophyItem[]) => void;
}) {
  const items: PhilosophyItem[] =
    value.length > 0
      ? value
      : [{ icon: "", title: "", description: "" }];

  const handleChange = (
    idx: number,
    key: keyof Omit<PhilosophyItem, "_id">,
    val: string
  ) => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, [key]: val } : item
    );
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...items, { icon: "", title: "", description: "" }]);
  };

  const handleRemove = (idx: number) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Philosophy Cards
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {items.length} card{items.length !== 1 ? "s" : ""}
        </Typography>
      </Stack>

      {items.map((item, idx) => (
        <Box
          key={item._id || idx}
          sx={{
            border: "1.5px solid",
            borderColor: "divider",
            borderRadius: 2.5,
            overflow: "hidden",
            bgcolor: "background.paper",
          }}
        >
          {/* Card Header */}
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              px: 2,
              py: 1.2,
              bgcolor: "action.hover",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                mr: 1.5,
                flexShrink: 0,
              }}
            >
              {idx + 1}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
              {item.title || `Philosophy Card ${idx + 1}`}
            </Typography>
            {item._id && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.disabled",
                  fontFamily: "monospace",
                  fontSize: 10,
                  mr: 1,
                }}
              >
                _id: {item._id.slice(-6)}
              </Typography>
            )}
            {items.length > 1 && (
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemove(idx)}
                title="Remove philosophy card"
              >
                <RemoveCircleOutlineRoundedIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>

          {/* Card Fields */}
          <Stack spacing={2} sx={{ p: 2 }}>
            {/* icon field */}
            <TextField
              fullWidth
              size="small"
              label="Icon (URL or emoji)"
              value={item.icon}
              onChange={(e) => handleChange(idx, "icon", e.target.value)}
              placeholder='e.g. 🌿 or https://cdn.../leaf.svg (leave blank for default)'
              InputProps={{
                startAdornment: item.icon && !item.icon.startsWith("http") ? (
                  <Box component="span" sx={{ mr: 1, fontSize: 18 }}>
                    {item.icon}
                  </Box>
                ) : undefined,
              }}
            />

            {/* title field */}
            <TextField
              fullWidth
              size="small"
              label="Title"
              value={item.title}
              onChange={(e) => handleChange(idx, "title", e.target.value)}
              placeholder="e.g. Biodynamic Balance"
            />

            {/* description field */}
            <TextField
              fullWidth
              size="small"
              label="Description"
              value={item.description}
              onChange={(e) => handleChange(idx, "description", e.target.value)}
              multiline
              minRows={2}
              placeholder="Short description of this philosophy..."
            />
          </Stack>
        </Box>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddCircleOutlineRoundedIcon />}
        onClick={handleAdd}
        sx={{ textTransform: "none", borderRadius: 2, alignSelf: "flex-start" }}
      >
        Add Philosophy Card
      </Button>
    </Stack>
  );
}


export function InstagramReelsEditor({
  value,
  onChange,
}: {
  value: ReelItem[];
  onChange: (items: ReelItem[]) => void;
}) {
  const items: ReelItem[] = value.length > 0 ? value : [
    { image: "", link: "", alt: "" },
  ];

  const handleChange = (idx: number, key: keyof ReelItem, val: string) => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, [key]: val } : item
    );
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...items, { image: "", link: "", alt: "" }]);
  };

  const handleRemove = (idx: number) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== idx));
  };

  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeIdxRef = useRef<number | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const idx = activeIdxRef.current;
    if (!file || idx === null) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    handleChange(idx, "image", localUrl);

    const formData = new FormData();
    formData.append("image", file);

    setUploadingIdx(idx);
    try {
      const token =
        window.localStorage.getItem("token") ||
        window.localStorage.getItem("tocken") ||
        "";
      const res = await fetch("/api/upload/image", {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(result?.message || "Upload failed");
      }
      const uploadedUrl = result?.data?.url || result?.url || result?.path || result?.data?.path || "";
      if (uploadedUrl) {
        handleChange(idx, "image", uploadedUrl);
        toast.success("Cover image uploaded successfully!");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Cover upload failed");
    } finally {
      setUploadingIdx(null);
      event.target.value = "";
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Instagram Reels
      </Typography>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {items.map((item, idx) => (
        <Box
          key={idx}
          sx={{
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", minWidth: 80 }}>
                Reel #{idx + 1}
              </Typography>
              <Box sx={{ flex: 1 }} />
              {items.length > 1 && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemove(idx)}
                  title="Remove Reel"
                >
                  <RemoveCircleOutlineRoundedIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <Box
                  onClick={() => {
                    activeIdxRef.current = idx;
                    fileInputRef.current?.click();
                  }}
                  sx={{
                    width: "100%",
                    height: 120,
                    border: "1px dashed",
                    borderColor: "primary.main",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    position: "relative",
                    bgcolor: "customColors.lightCream",
                    "&:hover": { bgcolor: "rgba(32, 53, 39, 0.04)" }
                  }}
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt="Reel Cover"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <>
                      <CloudUploadOutlinedIcon color="primary" />
                      <Typography variant="caption" color="primary">Upload Cover</Typography>
                    </>
                  )}
                  {uploadingIdx === idx && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: "rgba(255, 255, 255, 0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 9 }}>
                <Stack spacing={1.5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Cover Image URL"
                    value={item.image}
                    onChange={(e) => handleChange(idx, "image", e.target.value)}
                    placeholder="Or upload/pick a file on the left"
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Instagram Reel URL"
                    value={item.link}
                    onChange={(e) => handleChange(idx, "link", e.target.value)}
                    placeholder="https://www.instagram.com/reel/..."
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Description / Alt text"
                    value={item.alt}
                    onChange={(e) => handleChange(idx, "alt", e.target.value)}
                    placeholder="e.g. Smoothie bowl breakfast"
                  />
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddCircleOutlineRoundedIcon />}
        onClick={handleAdd}
        sx={{ textTransform: "none", borderRadius: 2, alignSelf: "flex-start" }}
      >
        Add Reel
      </Button>
    </Stack>
  );
}

// ─── Main dispatcher — no hooks here, only conditional renders ────────────────
export function SectionFieldEditor({
  field,
  onChange,
}: SectionFieldEditorProps) {
  if (field.type === "toggle") {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={field.value}
            onChange={(event) =>
              onChange({ ...field, value: event.target.checked })
            }
          />
        }
        label={field.label}
      />
    );
  }

  if (field.type === "select") {
    return (
      <FormControl fullWidth>
        <InputLabel>{field.label}</InputLabel>
        <Select
          label={field.label}
          value={field.value}
          onChange={(event) =>
            onChange({ ...field, value: event.target.value })
          }
        >
          {field.options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  if (field.type === "image") {
    return <ImageFieldUploader field={field} onChange={onChange} />;
  }

  if (field.type === "video") {
    return <VideoFieldUploader field={field} onChange={onChange} />;
  }

  return (
    <TextField
      fullWidth
      type={field.type === "number" ? "number" : "text"}
      label={field.label}
      value={field.value}
      multiline={field.type === "textarea"}
      minRows={field.type === "textarea" ? 4 : undefined}
      onChange={(event) => onChange({ ...field, value: event.target.value })}
    />
  );
}
