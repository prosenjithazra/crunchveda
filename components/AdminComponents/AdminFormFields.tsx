"use client";

import type { AdminSectionField } from "@/json/mock/admin";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import {
  Box,
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

type SectionFieldEditorProps = {
  field: AdminSectionField;
  onChange: (field: AdminSectionField) => void;
};

export function SectionFieldEditor({ field, onChange }: SectionFieldEditorProps) {
  if (field.type === "toggle") {
    return (
      <FormControlLabel
        control={<Switch checked={field.value} onChange={event => onChange({ ...field, value: event.target.checked })} />}
        label={field.label}
      />
    );
  }

  if (field.type === "select") {
    return (
      <FormControl fullWidth>
        <InputLabel>{field.label}</InputLabel>
        <Select label={field.label} value={field.value} onChange={event => onChange({ ...field, value: event.target.value })}>
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
    return (
      <Stack spacing={1}>
        <TextField
          fullWidth
          label={field.label}
          value={field.value}
          onChange={event => onChange({ ...field, value: event.target.value })}
          placeholder="/assets/example.png"
        />
        <Box
          sx={{
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "customColors.lightCream",
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <CloudUploadOutlinedIcon color="primary" />
            <Typography variant="body2" color="text.secondary">
              Upload control placeholder. Store a local asset path or future CDN URL here.
            </Typography>
          </Stack>
        </Box>
      </Stack>
    );
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
