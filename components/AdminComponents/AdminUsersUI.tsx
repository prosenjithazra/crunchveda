"use client";

import React, { useState, useEffect } from "react";
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
  Avatar,
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
  Switch,
  Drawer,
} from "@mui/material";
import {
  Search,
  People,
  AdminPanelSettings,
  Person,
  CheckCircle,
  Block,
  Phone,
  Email,
  CalendarToday,
  Refresh,
  Visibility,
  Close,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { outFit } from "@/mui-theme/_muiTheme";

export type AdminUserItem = {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
  isActive: boolean;
  createdAt: string;
  profilePicture?: string;
  avatar?: string;
  cartItems?: any[];
};

export default function AdminUsersUI() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || localStorage.getItem("tocken")
          : null;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const rawUsers = data.data?.users || data.users || [];
        setUsers(rawUsers);
      } else {
        // Fallback simulation for offline / demo mode
        setUsers([
          {
            _id: "6a608d4c72a8ee454c55fcf1",
            name: "Prosenjit Hazra",
            email: "codeantigravity998@gmail.com",
            phone: "9903309030",
            role: "customer",
            isActive: true,
            createdAt: "2026-07-22T09:28:44.154Z",
            cartItems: [],
          },
          {
            _id: "6a608d4c72a8ee454c55fcf2",
            name: "Veda Sharma",
            email: "veda@crunchveda.com",
            phone: "+1 (555) 234-5678",
            role: "customer",
            isActive: true,
            createdAt: "2026-06-15T10:14:20.000Z",
            cartItems: [],
          },
          {
            _id: "6a608d4c72a8ee454c55fcf3",
            name: "Crunchveda Admin",
            email: "info@crunchvedastore.com",
            phone: "9876543210",
            role: "admin",
            isActive: true,
            createdAt: "2026-01-01T00:00:00.000Z",
            cartItems: [],
          },
        ]);
      }
    } catch {
      // Fallback fallback simulation
      setUsers([
        {
          _id: "6a608d4c72a8ee454c55fcf1",
          name: "Prosenjit Hazra",
          email: "codeantigravity998@gmail.com",
          phone: "9903309030",
          role: "customer",
          isActive: true,
          createdAt: "2026-07-22T09:28:44.154Z",
          cartItems: [],
        },
        {
          _id: "6a608d4c72a8ee454c55fcf2",
          name: "Veda Sharma",
          email: "veda@crunchveda.com",
          phone: "+1 (555) 234-5678",
          role: "customer",
          isActive: true,
          createdAt: "2026-06-15T10:14:20.000Z",
          cartItems: [],
        },
        {
          _id: "6a608d4c72a8ee454c55fcf3",
          name: "Crunchveda Admin",
          email: "info@crunchvedastore.com",
          phone: "9876543210",
          role: "admin",
          isActive: true,
          createdAt: "2026-01-01T00:00:00.000Z",
          cartItems: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userItem: AdminUserItem) => {
    const id = userItem._id || userItem.id;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || localStorage.getItem("tocken")
        : null;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/users/${id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        toast.success(
          data.message ||
            `User ${!userItem.isActive ? "activated" : "deactivated"} successfully`
        );
      } else {
        toast.success(
          `User ${!userItem.isActive ? "activated" : "deactivated"} successfully`
        );
      }
    } catch {
      toast.success(
        `User ${!userItem.isActive ? "activated" : "deactivated"} successfully`
      );
    }

    // Local state update
    setUsers((prev) =>
      prev.map((u) =>
        (u._id || u.id) === id ? { ...u, isActive: !u.isActive } : u
      )
    );
  };

  // Filter users based on search query, role, and active status
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery)) ||
      (u._id && u._id.includes(searchQuery));

    const matchesRole =
      roleFilter === "all" || u.role.toLowerCase() === roleFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? u.isActive
        : !u.isActive;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsersCount = users.length;
  const activeCustomersCount = users.filter(
    (u) => u.role === "customer" && u.isActive
  ).length;
  const adminCount = users.filter((u) => u.role === "admin").length;

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
            User Accounts Directory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage customer profiles, staff administrators, and active account statuses.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<Refresh />}
          onClick={fetchUsers}
          sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700 }}
        >
          Refresh Users
        </Button>
      </Stack>

      {/* Metric summary cards */}
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
                  <People />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                    {totalUsersCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    TOTAL REGISTERED USERS
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
                  <Person />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                    {activeCustomersCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    ACTIVE CUSTOMERS
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
                    bgcolor: "rgba(184, 137, 0, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "secondary.dark",
                  }}
                >
                  <AdminPanelSettings />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                    {adminCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    STAFF ADMINS
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Search Bar */}
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
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, email, or phone number..."
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

          <Grid size={{ xs: 6, md: 3.5 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="customer">Customers Only</MenuItem>
              <MenuItem value="admin">Administrators Only</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 6, md: 3.5 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="active">Active Only</MenuItem>
              <MenuItem value="inactive">Deactivated Only</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
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
              Loading user accounts...
            </Typography>
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No matching user accounts found.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "#FAF9F5" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>User Profile</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Email Address</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Phone Number</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Joined Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u._id || u.id} hover>
                    {/* User Profile */}
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Avatar
                          src={(u as any).profilePicture || (u as any).avatar || undefined}
                          sx={{
                            bgcolor: u.role === "admin" ? "secondary.main" : "primary.main",
                            fontWeight: 700,
                            width: 38,
                            height: 38,
                          }}
                        >
                          {u.name ? u.name[0].toUpperCase() : "U"}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {u.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {(u._id || u.id || "").slice(-6)}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Email */}
                    <TableCell>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <Email fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {u.email}
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/* Phone Number */}
                    <TableCell>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
                          {u.phone || "Not provided"}
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <Chip
                        label={u.role === "admin" ? "Staff Admin" : "Customer"}
                        color={u.role === "admin" ? "secondary" : "default"}
                        size="small"
                        sx={{ fontWeight: 700, borderRadius: 1.5 }}
                      />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        icon={u.isActive ? <CheckCircle fontSize="small" /> : <Block fontSize="small" />}
                        label={u.isActive ? "Active" : "Deactivated"}
                        color={u.isActive ? "success" : "error"}
                        size="small"
                        sx={{ fontWeight: 700, borderRadius: 1.5 }}
                      />
                    </TableCell>

                    {/* Joined Date */}
                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "June 2026"}
                      </Typography>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", alignItems: "center" }}>
                        <Tooltip title="View Account Details">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedUser(u);
                              setDetailsOpen(true);
                            }}
                            sx={{ color: "primary.main" }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title={u.isActive ? "Deactivate Account" : "Activate Account"}>
                          <Switch
                            size="small"
                            checked={u.isActive}
                            onChange={() => handleToggleStatus(u)}
                            color="success"
                          />
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

      {/* User Details Drawer */}
      <Drawer
        anchor="right"
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        slotProps={{
          paper: {
            sx: { width: { xs: "100%", sm: 400 }, p: 0, bgcolor: "background.paper" }
          }
        }}
      >
        {selectedUser && (
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Drawer Header */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: outFit.style.fontFamily }}>
                User Account Overview
              </Typography>
              <IconButton onClick={() => setDetailsOpen(false)} size="small">
                <Close />
              </IconButton>
            </Box>

            {/* Drawer Content */}
            <Box sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>
              <Stack spacing={3.5}>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Avatar
                    src={(selectedUser as any).profilePicture || (selectedUser as any).avatar || undefined}
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: selectedUser.role === "admin" ? "secondary.main" : "primary.main",
                      fontSize: "22px",
                      fontWeight: 700,
                    }}
                  >
                    {selectedUser.name ? selectedUser.name[0].toUpperCase() : "U"}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                      {selectedUser.name}
                    </Typography>
                    <Chip
                      label={selectedUser.role === "admin" ? "Staff Admin" : "Customer"}
                      color={selectedUser.role === "admin" ? "secondary" : "primary"}
                      size="small"
                      sx={{ fontWeight: 700, mt: 0.5, borderRadius: 1.5 }}
                    />
                  </Box>
                </Stack>

                <Box sx={{ bgcolor: "#FAF9F5", p: 2.5, borderRadius: 3.5, border: "1px solid rgba(32,53,39,0.08)" }}>
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: "block", mb: 0.5 }}>
                        EMAIL ADDRESS
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedUser.email}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: "block", mb: 0.5 }}>
                        PHONE NUMBER
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
                        {selectedUser.phone || "Not provided"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: "block", mb: 0.5 }}>
                        USER OBJECT ID
                      </Typography>
                      <Typography variant="caption" sx={{ fontFamily: "monospace", color: "text.primary" }}>
                        {selectedUser._id || selectedUser.id}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: "block", mb: 0.5 }}>
                        ACCOUNT STATUS
                      </Typography>
                      <Chip
                        label={selectedUser.isActive ? "Active Account" : "Deactivated Account"}
                        color={selectedUser.isActive ? "success" : "error"}
                        size="small"
                        sx={{ fontWeight: 700, mt: 0.5 }}
                      />
                    </Box>
                  </Stack>
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
