"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  InputAdornment,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Storefront,
  Phone,
  Email,
  LocationOn,
  AccessTime,
  WhatsApp,
  Facebook,
  Instagram,
  Twitter,
  Save,
  Refresh,
  CheckCircleOutlined,
  SignalWifiStatusbarConnectedNoInternet4,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { adminAuthService } from "@/services/admin/authService";
import type { StoreConfig } from "@/store/useStoreConfigStore";

const FIELD_GROUPS = [
  {
    title: "BRAND IDENTITY",
    subtitle: "Core store name and identity settings.",
    fields: [
      { key: "brandName", label: "Brand Name", icon: <Storefront />, type: "text" },
    ],
  },
  {
    title: "CONTACT DETAILS",
    subtitle: "These values populate in the footer, contact page cards, and header banners dynamically.",
    fields: [
      { key: "supportEmail", label: "Support Email Address", icon: <Email />, type: "email" },
      { key: "phoneNumber", label: "Phone Number", icon: <Phone />, type: "tel" },
      { key: "address", label: "Studio Address", icon: <LocationOn />, type: "text" },
      { key: "operatingHours", label: "Operating Hours", icon: <AccessTime />, type: "text" },
    ],
  },
  {
    title: "SOCIAL MEDIA PROFILES",
    subtitle: "Enter URLs for custom brand redirection links.",
    fields: [
      { key: "twitterLink", label: "Twitter / X Link", icon: <Twitter />, type: "url" },
      { key: "instagramLink", label: "Instagram Link", icon: <Instagram />, type: "url" },
      { key: "facebookLink", label: "Facebook Link", icon: <Facebook />, type: "url" },
      { key: "whatsappNo", label: "WhatsApp Number", icon: <WhatsApp />, type: "tel" },
    ],
  },
];

const EMPTY_CONFIG: StoreConfig = {
  brandName: "",
  phoneNumber: "",
  supportEmail: "",
  address: "",
  operatingHours: "",
  whatsappNo: "",
  facebookLink: "",
  instagramLink: "",
  twitterLink: "",
};

export default function AdminStoreConfigUI() {
  const [formData, setFormData] = useState<StoreConfig>(EMPTY_CONFIG);
  const [savedData, setSavedData] = useState<StoreConfig>(EMPTY_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const getToken = () => {
    const session = adminAuthService.getSession();
    return session?.token || localStorage.getItem("token") || localStorage.getItem("tocken") || "";
  };

  const fetchConfig = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const res = await fetch("/api/store-config", { cache: "no-store" });
      const ms = Math.round(performance.now() - start);
      setApiLatency(ms);
      if (res.ok) {
        const data = await res.json();
        const raw: StoreConfig = data.data?.storeConfig || data.storeConfig || data.data || {};
        const merged = { ...EMPTY_CONFIG, ...raw };
        setFormData(merged);
        setSavedData(merged);
        setHasChanges(false);
      } else {
        toast.error("Failed to load store config");
      }
    } catch (err) {
      toast.error("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleChange = (key: keyof StoreConfig, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      setHasChanges(JSON.stringify(updated) !== JSON.stringify(savedData));
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const res = await fetch("/api/store-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const updated = data.data?.storeConfig || formData;
        setSavedData(updated);
        setFormData(updated);
        setHasChanges(false);
        toast.success("Store configuration updated successfully!");
      } else {
        toast.error(data.message || "Failed to save");
      }
    } catch (err) {
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setFormData(savedData);
    setHasChanges(false);
  };

  if (loading) {
    return (
      <Stack sx={{ alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading store configuration…
        </Typography>
      </Stack>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, mb: 4, gap: 2 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0B2013", fontFamily: "Georgia, serif" }}>
            Store Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage brand identity, contact details, and social media for the entire website.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          {apiLatency !== null && (
            <Chip
              icon={<SignalWifiStatusbarConnectedNoInternet4 sx={{ fontSize: "0.85rem !important" }} />}
              label={`API LATENCY: ${apiLatency}MS`}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.65rem", letterSpacing: "0.08em", fontWeight: 700, borderRadius: 1, color: apiLatency > 500 ? "error.main" : "success.main", borderColor: "currentcolor" }}
            />
          )}
          <Button
            size="small"
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchConfig}
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Refresh
          </Button>
          {hasChanges && (
            <Button
              size="small"
              variant="text"
              onClick={handleDiscard}
              sx={{ borderRadius: 2, textTransform: "none", color: "text.secondary" }}
            >
              Discard
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <Save />}
            onClick={handleSave}
            disabled={saving || !hasChanges}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </Stack>
      </Stack>

      {hasChanges && (
        <Alert
          severity="warning"
          icon={<CheckCircleOutlined />}
          sx={{ mb: 3, borderRadius: 2, fontSize: "0.85rem" }}
        >
          You have unsaved changes. Click <strong>Save Changes</strong> to apply them to the live website.
        </Alert>
      )}

      {/* Field Groups */}
      <Stack spacing={4}>
        {FIELD_GROUPS.map((group) => (
          <Paper
            key={group.title}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box sx={{ px: 3, pt: 3, pb: 2 }}>
              <Typography
                variant="overline"
                sx={{ fontWeight: 800, letterSpacing: "0.12em", color: "#0B2013", fontSize: "0.7rem" }}
              >
                {group.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                {group.subtitle}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                  gap: 2.5,
                }}
              >
                {group.fields.map((f) => (
                  <Box key={f.key}>
                    <Typography
                      variant="caption"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.75, fontWeight: 600, color: "#333", "& svg": { fontSize: "0.9rem" } }}
                    >
                      {f.icon} {f.label}
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type={f.type}
                      value={(formData as any)[f.key] || ""}
                      onChange={(e) => handleChange(f.key as keyof StoreConfig, e.target.value)}
                      placeholder={`Enter ${f.label.toLowerCase()}`}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          fontSize: "0.85rem",
                          bgcolor: "#fafafa",
                          "&:hover fieldset": { borderColor: "#8F5E15" },
                          "&.Mui-focused fieldset": { borderColor: "#8F5E15" },
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        ))}
      </Stack>

      {/* Bottom save bar */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          mt: 4,
          py: 2.5,
          px: 3,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          borderRadius: "0 0 12px 12px",
          zIndex: 10,
        }}
      >
        {hasChanges && (
          <Button
            variant="outlined"
            onClick={handleDiscard}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Discard Changes
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <Save />}
          onClick={handleSave}
          disabled={saving || !hasChanges}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, px: 4 }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}
