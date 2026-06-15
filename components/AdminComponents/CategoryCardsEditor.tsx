"use client";

import React, { useRef, useState } from "react";
import type { AdminContentRecord, AdminSectionField } from "@/json/mock/admin";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface CategoryCard {
  title: string;
  subtitle: string;
  description?: string;
  link: string;
  image: string;
}

type CategoryCardsEditorProps = {
  record: AdminContentRecord;
  onChange: (updatedRecord: AdminContentRecord) => void;
};

function parseCategoryCards(cardsStr: string, imagesStr: string, isGrid: boolean): CategoryCard[] {
  const cardLines = cardsStr.split("\n").filter(line => line.trim() !== "");
  const imageLines = imagesStr.split("\n").filter(line => line.trim() !== "");

  return cardLines.map((line, idx) => {
    const parts = line.split("|").map(p => p.trim());
    const image = imageLines[idx] || "";
    if (isGrid) {
      // Title | Subtitle | Description | Link
      return {
        title: parts[0] || "",
        subtitle: parts[1] || "",
        description: parts[2] || "",
        link: parts[3] || "",
        image,
      };
    } else {
      // Title | Subtitle / Item Count | Link
      return {
        title: parts[0] || "",
        subtitle: parts[1] || "",
        link: parts[2] || "",
        image,
      };
    }
  });
}

function serializeCategoryCards(cards: CategoryCard[], isGrid: boolean): { cardsStr: string; imagesStr: string } {
  const cardLines = cards.map(c => {
    if (isGrid) {
      return `${c.title} | ${c.subtitle} | ${c.description} | ${c.link}`;
    } else {
      return `${c.title} | ${c.subtitle} | ${c.link}`;
    }
  });
  const imageLines = cards.map(c => c.image);

  return {
    cardsStr: cardLines.join("\n"),
    imagesStr: imageLines.join("\n"),
  };
}

// ─── Inline Image Uploader for Cards ─────────────────────────────────────────
function CardImageUploader({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
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
      onChange(result.data.url);
      toast.success("Card image uploaded successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Stack spacing={1}>
      <TextField
        fullWidth
        size="small"
        label={label}
        value={value}
        onChange={event => onChange(event.target.value)}
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
          p: 1,
          border: "1px dashed",
          borderColor: "primary.main",
          borderRadius: 1.5,
          bgcolor: "customColors.lightCream",
          cursor: uploading ? "not-allowed" : "pointer",
          textAlign: "center",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "center" }}>
          {uploading ? (
            <>
              <CircularProgress size={14} />
              <Typography variant="caption" color="text.secondary">
                Uploading to Cloudinary...
              </Typography>
            </>
          ) : (
            <>
              <CloudUploadOutlinedIcon fontSize="small" color="primary" />
              <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                Click to upload image
              </Typography>
            </>
          )}
        </Stack>
      </Box>
      {value && (
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1.5, overflow: "hidden", maxWidth: 100, mt: 0.5 }}>
          <img src={value} alt="Preview" style={{ width: "100%", height: "auto", display: "block" }} />
        </Box>
      )}
    </Stack>
  );
}

export default function CategoryCardsEditor({ record, onChange }: CategoryCardsEditorProps) {
  const isGrid = record.id === "categories-grid";
  const cardsField = record.fields.find(f => f.id === "cards");
  const imagesField = record.fields.find(f => f.id === "imageSet");

  if (!cardsField || !imagesField) {
    return null;
  }

  const cardsStr = typeof cardsField.value === "string" ? cardsField.value : "";
  const imagesStr = typeof imagesField.value === "string" ? imagesField.value : "";

  const cards = parseCategoryCards(cardsStr, imagesStr, isGrid);

  const updateCardField = (index: number, key: keyof CategoryCard, value: string) => {
    const updatedCards = [...cards];
    updatedCards[index] = { ...updatedCards[index], [key]: value };
    saveCards(updatedCards);
  };

  const addCard = () => {
    const newCard: CategoryCard = {
      title: "New Category",
      subtitle: isGrid ? "Signature Selection" : "0 ITEMS",
      description: isGrid ? "Description goes here" : undefined,
      link: "/product?category=new",
      image: "",
    };
    saveCards([...cards, newCard]);
    toast.success("New card added.");
  };

  const removeCard = (index: number) => {
    const updatedCards = cards.filter((_, idx) => idx !== index);
    saveCards(updatedCards);
    toast.success("Card removed.");
  };

  const saveCards = (newCards: CategoryCard[]) => {
    const { cardsStr: serializedCards, imagesStr: serializedImages } = serializeCategoryCards(newCards, isGrid);
    const updatedFields = record.fields.map(field => {
      if (field.id === "cards") {
        return { ...field, value: serializedCards };
      }
      if (field.id === "imageSet") {
        return { ...field, value: serializedImages };
      }
      return field;
    }) as AdminSectionField[];

    onChange({
      ...record,
      fields: updatedFields,
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main" }}>
          {isGrid ? "Curated Collection Grid Cards" : "Curated Categories Carousel Cards"}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={addCard}
          sx={{ textTransform: "none", borderRadius: 1.5 }}
        >
          Add Card Item
        </Button>
      </Stack>

      <Stack spacing={2.5}>
        {cards.map((card, idx) => (
          <Paper
            key={idx}
            elevation={0}
            sx={{
              p: 2.5,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              bgcolor: "background.paper",
              position: "relative",
              "&:hover": {
                borderColor: "primary.light",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.03)",
              },
            }}
          >
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>
                Card #{idx + 1} — {card.title || "Untitled"}
              </Typography>
              {cards.length > 1 && (
                <IconButton size="small" color="error" onClick={() => removeCard(idx)}>
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Title"
                  value={card.title}
                  onChange={e => updateCardField(idx, "title", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label={isGrid ? "Subtitle" : "Item Count (e.g. 12 ITEMS)"}
                  value={card.subtitle}
                  onChange={e => updateCardField(idx, "subtitle", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Navigation Link"
                  value={card.link}
                  onChange={e => updateCardField(idx, "link", e.target.value)}
                />
              </Grid>

              {isGrid && (
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    size="small"
                    label="Description"
                    value={card.description || ""}
                    onChange={e => updateCardField(idx, "description", e.target.value)}
                  />
                </Grid>
              )}

              <Grid size={{ xs: 12, md: isGrid ? 4 : 12 }}>
                <CardImageUploader
                  value={card.image}
                  onChange={url => updateCardField(idx, "image", url)}
                  label="Image URL/Path"
                />
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
