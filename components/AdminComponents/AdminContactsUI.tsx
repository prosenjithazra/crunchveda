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
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Stack,
  Drawer,
  CircularProgress,
  Tooltip,
  Select,
} from "@mui/material";
import {
  Search,
  Refresh,
  Visibility,
  Close,
  ContactMail,
  Email,
  CalendarToday,
  Subject,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { adminAuthService } from "@/services/admin/authService";

export type ContactQueryItem = {
  _id: string;
  name: string;
  email: string;
  type: string;
  msg: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: string;
};

export default function AdminContactsUI() {
  const [queries, setQueries] = useState<ContactQueryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState<ContactQueryItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getToken = () => {
    const session = adminAuthService.getSession();
    if (session?.token) return session.token;
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || localStorage.getItem("tocken") || "";
    }
    return "";
  };

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const token = getToken();

      const res = await fetch("/api/contact", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        const rawQueries =
          data.data?.queries ||
          data.queries ||
          data.data ||
          (Array.isArray(data) ? data : []);
        setQueries(Array.isArray(rawQueries) ? rawQueries : []);
      } else {
        toast.error("Failed to fetch contact queries");
      }
    } catch (error) {
      console.error("Error fetching contact queries:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = getToken();

      const res = await fetch(`/api/contact?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Query status updated to ${newStatus}`);
        fetchQueries();
        if (selectedQuery && selectedQuery._id === id) {
          setSelectedQuery((prev) => prev ? { ...prev, status: newStatus as any } : null);
        }
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating query status:", error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const filteredQueries = queries.filter((q) => {
    const matchesSearch =
      q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.msg.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || q.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "success";
      case "reviewed":
        return "warning";
      default:
        return "error";
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Page Header */}
      <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0B2013", fontFamily: "Georgia, serif" }}>
            Contact Queries
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            View and manage customer messages and inquiries
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Refresh />}
          onClick={fetchQueries}
          disabled={loading}
          sx={{ borderRadius: "8px", textTransform: "none" }}
        >
          Refresh
        </Button>
      </Stack>

      {/* Filters Toolbar */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "12px", border: "1px solid #ebdcb9" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: "center" }}>
          <TextField
            placeholder="Search queries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
          <TextField
            select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            label="Filter by Status"
            sx={{
              minWidth: "200px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="reviewed">Reviewed</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {/* Queries Table */}
      <TableContainer component={Paper} sx={{ borderRadius: "12px", border: "1px solid #ebdcb9" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : filteredQueries.length > 0 ? (
          <Table>
            <TableHead sx={{ bgcolor: "#fbf9f6" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Sender</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Inquiry Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Message Preview</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Submitted At</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQueries.map((query) => (
                <TableRow key={query._id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {query.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {query.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={query.type}
                      size="small"
                      sx={{
                        bgcolor: "rgba(143, 94, 21, 0.08)",
                        color: "#8F5E15",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: "300px" }}>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ color: "text.secondary" }}
                    >
                      {query.msg}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(query.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={query.status.toUpperCase()}
                      color={getStatusColor(query.status)}
                      size="small"
                      sx={{ fontWeight: 700, borderRadius: "6px" }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                      <Tooltip title="View Message">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedQuery(query);
                            setDrawerOpen(true);
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <ContactMail sx={{ fontSize: 48, color: "text.secondary", opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No queries found
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: { width: { xs: "100%", sm: 500 }, p: 4, bgcolor: "#fbf9f6" },
          },
        }}
      >
        {selectedQuery && (
          <Box>
            {/* Header */}
            <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center", mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#0B2013", fontFamily: "Georgia, serif" }}>
                Inquiry Details
              </Typography>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <Close />
              </IconButton>
            </Stack>

            {/* Quick Status Bar */}
            <Paper sx={{ p: 2.5, mb: 4, borderRadius: "10px", bgcolor: "#ffffff", border: "1px solid #ebdcb9" }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, fontWeight: 700, textTransform: "uppercase" }}>
                Update Query Status
              </Typography>
              <Select
                value={selectedQuery.status}
                onChange={(e) => handleUpdateStatus(selectedQuery._id, e.target.value)}
                size="small"
                fullWidth
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="reviewed">Reviewed</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </Paper>

            {/* Information Grid */}
            <Stack spacing={3}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, fontWeight: 700, textTransform: "uppercase" }}>
                  Sender Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedQuery.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, fontWeight: 700, textTransform: "uppercase" }}>
                  Email Address
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body1" sx={{ color: "primary.main", fontWeight: 500 }}>
                    {selectedQuery.email}
                  </Typography>
                </Stack>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, fontWeight: 700, textTransform: "uppercase" }}>
                  Nature of Enquiry
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Subject fontSize="small" color="action" />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedQuery.type}
                  </Typography>
                </Stack>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, fontWeight: 700, textTransform: "uppercase" }}>
                  Submitted At
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body1">
                    {new Date(selectedQuery.createdAt).toLocaleString(undefined, {
                      dateStyle: "long",
                      timeStyle: "medium",
                    })}
                  </Typography>
                </Stack>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, fontWeight: 700, textTransform: "uppercase" }}>
                  Message Content
                </Typography>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: "10px",
                    bgcolor: "#ffffff",
                    border: "1px solid #ebdcb9",
                    whiteSpace: "pre-wrap",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "text.secondary",
                  }}
                >
                  {selectedQuery.msg}
                </Paper>
              </Box>
            </Stack>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
