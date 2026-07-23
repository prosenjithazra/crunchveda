"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  TextField,
  Stack,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Alert,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import {
  Person,
  ShoppingBag,
  Home,
  Logout,
  Edit,
  PhotoCamera,
  CheckCircle,
  LocalShipping,
  AssignmentTurnedIn,
  ArrowForward,
  Refresh,
  AddLocation,
  CloudUpload,
  DeleteOutlined,
  WarningAmber,
  Favorite,
  ShoppingCart,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useUser, useLogout, useUpdateProfile } from "@/hooks/useAuth";
import { productService } from "@/services/productService";
import { outFit } from "@/mui-theme/_muiTheme";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Preset avatars for Crunchveda
const avatarPresets = [
  { name: "Almond", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
  { name: "Cashew", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
  { name: "Walnut", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" },
  { name: "Date", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
  { name: "Seed", url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" },
];

export default function ProfileUI() {
  const router = useRouter();
  const { user, isLoading, refetch } = useUser();
  const logoutMutation = useLogout();
  const updateProfileMutation = useUpdateProfile();
  const [tabValue, setTabValue] = useState(0);

  // Profile forms
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [joinedDate, setJoinedDate] = useState("June 19, 2026");

  // Avatar states
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete address confirm dialog state
  const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Address management state
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
    isDefault: false,
  });

  const resetAddressForm = () =>
    setAddressForm({ fullName: "", address: "", city: "", state: "", postalCode: "", country: "India", phone: "", isDefault: false });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") || localStorage.getItem("tocken") : null;

  const validatePhone = (ph: string) => {
    const cleaned = ph.replace(/\s|-/g, "");
    if (!cleaned) return "Phone number is required";
    if (!/^[\+]?[0-9]{7,15}$/.test(cleaned)) return "Enter a valid phone number (7–15 digits)";
    return "";
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, address, city, state, postalCode, phone: ph } = addressForm;
    if (!fullName || !address || !city || !state || !postalCode || !ph) {
      toast.error("Please fill all required fields");
      return;
    }
    setAddressSaving(true);
    try {
      const res = await fetch(`${API_BASE}/auth/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(addressForm),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Address added successfully!");
        await refetch();
        setAddressDialogOpen(false);
        resetAddressForm();
      } else {
        toast.error(data.message || "Failed to add address");
      }
    } catch {
      toast.error("Network error while adding address");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/addresses/${addressId}/set-default`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Default address updated!");
        await refetch();
      } else {
        toast.error(data.message || "Failed to set default");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    setDeleteAddressId(addressId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteAddress = async () => {
    if (!deleteAddressId) return;
    setDeleteConfirmOpen(false);
    try {
      const res = await fetch(`${API_BASE}/auth/addresses/${deleteAddressId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Address removed successfully");
        await refetch();
      } else {
        toast.error(data.message || "Failed to delete address");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setDeleteAddressId(null);
    }
  };

  // Real-time Orders state
  const [realtimeOrders, setRealtimeOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || localStorage.getItem("tocken")
          : null;
      if (!token) return;

      let res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/orders/my-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/orders/myorders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      if (res.ok) {
        const data = await res.json();
        const list = data.data?.orders || data.data || data.orders || [];
        setRealtimeOrders(list);
      }
    } catch (e) {
      console.warn("Failed to fetch user orders:", e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  // Sync state with user loaded from react query/localStorage
  useEffect(() => {
    if (user) {
      const u = user as any;
      const extractedPhone = u.phone || u.phoneNumber || u.mobile || u.mobileNumber || u.phone_number || u.contact || "";
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(extractedPhone);
      setAvatarUrl(u.profilePicture || u.avatar || "");
      if (user.createdAt) {
        setJoinedDate(new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }));
      }
    }
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Name and Email are required");
      return;
    }
    const pErr = validatePhone(phone);
    if (pErr) {
      setPhoneError(pErr);
      toast.error(pErr);
      return;
    }
    setPhoneError("");
    try {
      await updateProfileMutation.mutateAsync({ name, email, phone, profilePicture: avatarUrl, avatar: avatarUrl });
      toast.success("Profile details updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update profile details");
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      const u = user as any;
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(u.phone || u.phoneNumber || u.mobile || "");
    }
    setIsEditing(false);
  };

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }
    setPreviewFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleCustomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = "";
  };

  const handleUploadSelectedFile = async () => {
    const file = previewFile;
    if (!file) return;

    setUploadingAvatar(true);
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 15, 85));
    }, 300);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("profilePicture", file);
      formData.append("avatar", file);

      const token = getToken();
      let uploadedUrl = "";

      // 1. First attempt dedicated user profile-picture endpoint
      try {
        const res = await fetch(`${API_BASE}/auth/profile-picture`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (res.ok && (data.success || data.data)) {
          uploadedUrl = data.data?.profilePicture || data.data?.avatar || data.data?.url || data.profilePicture || data.url || "";
        }
      } catch (err) {
        console.warn("Direct profile-picture upload failed, trying proxy endpoint:", err);
      }

      // 2. Fallback to /api/upload/image proxy endpoint if needed
      if (!uploadedUrl) {
        const uploadRes = await fetch("/api/upload/image", {
          method: "POST",
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          uploadedUrl = uploadData.data?.url || uploadData.data?.secure_url || uploadData.data?.profilePicture || uploadData.url || uploadData.secure_url || uploadData.imageUrl || uploadData.profilePicture || "";
        } else if (uploadData.message) {
          throw new Error(uploadData.message);
        }
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!uploadedUrl) {
        throw new Error("Failed to retrieve uploaded image URL from ImageKit server.");
      }

      setAvatarUrl(uploadedUrl);
      await updateProfileMutation.mutateAsync({
        name: name || user?.name || "",
        email: email || user?.email || "",
        phone: phone || (user as any)?.phone || "",
        profilePicture: uploadedUrl,
        avatar: uploadedUrl,
      });

      if (user && typeof window !== "undefined") {
        const nextUser = { ...user, profilePicture: uploadedUrl, avatar: uploadedUrl };
        localStorage.setItem("user", JSON.stringify(nextUser));
      }
      await refetch();
      toast.success("✅ Profile picture uploaded to ImageKit!");
      setAvatarDialogOpen(false);
      setPreviewFile(null);
      setPreviewUrl("");
    } catch (err: any) {
      clearInterval(progressInterval);
      toast.error(err.message || "Network error uploading profile image");
    } finally {
      setUploadingAvatar(false);
      setTimeout(() => setUploadProgress(0), 800);
    }
  };

  const selectAvatar = async (url: string) => {
    setAvatarUrl(url);
    try {
      await updateProfileMutation.mutateAsync({
        name: name || user?.name || "",
        email: email || user?.email || "",
        phone: phone || (user as any)?.phone || "",
        profilePicture: url,
        avatar: url,
      });
      if (user && typeof window !== "undefined") {
        const nextUser = { ...user, profilePicture: url, avatar: url };
        localStorage.setItem("user", JSON.stringify(nextUser));
      }
      await refetch();
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error("Failed to update profile picture");
    }
    setAvatarDialogOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        router.push("/login");
      },
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Typography variant="body1">Loading profile details...</Typography>
      </Box>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 5,
            border: "1px solid",
            borderColor: "divider",
            background: "#FCF9F2",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: "primary.main", fontFamily: outFit.style.fontFamily }}>
            Access Restrained
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: "text.secondary" }}>
            You must be logged in to view your profile dashboard page.
          </Typography>
          <Button
            component={Link}
            href="/login"
            variant="contained"
            color="primary"
            sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700, px: 4 }}
          >
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FDFDFD", pb: 8 }}>
      {/* Delete Address Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontFamily: outFit.style.fontFamily, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "rgba(211,47,47,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <WarningAmber sx={{ color: "error.main", fontSize: 22 }} />
          </Box>
          Remove Address?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This address will be permanently removed from your account. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            variant="outlined"
            sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700, flex: 1 }}
          >
            Keep Address
          </Button>
          <Button
            onClick={handleConfirmDeleteAddress}
            variant="contained"
            color="error"
            sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700, flex: 1 }}
          >
            Remove It
          </Button>
        </DialogActions>
      </Dialog>

      {/* 1. Header Banner */}
      <Box
        sx={{
          height: { xs: 160, sm: 240 },
          background: "linear-gradient(135deg, #0B2013 0%, #203527 50%, #4D6453 100%)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "url('/assets/about_banner.png') center/cover no-repeat",
            opacity: 0.12,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "60px",
            background: "linear-gradient(to bottom, transparent, #FDFDFD)",
          },
        }}
      />

      <Container maxWidth="lg" sx={{ mt: -6, position: "relative", zIndex: 2 }}>
        <Grid container spacing={4}>
          
          {/* Left Column: Account Details Overview */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0px 10px 30px rgba(6, 27, 14, 0.04)",
                border: "1px solid",
                borderColor: "divider",
                position: "sticky",
                top: 100,
              }}
            >
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
                  {/* Glowing ring */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: -4,
                      borderRadius: "50%",
                      background: avatarUrl
                        ? "linear-gradient(135deg, #4D6453, #B89D4F)"
                        : "linear-gradient(135deg, #203527, #4D6453)",
                      zIndex: 0,
                      animation: "spin 6s linear infinite",
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }}
                  />
                  <Avatar
                    src={avatarUrl || undefined}
                    sx={{
                      width: 104,
                      height: 104,
                      mx: "auto",
                      border: "4px solid",
                      borderColor: "background.paper",
                      boxShadow: "0px 12px 28px rgba(0,0,0,0.12)",
                      bgcolor: "primary.main",
                      fontSize: "36px",
                      fontWeight: 700,
                      position: "relative",
                      zIndex: 1,
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "scale(1.04)" },
                    }}
                  >
                    {name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
                  </Avatar>
                  <IconButton
                    size="small"
                    onClick={() => { setPreviewFile(null); setPreviewUrl(""); setAvatarDialogOpen(true); }}
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      bgcolor: "secondary.light",
                      color: "white",
                      zIndex: 2,
                      width: 32,
                      height: 32,
                      "&:hover": { bgcolor: "secondary.dark", transform: "scale(1.1)" },
                      transition: "all 0.2s ease",
                      boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, fontFamily: outFit.style.fontFamily }}>
                  {user.name || name}
                </Typography>
                
                <Chip
                  label={user.role === "admin" ? "Staff Admin" : "User"}
                  color={user.role === "admin" ? "secondary" : "primary"}
                  size="small"
                  sx={{ mb: 3, fontWeight: 700, borderRadius: 1.5 }}
                />

                <Divider sx={{ my: 2.5 }} />

                <Stack spacing={2} sx={{ textAlign: "left" }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                      EMAIL ADDRESS
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {user.email || email}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                      PHONE NUMBER
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {user.phone || (user as any).phoneNumber || (user as any).mobile || phone || "Not provided"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                      MEMBER SINCE
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {joinedDate}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2.5 }} />

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<Logout />}
                  onClick={handleLogout}
                  sx={{
                    borderRadius: "12px",
                    py: 1,
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  Logout Account
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Tab Panels */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 4 },
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0px 10px 30px rgba(6, 27, 14, 0.03)",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  "& .MuiTab-root": {
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "15px",
                    fontFamily: outFit.style.fontFamily,
                    pb: 1.5,
                  },
                }}
              >
                <Tab icon={<Person fontSize="small" />} iconPosition="start" label="Profile Details" />
                <Tab icon={<ShoppingBag fontSize="small" />} iconPosition="start" label="Order History" />
                <Tab icon={<Home fontSize="small" />} iconPosition="start" label="Addresses" />
                <Tab icon={<Favorite fontSize="small" />} iconPosition="start" label={`Saved Products (${(user as any)?.savedProducts?.length || 0})`} />
              </Tabs>

              {/* TAB 1: PROFILE DETAILS FORM */}
              <CustomTabPanel value={tabValue} index={0}>
                <form onSubmit={handleProfileUpdate}>
                  <Stack spacing={3}>
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                        Personal Information
                      </Typography>
                      {!isEditing && (
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<Edit />}
                          onClick={() => setIsEditing(true)}
                          sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700 }}
                        >
                          Edit Profile
                        </Button>
                      )}
                    </Stack>

                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          required
                          fullWidth
                          label="Full Name"
                          disabled={!isEditing}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          disabled
                          value={email}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          required
                          fullWidth
                          label="Phone Number"
                          disabled={!isEditing}
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (phoneError) setPhoneError(validatePhone(e.target.value));
                          }}
                          onBlur={() => isEditing && setPhoneError(validatePhone(phone))}
                          error={isEditing && !!phoneError}
                          helperText={isEditing && phoneError ? phoneError : isEditing ? "e.g. +91 9876543210" : undefined}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Account Role"
                          disabled
                          value={user.role === "admin" ? "Administrator" : "Customer"}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Joined Date"
                          disabled
                          value={joinedDate}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                      </Grid>
                    </Grid>

                    {isEditing && (
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                        <Button
                          variant="outlined"
                          color="inherit"
                          onClick={handleCancelEdit}
                          sx={{
                            borderRadius: "20px",
                            px: 3,
                            py: 1,
                            textTransform: "none",
                            fontWeight: 700,
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={updateProfileMutation.isPending}
                          sx={{
                            borderRadius: "20px",
                            px: 4,
                            py: 1,
                            textTransform: "none",
                            fontWeight: 700,
                          }}
                        >
                          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </Box>
                    )}
                  </Stack>
                </form>
              </CustomTabPanel>

              {/* TAB 2: ORDER HISTORY */}
              <CustomTabPanel value={tabValue} index={1}>
                <Stack spacing={3}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                      Your Harvest Orders
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Refresh />}
                      onClick={fetchUserOrders}
                      sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700 }}
                    >
                      Refresh
                    </Button>
                  </Stack>

                  {loadingOrders ? (
                    <Box sx={{ p: 6, textAlign: "center" }}>
                      <CircularProgress color="primary" />
                      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                        Loading your orders...
                      </Typography>
                    </Box>
                  ) : realtimeOrders.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 6, textAlign: "center", borderRadius: 3.5, bgcolor: "#FAF9F5" }}>
                      <ShoppingBag sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                        No orders placed yet
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                        Explore our premium organic harvest and place your first order.
                      </Typography>
                      <Button
                        component={Link}
                        href="/products"
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700, px: 4 }}
                      >
                        Explore Harvest Products
                      </Button>
                    </Paper>
                  ) : (
                    realtimeOrders.map((ord: any) => (
                      <Paper
                        key={ord._id || ord.id}
                        variant="outlined"
                        sx={{ p: 3, borderRadius: 3.5, borderColor: "rgba(32, 53, 39, 0.12)", bgcolor: "#FAF9F5" }}
                      >
                        {/* Order Header: ID, Date, Status, Total */}
                        <Grid container spacing={2} sx={{ alignItems: "center", mb: 2 }}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                              Order #{(ord._id || ord.id || "").slice(-8).toUpperCase()}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              Placed on {new Date(ord.createdAt || Date.now()).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: { xs: "left", sm: "right" } }}>
                            <Chip
                              label={
                                (ord.orderStatus
                                  ? ord.orderStatus.charAt(0).toUpperCase() + ord.orderStatus.slice(1)
                                  : ord.isPaid ? "Confirmed" : "Processing")
                              }
                              color={
                                ord.orderStatus === "delivered"
                                  ? "success"
                                  : ord.orderStatus === "cancelled"
                                  ? "error"
                                  : ord.orderStatus === "shipped"
                                  ? "secondary"
                                  : "primary"
                              }
                              size="small"
                              sx={{ fontWeight: 700, mr: 1 }}
                            />
                            <Typography variant="subtitle1" sx={{ display: "inline-block", fontWeight: 800, color: "primary.main" }}>
                              ₹{Number(ord.totalPrice || ord.total || 0).toFixed(2)}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Divider sx={{ mb: 2 }} />

                        {/* Order Items */}
                        <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block", mb: 1 }}>
                          ORDER ITEMS
                        </Typography>
                        <Stack spacing={1.2} sx={{ mb: 2 }}>
                          {ord.orderItems && ord.orderItems.length > 0 ? (
                            ord.orderItems.map((item: any, idx: number) => (
                              <Stack key={idx} direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                                <Box>
                                  <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>
                                    {item.quantity}x {item.name || item.product?.name || "Organic Item"}
                                  </Typography>
                                  {item.size && (
                                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                      Size: {item.size}
                                    </Typography>
                                  )}
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
                                  ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                                </Typography>
                              </Stack>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No item details available
                            </Typography>
                          )}
                        </Stack>

                        {/* Price Breakdown */}
                        {(ord.shippingPrice !== undefined || ord.taxPrice !== undefined) && (
                          <>
                            <Divider sx={{ mb: 1.5 }} />
                            <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                              {ord.itemsPrice !== undefined && (
                                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                                  <Typography variant="caption" color="text.secondary">Subtotal</Typography>
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>₹{Number(ord.itemsPrice).toFixed(2)}</Typography>
                                </Stack>
                              )}
                              {ord.shippingPrice !== undefined && (
                                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                                  <Typography variant="caption" color="text.secondary">Shipping</Typography>
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    {Number(ord.shippingPrice) === 0 ? "Free" : `₹${Number(ord.shippingPrice).toFixed(2)}`}
                                  </Typography>
                                </Stack>
                              )}
                              {ord.taxPrice !== undefined && Number(ord.taxPrice) > 0 && (
                                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                                  <Typography variant="caption" color="text.secondary">Tax</Typography>
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>₹{Number(ord.taxPrice).toFixed(2)}</Typography>
                                </Stack>
                              )}
                            </Stack>
                          </>
                        )}

                        {/* Shipping Address */}
                        {ord.shippingAddress && (
                          <>
                            <Divider sx={{ mb: 1.5 }} />
                            <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block", mb: 0.8 }}>
                              SHIPPING ADDRESS
                            </Typography>
                            <Box sx={{ bgcolor: "rgba(32,53,39,0.03)", p: 1.5, borderRadius: 2, border: "1px solid rgba(32,53,39,0.07)" }}>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {ord.shippingAddress.fullName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {[
                                  ord.shippingAddress.address,
                                  ord.shippingAddress.city,
                                  ord.shippingAddress.state,
                                  ord.shippingAddress.postalCode,
                                  ord.shippingAddress.country,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </Typography>
                              {ord.shippingAddress.phone && (
                                <Typography variant="caption" sx={{ display: "block", color: "primary.main", fontWeight: 700, mt: 0.4 }}>
                                  📞 {ord.shippingAddress.phone}
                                </Typography>
                              )}
                            </Box>
                          </>
                        )}

                        <Divider sx={{ my: 1.5 }} />

                        {/* Payment Footer */}
                        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                            {ord.paymentMethod?.toUpperCase() || "RAZORPAY"}
                          </Typography>
                          <Chip
                            label={ord.isPaid ? "✓ Payment Verified" : "Pending Payment"}
                            color={ord.isPaid ? "success" : "warning"}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 700 }}
                          />
                        </Stack>
                      </Paper>
                    ))
                  )}
                </Stack>
              </CustomTabPanel>

              {/* TAB 3: ADDRESSES */}
              <CustomTabPanel value={tabValue} index={2}>
                <Stack spacing={3}>
                  {/* Header */}
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                      Saved Addresses
                    </Typography>
                    <Button
                      variant={addressDialogOpen ? "outlined" : "contained"}
                      color="primary"
                      size="small"
                      startIcon={addressDialogOpen ? undefined : <AddLocation />}
                      onClick={() => {
                        if (addressDialogOpen) {
                          setAddressDialogOpen(false);
                          resetAddressForm();
                        } else {
                          resetAddressForm();
                          setAddressDialogOpen(true);
                        }
                      }}
                      sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700, px: 2.5 }}
                    >
                      {addressDialogOpen ? "Cancel" : "Add Address"}
                    </Button>
                  </Stack>

                  {/* Inline Add Address Form */}
                  {addressDialogOpen && (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 3,
                        borderRadius: 3.5,
                        borderColor: "primary.main",
                        borderWidth: 1.5,
                        bgcolor: "rgba(32, 53, 39, 0.02)",
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "primary.main", mb: 2.5 }}>
                        New Delivery Address
                      </Typography>
                      <form onSubmit={handleAddAddress}>
                        <Stack spacing={2.5}>
                          <TextField
                            label="Full Name *"
                            fullWidth
                            size="small"
                            value={addressForm.fullName}
                            onChange={(e) => setAddressForm((p) => ({ ...p, fullName: e.target.value }))}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                          />
                          <TextField
                            label="Street Address *"
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            value={addressForm.address}
                            onChange={(e) => setAddressForm((p) => ({ ...p, address: e.target.value }))}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                          />
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                label="City *"
                                fullWidth
                                size="small"
                                value={addressForm.city}
                                onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                label="State *"
                                fullWidth
                                size="small"
                                value={addressForm.state}
                                onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                              />
                            </Grid>
                          </Grid>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                label="Pin Code *"
                                fullWidth
                                size="small"
                                value={addressForm.postalCode}
                                onChange={(e) => setAddressForm((p) => ({ ...p, postalCode: e.target.value }))}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                label="Country"
                                fullWidth
                                size="small"
                                value={addressForm.country}
                                onChange={(e) => setAddressForm((p) => ({ ...p, country: e.target.value }))}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                              />
                            </Grid>
                          </Grid>
                          <TextField
                            label="Phone Number *"
                            fullWidth
                            size="small"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm((p) => ({ ...p, phone: e.target.value }))}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                          />
                          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                            <input
                              type="checkbox"
                              id="isDefaultChkInline"
                              checked={addressForm.isDefault}
                              onChange={(e) => setAddressForm((p) => ({ ...p, isDefault: e.target.checked }))}
                              style={{ width: 18, height: 18, accentColor: "#203527", cursor: "pointer", flexShrink: 0 }}
                            />
                            <Typography
                              component="label"
                              htmlFor="isDefaultChkInline"
                              variant="body2"
                              sx={{ fontWeight: 600, cursor: "pointer" }}
                            >
                              Set as my default delivery address
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={2} sx={{ pt: 0.5 }}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              disabled={addressSaving}
                              startIcon={addressSaving ? <CircularProgress size={16} color="inherit" /> : <AddLocation />}
                              sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700, px: 3 }}
                            >
                              {addressSaving ? "Saving..." : "Save Address"}
                            </Button>
                            <Button
                              variant="text"
                              onClick={() => { setAddressDialogOpen(false); resetAddressForm(); }}
                              sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700 }}
                            >
                              Cancel
                            </Button>
                          </Stack>
                        </Stack>
                      </form>
                    </Paper>
                  )}

                  {/* Address Cards */}
                  {(() => {
                    const u = user as any;
                    const userAddresses: any[] = u?.addresses || [];

                    if (userAddresses.length === 0 && !addressDialogOpen) {
                      return (
                        <Paper
                          variant="outlined"
                          sx={{ p: 6, textAlign: "center", borderRadius: 3.5, bgcolor: "#FAF9F5" }}
                        >
                          <Home sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                            No saved addresses yet
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, mb: 3 }}>
                            Add your delivery address to speed up checkout.
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddLocation />}
                            onClick={() => { resetAddressForm(); setAddressDialogOpen(true); }}
                            sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700, px: 3 }}
                          >
                            Add Your First Address
                          </Button>
                        </Paper>
                      );
                    }

                    if (userAddresses.length === 0) return null;

                    return (
                      <Grid container spacing={3}>
                        {userAddresses.map((addr: any, idx: number) => (
                          <Grid size={{ xs: 12, sm: 6 }} key={addr._id || idx}>
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 3,
                                borderRadius: 3.5,
                                position: "relative",
                                borderColor: addr.isDefault ? "primary.main" : "divider",
                                borderWidth: addr.isDefault ? 2 : 1,
                                bgcolor: addr.isDefault ? "rgba(32, 53, 39, 0.03)" : "background.paper",
                                transition: "all 0.2s ease",
                              }}
                            >
                              {addr.isDefault && (
                                <Chip
                                  label="✓ Default Shipping"
                                  color="primary"
                                  size="small"
                                  sx={{ position: "absolute", top: 12, right: 12, fontWeight: 700, fontSize: "10px" }}
                                />
                              )}

                              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5, pr: addr.isDefault ? 14 : 0 }}>
                                <Home sx={{ fontSize: 18, color: "primary.main" }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                  {addr.fullName}
                                </Typography>
                              </Stack>

                              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.8, mb: addr.phone ? 0.5 : 2 }}>
                                {addr.address}<br />
                                {addr.city}, {addr.state} — {addr.postalCode}<br />
                                {addr.country || "India"}
                              </Typography>

                              {addr.phone && (
                                <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 700, mb: 2 }}>
                                  📞 {addr.phone}
                                </Typography>
                              )}

                              <Divider sx={{ mb: 1.5 }} />

                              <Stack direction="row" spacing={1}>
                                {!addr.isDefault && (
                                  <Button
                                    size="small"
                                    disableRipple
                                    variant="text"
                                    onClick={() => handleSetDefault(addr._id)}
                                    sx={{ textTransform: "none", fontWeight: 700, borderRadius: "0", fontSize: "11px", p: 0, border:0, background:'transparent' }}
                                  >
                                    Set as Default
                                  </Button>
                                )}
                                <Button
                                  size="small"
                                  variant="text"
                                  color="error"
                                  onClick={() => handleDeleteAddress(addr._id)}
                                  sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px", fontSize: "11px" }}
                                >
                                  Remove
                                </Button>
                              </Stack>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    );
                  })()}
                </Stack>
              </CustomTabPanel>

              {/* TAB 4: SAVED PRODUCTS / WISHLIST */}
              <CustomTabPanel value={tabValue} index={3}>
                <Stack spacing={3}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                      Your Saved Products
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                      {(user as any)?.savedProducts?.length || 0} Saved Items
                    </Typography>
                  </Stack>

                  {!(user as any)?.savedProducts || (user as any).savedProducts.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 6, textAlign: "center", borderRadius: 3.5, bgcolor: "#FAF9F5" }}>
                      <Favorite sx={{ fontSize: 48, color: "text.secondary", mb: 1, opacity: 0.5 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                        No saved products yet
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                        Click the heart icon on any product in our harvest collection to save it for later.
                      </Typography>
                      <Button
                        component={Link}
                        href="/products"
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700, px: 4 }}
                      >
                        Browse Harvest Products
                      </Button>
                    </Paper>
                  ) : (
                    <Grid container spacing={2}>
                      {(user as any).savedProducts.map((savedItem: any) => {
                        const prod = typeof savedItem === "object" ? savedItem : null;
                        if (!prod) return null;
                        const prodId = prod._id || prod.id;
                        const prodImg = prod.images?.[0] || prod.image || "/assets/cashews_product.png";
                        const price = prod.prices?.[0]?.price || prod.price || 0;
                        const size = prod.prices?.[0]?.size || "Standard";

                        return (
                          <Grid size={{ xs: 12, sm: 6 }} key={prodId}>
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 2,
                                borderRadius: 3,
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                bgcolor: "#FAF9F5",
                                borderColor: "rgba(32, 53, 39, 0.12)",
                              }}
                            >
                              <Box sx={{ width: 64, height: 64, borderRadius: 2, overflow: "hidden", flexShrink: 0, bgcolor: "white" }}>
                                <img src={prodImg} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Link href={`/products/${prod.slug || prodId}`} style={{ textDecoration: "none", color: "inherit" }}>
                                  <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800 }}>
                                    {prod.name}
                                  </Typography>
                                </Link>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                  ₹{price.toFixed(2)} ({size})
                                </Typography>
                              </Box>
                              <IconButton
                                size="small"
                                color="error"
                                title="Remove from saved products"
                                onClick={async () => {
                                  try {
                                    const token = getToken();
                                    if (token) {
                                      await productService.removeSavedProduct(prodId, token);
                                      toast.success("Removed from saved products");
                                      await refetch();
                                    }
                                  } catch (e: any) {
                                    toast.error(e.message || "Failed to remove product");
                                  }
                                }}
                              >
                                <DeleteOutlined fontSize="small" />
                              </IconButton>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                </Stack>
              </CustomTabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Premium Avatar Upload Dialog */}
      <Dialog
        open={avatarDialogOpen}
        onClose={() => { if (!uploadingAvatar) { setAvatarDialogOpen(false); setPreviewFile(null); setPreviewUrl(""); } }}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, overflow: "hidden" } } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontFamily: outFit.style.fontFamily,
            bgcolor: "#0B2013",
            color: "white",
            py: 2.5,
            px: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <PhotoCamera sx={{ color: "rgba(255,255,255,0.7)" }} />
          Update Profile Picture
        </DialogTitle>

        <DialogContent sx={{ p: 3, bgcolor: "#FDFDFB" }}>
          {/* If a file is selected – show preview + confirm */}
          {previewUrl ? (
            <Stack spacing={3} sx={{ alignItems: "center", py: 1 }}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar
                  src={previewUrl}
                  sx={{
                    width: 120,
                    height: 120,
                    border: "4px solid",
                    borderColor: "primary.main",
                    boxShadow: "0px 12px 32px rgba(32,53,39,0.18)",
                    fontSize: "48px",
                  }}
                />
                <Chip
                  label={previewFile?.name || "Preview"}
                  size="small"
                  sx={{ maxWidth: 220, fontWeight: 600, fontSize: 11 }}
                />
              </Box>

              {/* File info */}
              <Box
                sx={{
                  bgcolor: "rgba(32,53,39,0.04)",
                  border: "1px solid rgba(32,53,39,0.1)",
                  borderRadius: 2.5,
                  p: 2,
                  width: "100%",
                }}
              >
                <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Size:</strong> {previewFile ? (previewFile.size / 1024 / 1024).toFixed(2) + " MB" : "—"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Type:</strong> {previewFile?.type.replace("image/", "").toUpperCase() || "—"}
                  </Typography>
                </Stack>
              </Box>

              {/* Progress bar during upload */}
              {uploadingAvatar && uploadProgress > 0 && (
                <Box sx={{ width: "100%" }}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "primary.main" }}>Uploading to ImageKit...</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "primary.main" }}>{uploadProgress}%</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ borderRadius: 4, height: 6, bgcolor: "rgba(32,53,39,0.08)", "& .MuiLinearProgress-bar": { bgcolor: "primary.main", borderRadius: 4 } }}
                  />
                </Box>
              )}

              <Stack direction="row" spacing={1.5} sx={{ width: "100%" }}>
                <Button
                  variant="outlined"
                  startIcon={<DeleteOutlined />}
                  onClick={() => { setPreviewFile(null); setPreviewUrl(""); }}
                  disabled={uploadingAvatar}
                  sx={{ flex: 1, borderRadius: "20px", textTransform: "none", fontWeight: 700 }}
                >
                  Change
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={uploadingAvatar ? <CircularProgress size={16} color="inherit" /> : <CloudUpload />}
                  onClick={handleUploadSelectedFile}
                  disabled={uploadingAvatar}
                  sx={{ flex: 2, borderRadius: "20px", textTransform: "none", fontWeight: 700 }}
                >
                  {uploadingAvatar ? "Uploading..." : "Upload to ImageKit"}
                </Button>
              </Stack>
            </Stack>
          ) : (
            /* Drag-and-drop dropzone */
            <Stack spacing={2.5}>
              <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: "2px dashed",
                  borderColor: isDragOver ? "primary.main" : "rgba(32,53,39,0.2)",
                  borderRadius: 3.5,
                  p: { xs: 4, sm: 5 },
                  textAlign: "center",
                  cursor: "pointer",
                  bgcolor: isDragOver ? "rgba(32,53,39,0.05)" : "#FCF9F2",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "rgba(32,53,39,0.04)",
                    "& .upload-icon": { transform: "translateY(-3px)" },
                  },
                }}
              >
                <CloudUpload
                  className="upload-icon"
                  sx={{
                    fontSize: 52,
                    color: isDragOver ? "primary.main" : "rgba(32,53,39,0.35)",
                    mb: 1.5,
                    transition: "transform 0.25s ease",
                  }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "primary.main", fontFamily: outFit.style.fontFamily }}>
                  {isDragOver ? "Drop image here" : "Drag & drop your photo"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  or <span style={{ color: "#203527", fontWeight: 700, textDecoration: "underline" }}>click to browse</span>
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 1.5 }}>
                  JPG, PNG, WEBP · Max 10 MB · Stored on ImageKit CDN
                </Typography>
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleCustomImageUpload}
              />

              {/* Current avatar preview if exists */}
              {avatarUrl && (
                <Stack direction="row" spacing={2} sx={{ alignItems: "center", p: 2, bgcolor: "rgba(32,53,39,0.03)", borderRadius: 2.5, border: "1px solid rgba(32,53,39,0.08)" }}>
                  <Avatar src={avatarUrl} sx={{ width: 48, height: 48, border: "2px solid", borderColor: "primary.light" }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block" }}>CURRENT PHOTO</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main", fontSize: 12, wordBreak: "break-all" }}>{avatarUrl.slice(0, 50)}…</Typography>
                  </Box>
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, bgcolor: "#FDFDFB" }}>
          <Button
            onClick={() => { setAvatarDialogOpen(false); setPreviewFile(null); setPreviewUrl(""); }}
            disabled={uploadingAvatar}
            sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
