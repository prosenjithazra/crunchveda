"use client";

import CategoryForm from "@/components/AdminComponents/CategoryForm";
import { categoryService } from "@/services/admin/categoryService";
import type { ICategory } from "@/types/category";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const [category, setCategory] = React.useState<ICategory | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    // We fetch all and find the one matching the id (the GET /categories API filters by slug,
    // so we get all and filter client-side)
    let active = true;
    categoryService.getAll().then(list => {
      if (!active) return;
      const found = list.find(c => c._id === params.id);
      if (found) {
        setCategory(found);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }).catch(err => {
      if (!active) return;
      toast.error(err instanceof Error ? err.message : "Failed to load category");
      setLoading(false);
      setNotFound(true);
    });
    return () => { active = false; };
  }, [params.id]);

  if (loading) {
    return (
      <Stack sx={{ alignItems: "center", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (notFound || !category) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="text.secondary">Category not found.</Typography>
      </Box>
    );
  }

  return <CategoryForm existing={category} />;
}
