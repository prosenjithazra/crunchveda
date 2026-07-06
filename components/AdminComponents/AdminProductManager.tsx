/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { IProduct, IProductCategory } from "@/types/product";
import {
  adminProductService,
  getCategoryName,
} from "@/services/admin/productService";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AdminBreadcrumb from "./AdminBreadcrumb";
import AdminPageHeader from "./AdminPageHeader";
import ConfirmDialog from "./ConfirmDialog";

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AdminProductManager() {
  const router = useRouter();
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [deleteTarget, setDeleteTarget] = React.useState<IProduct | null>(null);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);

  // ── Load data ────────────────────────────────────────────────────────────────
  const loadData = React.useCallback(async () => {
    try {
      const prods = await adminProductService.getAll();
      setProducts(prods);
    } catch (err: any) {
      toast.error(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);


  const handleToggle = async (product: IProduct) => {
    setTogglingId(product._id);
    try {
      const updated = await adminProductService.toggleStatus(product._id, !product.isActive);
      setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminProductService.remove(deleteTarget._id);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success(`"${deleteTarget.name}" deleted.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product.");
    } finally {
      setDeleteTarget(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Box>
      <AdminBreadcrumb items={[{ label: "Products" }]} />
      <AdminPageHeader
        title="Product Management"
        description="Add, edit, delete, and manage all product records. Changes are saved to the database immediately."
      >
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => router.push("/admin/products/add")}
          sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
        >
          Add Product
        </Button>
      </AdminPageHeader>

      {/* Product Table */}
      <Box
        sx={{
          mt: 3,
          border: 1,
          borderColor: "divider",
          borderRadius: 2.5,
          overflow: "hidden",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {loading ? (
          <Stack sx={{ alignItems: "center", py: 8 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading products…
            </Typography>
          </Stack>
        ) : products.length === 0 ? (
          <Stack sx={{ alignItems: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No products yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => router.push("/admin/products/add")}
              sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}
            >
              Add your first product
            </Button>
          </Stack>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "#fafaf8",
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  {[
                    "Image",
                    "Name",
                    "Category",
                    "Price",
                    "Stock",
                    "Badge",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: 700,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p._id}
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    <td style={{ padding: "10px 16px" }}>
                      {p.images?.[0] ? (
                        <Box
                          component="img"
                          src={p.images[0]}
                          alt={p.name}
                          sx={{
                            width: 44,
                            height: 44,
                            objectFit: "cover",
                            borderRadius: 1.5,
                            border: 1,
                            borderColor: "divider",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 1.5,
                            bgcolor: "action.hover",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="caption" color="text.disabled">
                            No img
                          </Typography>
                        </Box>
                      )}
                    </td>
                    <td style={{ padding: "10px 16px", maxWidth: 200 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {p.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontFamily: "monospace" }}
                      >
                        {p.slug}
                      </Typography>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <Typography variant="body2">{getCategoryName(p)}</Typography>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{(
                          p.price ??
                          (p.sizePrices ? Object.values(p.sizePrices)[0] : 0) ??
                          0
                        ).toFixed(2)}
                      </Typography>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <Chip
                        label={p.stock}
                        size="small"
                        color={p.stock > 0 ? "default" : "error"}
                        variant="outlined"
                      />
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      {p.badge ? (
                        <Chip
                          label={p.badge}
                          size="small"
                          color={p.badge === "BEST SELLER" ? "warning" : "success"}
                        />
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          None
                        </Typography>
                      )}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <Tooltip
                        title={p.isActive ? "Click to deactivate" : "Click to activate"}
                      >
                        <Switch
                          size="small"
                          checked={p.isActive}
                          disabled={togglingId === p._id}
                          onChange={() => handleToggle(p)}
                          color="success"
                        />
                      </Tooltip>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Edit product">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => router.push(`/admin/products/edit/${p._id}`)}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete product">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteTarget(p)}
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        )}
      </Box>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Product?"
        description={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
