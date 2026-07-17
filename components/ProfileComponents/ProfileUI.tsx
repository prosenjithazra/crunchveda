"use client";

import React, { useState, useEffect } from "react";
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
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
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
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useUser, useLogout, useUpdateProfile } from "@/hooks/useAuth";
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
  const { user, isLoading } = useUser();
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

  // Address forms
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      street: "123 Heritage Farm Lane",
      city: "Portland",
      state: "OR",
      zip: "97201",
      country: "United States",
      isDefault: true,
    },
    {
      id: 2,
      type: "Office",
      street: "500 Wellness Parkway, Suite 12",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "United States",
      isDefault: false,
    },
  ]);

  // Sync state with user loaded from react query/localStorage
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatarUrl(user.avatar || "");
      setPhone(user.phone || "");
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
    if (!name || !email || !phone) {
      toast.error("Name, Email, and Phone number are required");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({ name, email, phone, avatar: avatarUrl });
      toast.success("Profile details updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile details");
    }
  };

  const selectAvatar = async (url: string) => {
    setAvatarUrl(url);
    try {
      await updateProfileMutation.mutateAsync({ name, email, phone, avatar: url });
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
      {/* 1. Header Banner */}
      <Box
        sx={{
          height: { xs: 150, sm: 220 },
          background: "linear-gradient(135deg, #203527 0%, #4D6453 100%)",
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          "&::before": {
            content: '""',
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "url('/assets/about_banner.png') center/cover no-repeat",
            opacity: 0.15,
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
                  <Avatar
                    src={avatarUrl || undefined}
                    sx={{
                      width: 100,
                      height: 100,
                      mx: "auto",
                      border: "4px solid",
                      borderColor: "background.paper",
                      boxShadow: "0px 10px 20px rgba(0,0,0,0.08)",
                      bgcolor: "primary.main",
                      fontSize: "36px",
                      fontWeight: 700,
                    }}
                  >
                    {name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
                  </Avatar>
                  <IconButton
                    size="small"
                    onClick={() => setAvatarDialogOpen(true)}
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "secondary.light",
                      color: "white",
                      "&:hover": { bgcolor: "secondary.dark" },
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                    }}
                  >
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, fontFamily: outFit.style.fontFamily }}>
                  {name}
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
                      {email}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                      PHONE NUMBER
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {phone}
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
              </Tabs>

              {/* TAB 1: PROFILE DETAILS FORM */}
              <CustomTabPanel value={tabValue} index={0}>
                <form onSubmit={handleProfileUpdate}>
                  <Stack spacing={3}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                      Personal Information
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          required
                          fullWidth
                          label="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          required
                          fullWidth
                          label="Email Address"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          required
                          fullWidth
                          label="Phone Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
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

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{
                          borderRadius: "20px",
                          px: 4,
                          py: 1,
                          textTransform: "none",
                          fontWeight: 700,
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </Stack>
                </form>
              </CustomTabPanel>

              {/* TAB 2: ORDER HISTORY */}
              <CustomTabPanel value={tabValue} index={1}>
                <Stack spacing={4}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                    Your Harvest Orders
                  </Typography>

                  {/* Order Item 1 */}
                  <Paper
                    variant="outlined"
                    sx={{ p: 3, borderRadius: 3.5, borderColor: "rgba(32, 53, 39, 0.12)", bgcolor: "#FAF9F5" }}
                  >
                    <Grid container spacing={2} sx={{ alignItems: "center", mb: 3 }}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          Order #CV-29834
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Placed on June 15, 2026 at 11:30 AM
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: { xs: "left", sm: "right" } }}>
                        <Chip
                          label="Delivered"
                          color="success"
                          size="small"
                          sx={{ fontWeight: 700, mr: 1 }}
                        />
                        <Typography variant="subtitle2" sx={{ display: "inline-block", fontWeight: 800 }}>
                          ₹142.50
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ mb: 3 }} />

                    {/* Order items detail */}
                    <Stack spacing={1.5} sx={{ mb: 3 }}>
                      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          1x Royal Afghan Almonds (1kg)
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>₹45.00</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          2x Premium Jumbo Cashews (500g)
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>₹65.00</Typography>
                      </Stack>
                      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          1x Raw Wildflower Honey (32oz)
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>₹32.50</Typography>
                      </Stack>
                    </Stack>

                    <Stepper activeStep={3} alternativeLabel sx={{ pt: 1 }}>
                      <Step key="placed">
                        <StepLabel>Placed</StepLabel>
                      </Step>
                      <Step key="processing">
                        <StepLabel>Processing</StepLabel>
                      </Step>
                      <Step key="shipped">
                        <StepLabel>In Transit</StepLabel>
                      </Step>
                      <Step key="delivered">
                        <StepLabel>Delivered</StepLabel>
                      </Step>
                    </Stepper>
                  </Paper>

                  {/* Order Item 2 */}
                  <Paper
                    variant="outlined"
                    sx={{ p: 3, borderRadius: 3.5, borderColor: "rgba(32, 53, 39, 0.12)" }}
                  >
                    <Grid container spacing={2} sx={{ alignItems: "center", mb: 3 }}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          Order #CV-29801
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Placed on May 24, 2026 at 4:15 PM
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: { xs: "left", sm: "right" } }}>
                        <Chip
                          label="Delivered"
                          color="success"
                          size="small"
                          sx={{ fontWeight: 700, mr: 1 }}
                        />
                        <Typography variant="subtitle2" sx={{ display: "inline-block", fontWeight: 800 }}>
                          ₹72.00
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ mb: 3 }} />

                    <Stack spacing={1.5} sx={{ mb: 3 }}>
                      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          3x Roasted & Salted Pistachios (250g)
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>₹72.00</Typography>
                      </Stack>
                    </Stack>

                    <Stepper activeStep={3} alternativeLabel sx={{ pt: 1 }}>
                      <Step>
                        <StepLabel>Placed</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Processing</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>In Transit</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Delivered</StepLabel>
                      </Step>
                    </Stepper>
                  </Paper>
                </Stack>
              </CustomTabPanel>

              {/* TAB 3: ADDRESSES */}
              <CustomTabPanel value={tabValue} index={2}>
                <Stack spacing={4}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                      Address Directory
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 600 }}
                    >
                      Add New Address
                    </Button>
                  </Stack>

                  <Grid container spacing={3}>
                    {addresses.map((addr) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={addr.id}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 3,
                            borderRadius: 3.5,
                            position: "relative",
                            borderColor: addr.isDefault ? "primary.main" : "divider",
                            bgcolor: addr.isDefault ? "rgba(32, 53, 39, 0.01)" : "background.paper",
                          }}
                        >
                          {addr.isDefault && (
                            <Chip
                              label="Default Shipping"
                              color="primary"
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 16,
                                right: 16,
                                fontWeight: 700,
                                height: 20,
                                fontSize: "10px",
                              }}
                            />
                          )}
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                            {addr.type} Address
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                            {addr.street}
                            <br />
                            {addr.city}, {addr.state} {addr.zip}
                            <br />
                            {addr.country}
                          </Typography>
                          
                          <Stack direction="row" spacing={1.5}>
                            <Button size="small" variant="text" sx={{ textTransform: "none", fontWeight: 700, p: 0 }}>
                              Edit
                            </Button>
                            <Button size="small" variant="text" color="error" sx={{ textTransform: "none", fontWeight: 700, p: 0 }}>
                              Delete
                            </Button>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </CustomTabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Preset Avatar Selection Dialog */}
      <Dialog open={avatarDialogOpen} onClose={() => setAvatarDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontFamily: outFit.style.fontFamily }}>
          Select Harvest Avatar
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            Choose a decorative harvest preset avatar to represent your profile:
          </Typography>
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            {avatarPresets.map((preset) => (
              <Grid size={{ xs: 4 }} key={preset.name} sx={{ textAlign: "center" }}>
                <IconButton onClick={() => selectAvatar(preset.url)} sx={{ p: 0.5 }}>
                  <Avatar
                    src={preset.url}
                    sx={{
                      width: 68,
                      height: 68,
                      border: "3px solid",
                      borderColor: "divider",
                      "&:hover": { borderColor: "primary.main" },
                    }}
                  />
                </IconButton>
                <Typography variant="caption" sx={{ display: "block", fontWeight: 600 }}>
                  {preset.name}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvatarDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
