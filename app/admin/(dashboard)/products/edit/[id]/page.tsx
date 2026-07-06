"use client";

import React from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AdminBreadcrumb from "@/components/AdminComponents/AdminBreadcrumb";
import AdminPageHeader from "@/components/AdminComponents/AdminPageHeader";
import ProductFormStepper, { ProductFormState } from "@/components/AdminComponents/ProductFormStepper";
import { adminProductService, getCategoryId } from "@/services/admin/productService";
import type { IProduct, IProductCategory } from "@/types/product";

function productToForm(p: IProduct): ProductFormState {
  return {
    _id: p._id,
    name: p.name,
    slug: p.slug || "",
    description: p.description,
    price: p.price ?? 0,
    stock: p.stock,
    images: p.images || [],
    category: getCategoryId(p),
    badge: p.badge || "",
    dietary: p.dietary || [],
    sizePrices: p.sizePrices || {},  // already normalized by adminProductService
    defaultSize: p.defaultSize || "",
    isActive: p.isActive !== false,
    isBestseller: p.isBestseller === true,
    rating: p.rating?.number ?? p.ratings?.average ?? 5,
  };
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [product, setProduct] = React.useState<IProduct | null>(null);
  const [categories, setCategories] = React.useState<IProductCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    Promise.all([
      adminProductService.getAll(),
      adminProductService.getCategories(),
    ])
      .then(([products, cats]) => {
        const found = products.find((p) => p._id === id);
        if (!found) {
          toast.error("Product not found.");
          router.push("/admin/products");
          return;
        }
        setProduct(found);
        setCategories(cats);
      })
      .catch(() => toast.error("Failed to load product data."))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSave = async (form: ProductFormState) => {
    if (!form._id) return;
    setSaving(true);
    try {
      // Convert sizePrices Record → prices array for the new backend format
      const pricesArray = Object.entries(form.sizePrices).map(([size, price]) => ({ size, price }));
      const basePrice = pricesArray.length > 0 ? pricesArray[0].price : form.price;

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

      const saved = await adminProductService.update(form._id, formData);
      toast.success(`"${saved.name}" updated successfully!`);
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.message || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Stack sx={{ alignItems: "center", py: 12 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading product…
        </Typography>
      </Stack>
    );
  }

  if (!product) return null;

  return (
    <Box>
      <AdminBreadcrumb
        items={[
          { label: "Products", href: "/admin/products" },
          { label: `Edit: ${product.name}` },
        ]}
      />
      <AdminPageHeader
        title={`Edit: ${product.name}`}
        description="Update any product details across the 4 steps and save when done."
      />

      <Box sx={{ mt: 3 }}>
        <ProductFormStepper
          initialForm={productToForm(product)}
          categories={categories}
          saving={saving}
          onSave={handleSave}
          onCancel={() => router.push("/admin/products")}
        />
      </Box>
    </Box>
  );
}
