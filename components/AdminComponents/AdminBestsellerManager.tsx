/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { IProduct, IProductCategory } from "@/types/product";
import {
  adminProductService,
  getCategoryName,
} from "@/services/admin/productService";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import AdminBreadcrumb from "./AdminBreadcrumb";
import AdminPageHeader from "./AdminPageHeader";
import AdminModal from "./AdminModal";
import ConfirmDialog from "./ConfirmDialog";

export default function AdminBestsellerManager() {
  const [allProducts, setAllProducts] = React.useState<IProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  // Modals
  const [promoteModalOpen, setPromoteModalOpen] = React.useState(false);
  const [selectedPromoteId, setSelectedPromoteId] = React.useState("");
  const [demoteTarget, setDemoteTarget] = React.useState<IProduct | null>(null);

  // ── Load ────────────────────────────────────────────────────────────────────
  const loadProducts = React.useCallback(async () => {
    try {
      const prods = await adminProductService.getAll();
      setAllProducts(prods);
    } catch (err: any) {
      toast.error(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ── Derived lists ────────────────────────────────────────────────────────────
  const bestsellerProducts = React.useMemo(
    () => allProducts.filter((p) => p.isBestseller || p.badge?.toUpperCase() === "BEST SELLER"),
    [allProducts]
  );

  const nonBestsellerProducts = React.useMemo(
    () => allProducts.filter((p) => !p.isBestseller && p.badge?.toUpperCase() !== "BEST SELLER"),
    [allProducts]
  );

  // ── Promote existing product ─────────────────────────────────────────────────
  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPromoteId) {
      toast.error("Please select a product.");
      return;
    }
    setSubmitting(true);
    try {
      const updated = await adminProductService.promoteToBestseller(selectedPromoteId);
      setAllProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      toast.success(`"${updated.name}" is now a Bestseller!`);
      setPromoteModalOpen(false);
      setSelectedPromoteId("");
    } catch (err: any) {
      toast.error(err.message || "Failed to promote product.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Demote (remove badge) ────────────────────────────────────────────────────
  const handleConfirmDemote = async () => {
    if (!demoteTarget) return;
    try {
      const updated = await adminProductService.demoteFromBestseller(demoteTarget._id);
      setAllProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      toast.success(`"${demoteTarget.name}" removed from bestsellers.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to demote product.");
    } finally {
      setDemoteTarget(null);
    }
  };



  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Box>
      <AdminBreadcrumb items={[{ label: "Bestsellers" }]} />
      <AdminPageHeader
        title="Bestseller Management"
        description="Products with the 'BEST SELLER' badge appear on the homepage best-selling section, the bestseller page, and all related CMS sections."
      >
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            setSelectedPromoteId("");
            setPromoteModalOpen(true);
          }}
          sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
        >
          Add Bestseller
        </Button>
      </AdminPageHeader>

      {/* Table */}
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
              Loading bestsellers…
            </Typography>
          </Stack>
        ) : bestsellerProducts.length === 0 ? (
          <Stack sx={{ alignItems: "center", py: 8 }}>
            <StarRoundedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography variant="h6" color="text.secondary">
              No bestseller products yet.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Promote an existing product to give it the "BEST SELLER" badge.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => setPromoteModalOpen(true)}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Add Bestseller
            </Button>
          </Stack>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#fafaf8", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  {["Image", "Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
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
                {bestsellerProducts.map((p) => (
                  <tr key={p._id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
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
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {p.name}
                      </Typography>
                      <Chip label="BEST SELLER" size="small" color="warning" sx={{ mt: 0.5, fontSize: 10 }} />
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
                        label={p.stock > 10 ? `In Stock (${p.stock})` : p.stock > 0 ? `Low Stock (${p.stock})` : "Out of Stock (0)"}
                        size="small"
                        color={p.stock > 10 ? "success" : p.stock > 0 ? "warning" : "error"}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <Chip
                        label={p.isActive ? "Active" : "Inactive"}
                        size="small"
                        color={p.isActive ? "success" : "default"}
                        variant="outlined"
                      />
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Remove Bestseller badge (keeps product)">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => setDemoteTarget(p)}
                          >
                            <RemoveCircleOutlineRoundedIcon fontSize="small" />
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

      {/* Promote modal */}
      <AdminModal
        open={promoteModalOpen}
        title="Add Bestseller"
        description="Select an existing product to promote it to Bestseller status. To create a new product, go to Product Management first."
        onClose={() => setPromoteModalOpen(false)}
      >
        <Stack component="form" onSubmit={handlePromote} spacing={3}>
          <FormControl fullWidth required>
            <InputLabel>Select product to promote</InputLabel>
            <Select
              value={selectedPromoteId}
              label="Select product to promote"
              onChange={(e) => setSelectedPromoteId(e.target.value)}
            >
              {nonBestsellerProducts.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  <Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {p.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getCategoryName(p)} — ₹{(
                        p.price ??
                        (p.sizePrices ? Object.values(p.sizePrices)[0] : 0) ??
                        0
                      ).toFixed(2)}
                    </Typography>
                  </Stack>
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
            <Button variant="outlined" onClick={() => setPromoteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={submitting || !selectedPromoteId}
              startIcon={
                submitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <StarRoundedIcon />
                )
              }
            >
              {submitting ? "Promoting…" : "Promote to Bestseller"}
            </Button>
          </Stack>
        </Stack>
      </AdminModal>

      {/* Demote confirm */}
      <ConfirmDialog
        open={Boolean(demoteTarget)}
        title="Remove Bestseller Badge?"
        description={`This will remove the "BEST SELLER" badge from "${demoteTarget?.name}". The product remains in the database — only the badge is cleared.`}
        confirmLabel="Remove Badge"
        onCancel={() => setDemoteTarget(null)}
        onConfirm={handleConfirmDemote}
      />


    </Box>
  );
}
