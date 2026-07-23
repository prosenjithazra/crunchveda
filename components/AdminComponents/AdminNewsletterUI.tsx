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
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Stack,
  CircularProgress,
  Select,
} from "@mui/material";
import {
  Search,
  Refresh,
  Mail,
  CalendarToday,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { adminAuthService } from "@/services/admin/authService";

export type SubscriberItem = {
  _id: string;
  email: string;
  status: "active" | "unsubscribed";
  createdAt: string;
};

export default function AdminNewsletterUI() {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getToken = () => {
    const session = adminAuthService.getSession();
    if (session?.token) return session.token;
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || localStorage.getItem("tocken") || "";
    }
    return "";
  };

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const token = getToken();

      const res = await fetch("/api/newsletter", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        const rawSubscribers =
          data.data?.subscribers ||
          data.subscribers ||
          data.data ||
          (Array.isArray(data) ? data : []);
        setSubscribers(Array.isArray(rawSubscribers) ? rawSubscribers : []);
      } else {
        toast.error("Failed to fetch subscribers");
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = getToken();

      const res = await fetch(`/api/newsletter?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Subscriber status updated to ${newStatus}`);
        fetchSubscribers();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating subscriber status:", error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filteredSubscribers = subscribers.filter((s) => {
    const matchesSearch = s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: 4 }}>
      {/* Page Header */}
      <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0B2013", fontFamily: "Georgia, serif" }}>
            Newsletter Subscribers
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            View and manage newsletter subscribers list
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Refresh />}
          onClick={fetchSubscribers}
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
            placeholder="Search email address..."
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
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="unsubscribed">Unsubscribed</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {/* Subscribers Table */}
      <TableContainer component={Paper} sx={{ borderRadius: "12px", border: "1px solid #ebdcb9" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : filteredSubscribers.length > 0 ? (
          <Table>
            <TableHead sx={{ bgcolor: "#fbf9f6" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Subscribed At</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubscribers.map((sub) => (
                <TableRow key={sub._id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Mail fontSize="small" color="action" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {sub.email}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2">
                        {new Date(sub.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={sub.status.toUpperCase()}
                      color={sub.status === "active" ? "success" : "default"}
                      size="small"
                      sx={{ fontWeight: 700, borderRadius: "6px" }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Select
                      value={sub.status}
                      onChange={(e) => handleUpdateStatus(sub._id, e.target.value)}
                      size="small"
                      sx={{
                        borderRadius: "8px",
                        fontSize: "13px",
                        minWidth: "130px",
                        textAlign: "left",
                      }}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="unsubscribed">Unsubscribed</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Mail sx={{ fontSize: 48, color: "text.secondary", opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No subscribers found
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
}
