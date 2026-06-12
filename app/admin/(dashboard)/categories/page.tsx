"use client";

import type { ICategory } from "@/types/category";
import { categoryService } from "@/services/admin/categoryService";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import AdminBreadcrumb from "@/components/AdminComponents/AdminBreadcrumb";
import AdminPageHeader from "@/components/AdminComponents/AdminPageHeader";
import ConfirmDialog from "@/components/AdminComponents/ConfirmDialog";

export default function CategoryListPage() {
  const router = useRouter();
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<ICategory | null>(null);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    categoryService.getAll().then(data => {
      if (active) {
        setCategories(data);
        setLoading(false);
      }
    }).catch(err => {
      if (active) {
        toast.error(err instanceof Error ? err.message : "Failed to load categories");
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const handleToggleStatus = async (cat: ICategory) => {
    setTogglingId(cat._id);
    try {
      const updated = await categoryService.update(cat._id, { isActive: !cat.isActive });
      setCategories(prev => prev.map(c => (c._id === cat._id ? { ...c, ...updated } : c)));
      toast.success(`"${cat.name}" is now ${!cat.isActive ? "Active" : "Inactive"}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await categoryService.remove(deleteTarget._id);
      setCategories(prev => prev.filter(c => c._id !== deleteTarget._id));
      toast.success(`"${deleteTarget.name}" deleted successfully.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete category");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <Box>
      <AdminBreadcrumb items={[{ label: "Categories" }, { label: "Category List" }]} />
      <AdminPageHeader
        title="Category List"
        description="Manage all product categories. Add, edit, or remove categories."
      >
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => router.push("/admin/categories/add")}
          sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
        >
          Add Category
        </Button>
      </AdminPageHeader>

      <Paper
        elevation={0}
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
          <Stack sx={{ alignItems: "center", justifyContent: "center", py: 8 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading categories…
            </Typography>
          </Stack>
        ) : categories.length === 0 ? (
          <Stack sx={{ alignItems: "center", justifyContent: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">No categories found.</Typography>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => router.push("/admin/categories/add")}
              sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}
            >
              Add your first category
            </Button>
          </Stack>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "customColors.lightCream" }}>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Slug</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">Products</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map(cat => (
                  <TableRow
                    key={cat._id}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    <TableCell>
                      {cat.image ? (
                        <Box
                          component="img"
                          src={cat.image}
                          alt={cat.name}
                          sx={{
                            width: 48,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: 1.5,
                            border: 1,
                            borderColor: "divider",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
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
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {cat.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={cat.slug}
                        size="small"
                        variant="outlined"
                        sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {cat.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={cat.productCount ?? 0}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={cat.isActive ? "Click to deactivate" : "Click to activate"}>
                        <Switch
                          size="small"
                          checked={cat.isActive}
                          disabled={togglingId === cat._id}
                          onChange={() => handleToggleStatus(cat)}
                          color="success"
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: "center" }}>
                        <Tooltip title="Edit category">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => router.push(`/admin/categories/edit/${cat._id}`)}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete category">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteTarget(cat)}
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone. Categories with linked products cannot be deleted.`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
