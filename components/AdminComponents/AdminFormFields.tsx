"use client";

import type { AdminSectionField } from "@/json/mock/admin";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import {
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type SectionFieldEditorProps = {
  field: AdminSectionField;
  onChange: (field: AdminSectionField) => void;
};

// ─── Dedicated sub-component so hooks are ALWAYS at the top level ─────────────
function ImageFieldUploader({ field, onChange }: SectionFieldEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await fetch(`${API_URL}/upload/image`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to upload image");
      }
      // Cast is safe: we only render this component when field.type === "image"
      onChange({ ...field, value: result.data.url } as AdminSectionField);
      toast.success("Image uploaded successfully!");
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Image upload failed");
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
        onChange={event => onChange({ ...field, value: event.target.value } as AdminSectionField)}
        placeholder="/assets/example.png"
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
                Uploading to Cloudinary...
              </Typography>
            </>
          ) : (
            <>
              <CloudUploadOutlinedIcon color="primary" />
              <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                Click to upload image to Cloudinary
              </Typography>
            </>
          )}
        </Stack>
      </Box>
      {field.value && (
        <Box sx={{ mt: 1, border: 1, borderColor: "divider", borderRadius: 2, overflow: "hidden", maxWidth: 200 }}>
          <img src={field.value} alt={field.label} style={{ width: "100%", height: "auto", display: "block" }} />
        </Box>
      )}
    </Stack>
  );
}

// ─── Main dispatcher — no hooks here, only conditional renders ────────────────
export function SectionFieldEditor({ field, onChange }: SectionFieldEditorProps) {
  if (field.type === "toggle") {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={field.value}
            onChange={event => onChange({ ...field, value: event.target.checked })}
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
          onChange={event => onChange({ ...field, value: event.target.value })}
        >
          {field.options.map(option => (
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

  return (
    <TextField
      fullWidth
      type={field.type === "number" ? "number" : "text"}
      label={field.label}
      value={field.value}
      multiline={field.type === "textarea"}
      minRows={field.type === "textarea" ? 4 : undefined}
      onChange={event => onChange({ ...field, value: event.target.value })}
    />
  );
}
