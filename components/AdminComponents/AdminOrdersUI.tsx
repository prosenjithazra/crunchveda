"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Stack,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip,
  Divider,
  Avatar,
  Drawer,
} from "@mui/material";
import {
  Search,
  Refresh,
  Visibility,
  ShoppingBag,
  AttachMoney,
  LocalShipping,
  CheckCircle,
  Cancel,
  Edit,
  Save,
  Close,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { outFit } from "@/mui-theme/_muiTheme";

export type AdminOrder = {
  _id: string;
  user?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  orderItems: {
    product?: { name?: string; images?: string[] };
    name?: string;
    quantity: number;
    price: number;
    size?: string;
    image?: string;
  }[];
  shippingAddress?: {
    fullName?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    phone?: string;
  };
  paymentMethod?: string;
  paymentResult?: { id?: string; status?: string };
  itemsPrice?: number;
  taxPrice?: number;
  shippingPrice?: number;
  totalPrice?: number;
  orderStatus?: string;
  isPaid?: boolean;
  isDelivered?: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt?: string;
  trackingNumber?: string;
  notes?: string;
};

const STATUS_OPTIONS = [
  "all",
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_COLOR: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
  pending: "warning",
  confirmed: "info",
  processing: "primary",
  shipped: "secondary",
  delivered: "success",
  cancelled: "error",
};

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || localStorage.getItem("tocken");
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminOrdersUI() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Edit status inside dialog
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newTracking, setNewTracking] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const list: AdminOrder[] = data.data?.orders || data.orders || [];
        setOrders(list);
      } else {
        toast.error("Failed to fetch orders. Check admin permissions.");
      }
    } catch {
      toast.error("Network error while fetching orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenDetails = (ord: AdminOrder) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus || "pending");
    setNewTracking(ord.trackingNumber || "");
    setEditingStatus(false);
    setDetailsOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    setSavingStatus(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/orders/${selectedOrder._id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderStatus: newStatus,
          trackingNumber: newTracking,
          isDelivered: newStatus === "delivered",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updated: AdminOrder = data.data?.order || data.order || selectedOrder;
        setOrders((prev) =>
          prev.map((o) => (o._id === updated._id ? updated : o))
        );
        setSelectedOrder(updated);
        toast.success("Order status updated successfully!");
        setEditingStatus(false);
      } else {
        toast.error("Failed to update order status.");
      }
    } catch {
      toast.error("Network error while updating status.");
    } finally {
      setSavingStatus(false);
    }
  };

  // Derived stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const deliveredCount = orders.filter((o) => o.orderStatus === "delivered").length;
  const pendingCount = orders.filter((o) => o.orderStatus === "pending" || o.orderStatus === "processing" || o.orderStatus === "confirmed").length;

  // Filtered orders
  const filtered = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      o._id?.toLowerCase().includes(q) ||
      o.user?.name?.toLowerCase().includes(q) ||
      o.user?.email?.toLowerCase().includes(q) ||
      o.user?.phone?.includes(q) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(q);

    const matchStatus =
      statusFilter === "all" || o.orderStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 4,
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "primary.main", fontFamily: outFit.style.fontFamily }}
          >
            Orders Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View, filter, and update all customer order statuses in real-time.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<Refresh />}
          onClick={fetchOrders}
          sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700 }}
        >
          Refresh Orders
        </Button>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              borderRadius: 3.5,
              boxShadow: "0px 10px 30px rgba(6, 27, 14, 0.03)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    bgcolor: "rgba(32, 53, 39, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "primary.main",
                  }}
                >
                  <ShoppingBag />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                    {orders.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    TOTAL ORDERS
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              borderRadius: 3.5,
              boxShadow: "0px 10px 30px rgba(6, 27, 14, 0.03)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    bgcolor: "rgba(46, 125, 50, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "success.main",
                  }}
                >
                  <AttachMoney />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1 }}>
                    ₹{totalRevenue.toFixed(0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    TOTAL REVENUE
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              borderRadius: 3.5,
              boxShadow: "0px 10px 30px rgba(6, 27, 14, 0.03)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    bgcolor: "rgba(237, 108, 2, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "warning.main",
                  }}
                >
                  <LocalShipping />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                    {pendingCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    ACTIVE / PENDING
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3.5,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by order ID, customer name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Order Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Stack direction="row" spacing={1}>
              <Chip
                label={`Delivered: ${deliveredCount}`}
                color="success"
                size="small"
                icon={<CheckCircle />}
                sx={{ fontWeight: 700 }}
              />
              <Chip
                label={`Cancelled: ${orders.filter((o) => o.orderStatus === "cancelled").length}`}
                color="error"
                size="small"
                icon={<Cancel />}
                sx={{ fontWeight: 700 }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3.5,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <CircularProgress color="primary" />
            <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
              Fetching all orders from the database...
            </Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <ShoppingBag sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
            <Typography variant="h6" color="text.secondary">
              No orders found matching your filters.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#FAF9F5" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Payment</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Placed On</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((ord) => (
                  <TableRow key={ord._id} hover>
                    {/* Order ID */}
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: "monospace", fontWeight: 700, color: "primary.main" }}>
                        #{ord._id.slice(-8).toUpperCase()}
                      </Typography>
                    </TableCell>

                    {/* Customer */}
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "13px", fontWeight: 700 }}>
                          {(ord.user?.name || ord.shippingAddress?.fullName || "?")[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {ord.user?.name || ord.shippingAddress?.fullName || "Guest"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ord.user?.email || ord.user?.phone || ""}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Items */}
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {ord.orderItems?.length ?? 0} item{(ord.orderItems?.length ?? 0) !== 1 ? "s" : ""}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ord.orderItems?.[0]?.name || ord.orderItems?.[0]?.product?.name || ""}
                        {(ord.orderItems?.length ?? 0) > 1 ? ` +${(ord.orderItems?.length ?? 0) - 1} more` : ""}
                      </Typography>
                    </TableCell>

                    {/* Total */}
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main" }}>
                        ₹{Number(ord.totalPrice || 0).toFixed(2)}
                      </Typography>
                    </TableCell>

                    {/* Payment */}
                    <TableCell>
                      <Chip
                        label={ord.isPaid ? "Paid" : "Unpaid"}
                        color={ord.isPaid ? "success" : "warning"}
                        size="small"
                        sx={{ fontWeight: 700, borderRadius: 1.5 }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.3 }}>
                        {ord.paymentMethod || "Razorpay"}
                      </Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={(ord.orderStatus || "pending").charAt(0).toUpperCase() + (ord.orderStatus || "pending").slice(1)}
                        color={STATUS_COLOR[ord.orderStatus || "pending"] || "default"}
                        size="small"
                        sx={{ fontWeight: 700, borderRadius: 1.5 }}
                      />
                    </TableCell>

                    {/* Placed On */}
                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                        {ord.createdAt
                          ? new Date(ord.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </Typography>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      <Tooltip title="View Order Details">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDetails(ord)}
                          sx={{ color: "primary.main" }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Order Detail Drawer */}
      <Drawer
        anchor="right"
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        slotProps={{
          paper: {
            sx: { width: { xs: "100%", sm: 480 }, p: 0, bgcolor: "background.paper" }
          }
        }}
      >
        {selectedOrder && (
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Drawer Header */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: outFit.style.fontFamily }}>
                  Order Details
                </Typography>
                <Typography variant="caption" sx={{ display: "block", fontFamily: "monospace", color: "primary.main", fontWeight: 700 }}>
                  #{selectedOrder._id.slice(-12).toUpperCase()}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Chip
                  label={(selectedOrder.orderStatus || "pending").charAt(0).toUpperCase() + (selectedOrder.orderStatus || "pending").slice(1)}
                  color={STATUS_COLOR[selectedOrder.orderStatus || "pending"] || "default"}
                  sx={{ fontWeight: 700 }}
                />
                <IconButton onClick={() => setDetailsOpen(false)} size="small">
                  <Close />
                </IconButton>
              </Stack>
            </Box>

            {/* Drawer Content */}
            <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>
              <Stack spacing={3}>
                {/* Customer Info */}
                <Box sx={{ bgcolor: "#FAF9F5", p: 2, borderRadius: 2.5, border: "1px solid rgba(32,53,39,0.08)" }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: "block", mb: 1 }}>
                    CUSTOMER INFORMATION
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {selectedOrder.user?.name || selectedOrder.shippingAddress?.fullName || "Guest"}
                    </Typography>
                    {selectedOrder.user?.email && (
                      <Typography variant="body2" color="text.secondary">{selectedOrder.user.email}</Typography>
                    )}
                    {selectedOrder.user?.phone && (
                      <Typography variant="body2" color="text.secondary">{selectedOrder.user.phone}</Typography>
                    )}
                  </Stack>
                </Box>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <Box sx={{ bgcolor: "#FAF9F5", p: 2, borderRadius: 2.5, border: "1px solid rgba(32,53,39,0.08)" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: "block", mb: 1 }}>
                      SHIPPING ADDRESS
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedOrder.shippingAddress.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {[
                        selectedOrder.shippingAddress.address,
                        selectedOrder.shippingAddress.city,
                        selectedOrder.shippingAddress.state,
                        selectedOrder.shippingAddress.postalCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                    {selectedOrder.shippingAddress.phone && (
                      <Typography variant="body2" color="text.secondary">
                        📞 {selectedOrder.shippingAddress.phone}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Order Items */}
                <Box sx={{ border: "1px solid", borderColor: "divider", p: 2, borderRadius: 2.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: "block", mb: 1.5 }}>
                    ORDER ITEMS
                  </Typography>
                  <Stack spacing={1.5}>
                    {selectedOrder.orderItems.map((item, idx) => (
                      <Stack key={idx} direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.quantity}x {item.name || item.product?.name || "Organic Item"}
                          {item.size ? ` (${item.size})` : ""}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">Shipping</Typography>
                    <Typography variant="body2">₹{Number(selectedOrder.shippingPrice || 0).toFixed(2)}</Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Total</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main" }}>
                      ₹{Number(selectedOrder.totalPrice || 0).toFixed(2)}
                    </Typography>
                  </Stack>
                </Box>

                {/* Payment Status */}
                <Box sx={{ bgcolor: "#FAF9F5", p: 2, borderRadius: 2.5, border: "1px solid rgba(32,53,39,0.08)" }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: "block", mb: 1 }}>
                    PAYMENT
                  </Typography>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedOrder.paymentMethod || "Razorpay"}
                    </Typography>
                    <Chip
                      label={selectedOrder.isPaid ? "Paid ✓" : "Not Paid"}
                      color={selectedOrder.isPaid ? "success" : "warning"}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Stack>
                  {selectedOrder.paymentResult?.id && (
                    <Typography variant="caption" sx={{ fontFamily: "monospace", color: "text.secondary", display: "block", mt: 0.5 }}>
                      Txn: {selectedOrder.paymentResult.id}
                    </Typography>
                  )}
                </Box>

                {/* Update Status */}
                <Box sx={{ border: "1px solid", borderColor: "divider", p: 2, borderRadius: 2.5 }}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                      UPDATE ORDER STATUS
                    </Typography>
                    {!editingStatus ? (
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => setEditingStatus(true)}
                        sx={{ textTransform: "none", fontWeight: 700, borderRadius: "14px" }}
                      >
                        Edit Status
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={savingStatus ? <CircularProgress size={14} color="inherit" /> : <Save />}
                        onClick={handleSaveStatus}
                        disabled={savingStatus}
                        sx={{ textTransform: "none", fontWeight: 700, borderRadius: "14px" }}
                      >
                        Save
                      </Button>
                    )}
                  </Stack>

                  {editingStatus ? (
                    <Stack spacing={2}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="New Status"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      >
                        {STATUS_OPTIONS.filter((s) => s !== "all").map((s) => (
                          <MenuItem key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        fullWidth
                        size="small"
                        label="Tracking Number (optional)"
                        value={newTracking}
                        onChange={(e) => setNewTracking(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", gap: 1 }}>
                      {STATUS_OPTIONS.filter((s) => s !== "all").map((s) => (
                        <Chip
                          key={s}
                          label={s.charAt(0).toUpperCase() + s.slice(1)}
                          color={selectedOrder.orderStatus === s ? STATUS_COLOR[s] || "default" : "default"}
                          size="small"
                          variant={selectedOrder.orderStatus === s ? "filled" : "outlined"}
                          sx={{ fontWeight: 700, borderRadius: 1.5 }}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>
              </Stack>
            </Box>

            {/* Drawer Footer */}
            <Box sx={{ p: 2.5, borderTop: "1px solid", borderColor: "divider", bgcolor: "#FAF9F5" }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setDetailsOpen(false)}
                sx={{ borderRadius: "14px", py: 1.2, textTransform: "none", fontWeight: 700 }}
              >
                Close Panel
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
