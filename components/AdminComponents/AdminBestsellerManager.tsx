"use client";

import type { AdminProductRecord, AdminStatus } from "@/json/mock/admin";
import { adminContentService } from "@/services/admin/contentService";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Box,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
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
  badge: "BEST SELLER",
});

export default function AdminBestsellerManager() {
  const [allProducts, setAllProducts] = React.useState<AdminProductRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Modal states
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [addTab, setAddTab] = React.useState(0);
  const [selectedProductId, setSelectedProductId] = React.useState("");
  const [newBestseller, setNewBestseller] = React.useState<AdminProductRecord>(blankProduct());
  
  const [editingProduct, setEditingProduct] = React.useState<AdminProductRecord | null>(null);
  const [deleteProduct, setDeleteProduct] = React.useState<AdminProductRecord | null>(null);
  const [demoteProduct, setDemoteProduct] = React.useState<AdminProductRecord | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const fetchProducts = React.useCallback(async () => {
    try {
      const data = await adminContentService.getProducts();
      setAllProducts(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter bestseller products (badge is BEST SELLER)
  const bestsellerProducts = React.useMemo(() => {
    return allProducts.filter(p => p.badge?.toUpperCase() === "BEST SELLER");
  }, [allProducts]);

  // Filter non-bestseller products for the promotion dropdown
  const nonBestsellerProducts = React.useMemo(() => {
    return allProducts.filter(p => p.badge?.toUpperCase() !== "BEST SELLER");
  }, [allProducts]);

  const handlePromoteExisting = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedProductId) {
      toast.error("Please select a product to promote.");
      return;
    }

    const targetProduct = allProducts.find(p => p.id === selectedProductId);
    if (!targetProduct) return;

    setSubmitting(true);
    try {
      const updatedProduct = { ...targetProduct, badge: "BEST SELLER" };
      const saved = await adminContentService.saveProduct(updatedProduct);
      setAllProducts(prev => prev.map(p => (p.id === targetProduct.id ? saved : p)));
      setAddModalOpen(false);
      setSelectedProductId("");
      toast.success(`"${saved.name}" promoted to bestseller.`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateNew = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newBestseller.name.trim() || !newBestseller.category.trim()) {
      toast.error("Product name and category are required.");
      return;
    }

    setSubmitting(true);
    try {
      const saved = await adminContentService.saveProduct(newBestseller);
      setAllProducts(prev => [saved, ...prev]);
      setAddModalOpen(false);
      setNewBestseller(blankProduct());
      toast.success(`"${saved.name}" created and marked as bestseller.`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create bestseller product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name.trim() || !editingProduct.category.trim()) {
      toast.error("Product name and category are required.");
      return;
    }

    setSubmitting(true);
    try {
      const saved = await adminContentService.saveProduct(editingProduct);
      setAllProducts(prev => prev.map(p => (p.id === saved.id ? saved : p)));
      setEditingProduct(null);
      toast.success("Bestseller product updated successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemote = async () => {
    if (!demoteProduct) return;

    try {
      const updatedProduct = { ...demoteProduct, badge: "" };
      const saved = await adminContentService.saveProduct(updatedProduct);
      setAllProducts(prev => prev.map(p => (p.id === demoteProduct.id ? saved : p)));
      setDemoteProduct(null);
      toast.success(`"${demoteProduct.name}" removed from bestsellers.`);
    } catch (error: any) {
      toast.error(error.message || "Failed to demote product.");
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;

    try {
      await adminContentService.deleteProduct(deleteProduct.id);
      setAllProducts(prev => prev.filter(p => p.id !== deleteProduct.id));
      setDeleteProduct(null);
      toast.success("Product deleted completely.");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product.");
    }
  };

  const updateNewProductFields = (patch: Partial<AdminProductRecord>) => {
    setNewBestseller(prev => ({ ...prev, ...patch }));
  };

  const updateEditingProductFields = (patch: Partial<AdminProductRecord>) => {
    setEditingProduct(prev => (prev ? { ...prev, ...patch } : null));
  };

  const columns: AdminTableColumn<AdminProductRecord>[] = [
    {
      key: "name",
      label: "Bestseller Product",
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

  return (
    <>
      <AdminBreadcrumb items={[{ label: "Bestsellers" }]} />
      <AdminPageHeader
        title="Bestseller Management"
        description="View and manage products listed as crowd favorites / best sellers on the homepage and best-seller editorial sections."
        actionLabel="Add bestseller"
        actionIcon={<AddRoundedIcon />}
        onAction={() => {
          setNewBestseller(blankProduct());
          setAddModalOpen(true);
        }}
      />

      <AdminDataTable
        columns={columns}
        rows={bestsellerProducts}
        loading={loading}
        getRowKey={row => row.id}
        emptyTitle="No bestseller products"
        emptyDescription="Add bestseller products or promote existing items to highlight them."
        onEdit={row => setEditingProduct({ ...row })}
        onDelete={row => setDeleteProduct(row)}
        extraActions={[
          {
            label: "Remove from Bestsellers",
            icon: <RemoveCircleOutlineRoundedIcon fontSize="small" />,
            onClick: (row: AdminProductRecord) => setDemoteProduct(row),
            color: "warning.main",
          },
        ]}
      />

      {/* Add Bestseller Modal */}
      <AdminModal
        open={addModalOpen}
        title="Add Bestseller"
        description="Promote an existing product or create a new one as a bestseller."
        onClose={() => setAddModalOpen(false)}
      >
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={addTab}
            onChange={(_, val) => setAddTab(val)}
            sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
            variant="fullWidth"
          >
            <Tab label="Promote Existing Product" sx={{ textTransform: "none", fontWeight: 600 }} />
            <Tab label="Create New Bestseller" sx={{ textTransform: "none", fontWeight: 600 }} />
          </Tabs>

          {addTab === 0 ? (
            <Stack component="form" onSubmit={handlePromoteExisting} spacing={3}>
              <FormControl fullWidth required>
                <InputLabel>Select Product</InputLabel>
                <Select
                  value={selectedProductId}
                  onChange={event => setSelectedProductId(event.target.value)}
                  label="Select Product"
                >
                  {nonBestsellerProducts.map(p => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name} ({p.category} — {p.price || "N/A"})
                    </MenuItem>
                  ))}
                  {nonBestsellerProducts.length === 0 && (
                    <MenuItem disabled value="">
                      All products are already bestsellers
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

              <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={submitting || !selectedProductId}
                  startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <StarBorderOutlinedIcon />}
                >
                  {submitting ? "Promoting..." : "Promote to Bestseller"}
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Stack component="form" onSubmit={handleCreateNew} spacing={3}>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="Product name"
                    value={newBestseller.name}
                    onChange={event => updateNewProductFields({ name: event.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="Category"
                    value={newBestseller.category}
                    onChange={event => updateNewProductFields({ category: event.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Price"
                    value={newBestseller.price}
                    placeholder="e.g. 24.00"
                    onChange={event => updateNewProductFields({ price: event.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Default size"
                    value={newBestseller.defaultSize}
                    placeholder="e.g. 500g"
                    onChange={event => updateNewProductFields({ defaultSize: event.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Rating"
                    value={newBestseller.rating}
                    placeholder="e.g. 4.8"
                    onChange={event => updateNewProductFields({ rating: event.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      value={newBestseller.status}
                      onChange={event => updateNewProductFields({ status: event.target.value as AdminStatus })}
                    >
                      <MenuItem value="Published">Published</MenuItem>
                      <MenuItem value="Draft">Draft</MenuItem>
                      <MenuItem value="Archived">Archived</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    disabled
                    label="Badge"
                    value="BEST SELLER"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={1}>
                    <TextField
                      fullWidth
                      label="Image path"
                      value={newBestseller.image}
                      onChange={event => updateNewProductFields({ image: event.target.value })}
                    />
                    <ProductImageUploader
                      value={newBestseller.image}
                      onChange={url => updateNewProductFields({ image: url })}
                    />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Description"
                    value={newBestseller.description}
                    onChange={event => updateNewProductFields({ description: event.target.value })}
                  />
                </Grid>
              </Grid>

              <Divider />
              <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <AddRoundedIcon />}
                >
                  {submitting ? "Creating..." : "Create Bestseller"}
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>
      </AdminModal>

      {/* Edit Bestseller Modal */}
      <AdminModal
        open={Boolean(editingProduct)}
        title="Edit Bestseller Product"
        description="Update the content, pricing, and details of this bestseller."
        onClose={() => setEditingProduct(null)}
      >
        {editingProduct && (
          <Stack component="form" onSubmit={handleSaveEdit} spacing={3}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Product name"
                  value={editingProduct.name}
                  onChange={event => updateEditingProductFields({ name: event.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Category"
                  value={editingProduct.category}
                  onChange={event => updateEditingProductFields({ category: event.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Price"
                  value={editingProduct.price}
                  onChange={event => updateEditingProductFields({ price: event.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Default size"
                  value={editingProduct.defaultSize}
                  onChange={event => updateEditingProductFields({ defaultSize: event.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Rating"
                  value={editingProduct.rating}
                  onChange={event => updateEditingProductFields({ rating: event.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={editingProduct.status}
                    onChange={event => updateEditingProductFields({ status: event.target.value as AdminStatus })}
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
                    onChange={event => updateEditingProductFields({ badge: event.target.value as string })}
                  >
                    <MenuItem value="">None (Remove Bestseller)</MenuItem>
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
                    onChange={event => updateEditingProductFields({ image: event.target.value })}
                  />
                  <ProductImageUploader
                    value={editingProduct.image}
                    onChange={url => updateEditingProductFields({ image: url })}
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
                  onChange={event => updateEditingProductFields({ description: event.target.value })}
                />
              </Grid>
            </Grid>

            <Divider />
            <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {submitting ? "Saving..." : "Save Product"}
              </Button>
            </Stack>
          </Stack>
        )}
      </AdminModal>

      {/* Demote Confirm Dialog */}
      <ConfirmDialog
        open={Boolean(demoteProduct)}
        title="Remove from Bestsellers?"
        description={`This will remove the "BEST SELLER" badge from "${demoteProduct?.name}". The product will remain in the store database under the "Products" list.`}
        confirmLabel="Remove"
        onCancel={() => setDemoteProduct(null)}
        onConfirm={handleDemote}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={Boolean(deleteProduct)}
        title="Delete product completely?"
        description={`Are you sure you want to completely delete "${deleteProduct?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Completely"
        onCancel={() => setDeleteProduct(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
