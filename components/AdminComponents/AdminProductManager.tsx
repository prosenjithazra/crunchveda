"use client";

import type { AdminProductRecord, AdminStatus } from "@/json/mock/admin";
import { adminContentService } from "@/services/admin/contentService";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography, CircularProgress, Box } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import AdminBreadcrumb from "./AdminBreadcrumb";
import AdminDataTable, { type AdminTableColumn } from "./AdminDataTable";
import AdminModal from "./AdminModal";
import AdminPageHeader from "./AdminPageHeader";
import AdminStatusChip from "./AdminStatusChip";
import ConfirmDialog from "./ConfirmDialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type ProductImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
};

function ProductImageUploader({ value, onChange }: ProductImageUploaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

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
      toast.success("Product image uploaded successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Stack spacing={1}>
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
          p: 1.5,
          border: "1px dashed",
          borderColor: "primary.main",
          borderRadius: 2,
          bgcolor: "customColors.lightCream",
          cursor: uploading ? "not-allowed" : "pointer",
          textAlign: "center",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "center" }}>
          {uploading ? (
            <>
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">
                Uploading to Cloudinary...
              </Typography>
            </>
          ) : (
            <>
              <CloudUploadOutlinedIcon fontSize="small" color="primary" />
              <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                Upload Image to Cloudinary
              </Typography>
            </>
          )}
        </Stack>
      </Box>
      {value && (
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 2, overflow: "hidden", maxWidth: 120 }}>
          <img src={value} alt="Preview" style={{ width: "100%", height: "auto", display: "block" }} />
        </Box>
      )}
    </Stack>
  );
}

const blankProduct = (): AdminProductRecord => ({
  id: `product-${Date.now()}`,
  name: "",
  category: "",
  status: "Draft",
  price: "",
  defaultSize: "",
  rating: "",
  image: "",
  description: "",
  badge: "",
});

const columns: AdminTableColumn<AdminProductRecord>[] = [
  {
    key: "name",
    label: "Product",
    render: row => (
      <Stack spacing={0.5}>
        <Typography sx={{ fontWeight: 700 }}>{row.name}</Typography>
        <Typography variant="caption" color="text.secondary">
          {row.id}
        </Typography>
      </Stack>
    ),
  },
  { key: "category", label: "Category", render: row => row.category },
  { key: "price", label: "Price", render: row => row.price },
  { key: "size", label: "Default size", render: row => row.defaultSize },
  { key: "status", label: "Status", render: row => <AdminStatusChip status={row.status} /> },
];

export default function AdminProductManager() {
  const [products, setProducts] = React.useState<AdminProductRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingProduct, setEditingProduct] = React.useState<AdminProductRecord | null>(null);
  const [deleteProduct, setDeleteProduct] = React.useState<AdminProductRecord | null>(null);

  React.useEffect(() => {
    adminContentService.getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingProduct) {
      return;
    }

    if (!editingProduct.name.trim() || !editingProduct.category.trim()) {
      toast.error("Product name and category are required.");
      return;
    }

    const saved = await adminContentService.saveProduct(editingProduct);
    setProducts(prev => {
      const exists = prev.some(product => product.id === saved.id);
      return exists ? prev.map(product => (product.id === saved.id ? saved : product)) : [saved, ...prev];
    });
    setEditingProduct(null);
    toast.success("Product saved.");
  };

  const handleDelete = async () => {
    if (!deleteProduct) {
      return;
    }

    await adminContentService.deleteProduct(deleteProduct.id);
    setProducts(prev => prev.filter(product => product.id !== deleteProduct.id));
    setDeleteProduct(null);
    toast.success("Product deleted.");
  };

  const updateProduct = (patch: Partial<AdminProductRecord>) => {
    setEditingProduct(prev => (prev ? { ...prev, ...patch } : prev));
  };

  return (
    <>
      <AdminBreadcrumb items={[{ label: "Products" }]} />
      <AdminPageHeader
        title="Product Management"
        description="Add, edit, delete, and publish product records used by product listing, product detail, best-seller, saved, and gift sections."
        actionLabel="Add product"
        actionIcon={<AddRoundedIcon />}
        onAction={() => setEditingProduct(blankProduct())}
      />

      <AdminDataTable
        columns={columns}
        rows={products}
        loading={loading}
        getRowKey={row => row.id}
        emptyTitle="No products"
        emptyDescription="Add products with images, descriptions, categories, prices, and status toggles."
        onEdit={row => setEditingProduct({ ...row })}
        onDelete={row => setDeleteProduct(row)}
      />

      <AdminModal
        open={Boolean(editingProduct)}
        title={editingProduct?.id.startsWith("product-") ? "Add product" : "Edit product"}
        description="Manage product content and mock commerce fields."
        onClose={() => setEditingProduct(null)}
      >
        {editingProduct && (
          <Stack component="form" onSubmit={handleSave} spacing={3}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Product name"
                  value={editingProduct.name}
                  onChange={event => updateProduct({ name: event.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Category"
                  value={editingProduct.category}
                  onChange={event => updateProduct({ category: event.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Price"
                  value={editingProduct.price}
                  onChange={event => updateProduct({ price: event.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Default size"
                  value={editingProduct.defaultSize}
                  onChange={event => updateProduct({ defaultSize: event.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Rating"
                  value={editingProduct.rating}
                  onChange={event => updateProduct({ rating: event.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={editingProduct.status}
                    onChange={event => updateProduct({ status: event.target.value as AdminStatus })}
                  >
                    <MenuItem value="Published">Published</MenuItem>
                    <MenuItem value="Draft">Draft</MenuItem>
                    <MenuItem value="Archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Badge</InputLabel>
                  <Select
                    label="Badge"
                    value={editingProduct.badge || ""}
                    onChange={event => updateProduct({ badge: event.target.value as string })}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="BEST SELLER">Best Seller</MenuItem>
                    <MenuItem value="ORGANIC">Organic</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={1}>
                  <TextField
                    fullWidth
                    label="Image path"
                    value={editingProduct.image}
                    onChange={event => updateProduct({ image: event.target.value })}
                  />
                  <ProductImageUploader
                    value={editingProduct.image}
                    onChange={url => updateProduct({ image: url })}
                  />
                </Stack>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Description"
                  value={editingProduct.description}
                  onChange={event => updateProduct({ description: event.target.value })}
                />
              </Grid>
            </Grid>
            <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Save product
              </Button>
            </Stack>
          </Stack>
        )}
      </AdminModal>


      <ConfirmDialog
        open={Boolean(deleteProduct)}
        title="Delete product?"
        description={`This will remove ${deleteProduct?.name ?? "this product"} from the admin mock data for this session.`}
        onCancel={() => setDeleteProduct(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
