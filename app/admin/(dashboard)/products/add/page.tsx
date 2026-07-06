/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AdminBreadcrumb from "@/components/AdminComponents/AdminBreadcrumb";
import AdminPageHeader from "@/components/AdminComponents/AdminPageHeader";
import ProductFormStepper, { ProductFormState } from "@/components/AdminComponents/ProductFormStepper";
import { adminProductService } from "@/services/admin/productService";
import type { IProductCategory } from "@/types/product";

const blankProduct = (): ProductFormState => ({
  name: "",
  slug: "",
  description: "",
  price: 0,
  stock: 100,
  images: [],
  category: "",
  badge: "",
  dietary: [],
  sizePrices: {},
  defaultSize: "",
  isActive: true,
  isBestseller: false,
  rating: 5,
});

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = React.useState<IProductCategory[]>([]);
  const [loadingCats, setLoadingCats] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    adminProductService.getCategories()
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoadingCats(false));
  }, []);

  const handleSave = async (form: ProductFormState) => {
    setSaving(true);
    try {
      // Convert sizePrices Record → prices array for the new backend format
      const pricesArray = Object.entries(form.sizePrices).map(([size, price]) => ({ size, price }));
      const basePrice = pricesArray.length > 0
        ? pricesArray[0].price
        : form.price;

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("slug", form.slug.trim().toLowerCase());
      formData.append("description", form.description);
      formData.append("price", String(basePrice));
      formData.append("stock", String(form.stock));
      formData.append("category", form.category);
      formData.append("badge", form.badge || "");
      formData.append("dietary", JSON.stringify(form.dietary || []));
      formData.append("prices", JSON.stringify(pricesArray));
      formData.append("sizePrices", JSON.stringify(form.sizePrices || {}));
      formData.append("defaultSize", form.defaultSize || (pricesArray[0]?.size ?? ""));
      formData.append("isActive", String(form.isActive));
      formData.append("isBestseller", String(!!form.isBestseller));
      formData.append("rating", JSON.stringify({ number: form.rating ?? 5, total: 10 }));
      formData.append("ratings", JSON.stringify({ average: form.rating ?? 5, count: 10 }));

      // Append files and existing image URLs
      form.images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img);
        } else if (typeof img === "string" && img.trim()) {
          formData.append("existingImages", img);
        }
      });

      const saved = await adminProductService.create(formData);
      toast.success(`"${saved.name}" created successfully!`);
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.message || "Failed to create product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <AdminBreadcrumb
        items={[
          { label: "Products", href: "/admin/products" },
          { label: "Add Product" },
        ]}
      />
      <AdminPageHeader
        title="Add New Product"
        description="Complete all 4 steps to create a new product. Your progress is saved as you navigate between steps."
      />

      {loadingCats ? (
        <Stack sx={{ alignItems: "center", py: 10 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading categories…
          </Typography>
        </Stack>
      ) : (
        <Box sx={{ mt: 3 }}>
          <ProductFormStepper
            initialForm={blankProduct()}
            categories={categories}
            saving={saving}
            onSave={handleSave}
            onCancel={() => router.push("/admin/products")}
          />
        </Box>
      )}
    </Box>
  );
}
