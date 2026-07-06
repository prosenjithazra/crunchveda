"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Stack,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
  CircularProgress,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
import {
  EmailOutlined,
  LockOutlined,
  PersonOutlined,
  Visibility,
  VisibilityOff,
  ArrowBack,
  PhoneOutlined,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useLogin, useRegister } from "@/hooks/useAuth";
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
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function LoginUI() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/profile";
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await loginMutation.mutateAsync(
        { email: loginEmail, password: loginPassword },
        {
          onSuccess: (res) => {
            const token = res.token || res.tocken || res.data?.accessToken || res.data?.token;
            const userObj = res.data?.user || (res.data?.email ? {
              id: res.data.id || "",
              name: res.data.name || "",
              email: res.data.email || "",
              role: res.data.role || "customer",
              phone: res.data.phone || "",
              avatar: res.data.avatar || "",
              createdAt: res.data.createdAt || new Date().toISOString(),
            } : null);

            if (typeof window !== "undefined") {
              if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("tocken", token);
              }
              if (userObj) {
                localStorage.setItem("user", JSON.stringify(userObj));
              }
            }
            toast.success(res.message || "Logged in successfully!");
            router.push("/profile");
          },
          onError: (err: any) => {
            toast.error(err.message || "Invalid credentials or server offline");
          },
        }
      );
    } catch (err) {
      // Handled by react-query onError
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword || !registerPhone) {
      toast.error("Please fill in all fields");
      return;
    }
    if (registerPhone.trim().length < 10) {
      toast.error("Phone number must be at least 10 characters long");
      return;
    }

    try {
      await registerMutation.mutateAsync(
        { name: registerName, email: registerEmail, password: registerPassword, phone: registerPhone, role: "customer" },
        {
          onSuccess: (res) => {
            const token = res.token || res.tocken || res.data?.accessToken || res.data?.token;
            const userObj = res.data?.user || (res.data?.email ? {
              id: res.data.id || "",
              name: res.data.name || "",
              email: res.data.email || "",
              role: res.data.role || "customer",
              phone: res.data.phone || "",
              avatar: res.data.avatar || "",
              createdAt: res.data.createdAt || new Date().toISOString(),
            } : null);

            if (typeof window !== "undefined") {
              if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("tocken", token);
              }
              if (userObj) {
                localStorage.setItem("user", JSON.stringify(userObj));
              }
            }
            toast.success(res.message || "Account created successfully!");
            router.push("/profile");
          },
          onError: (err: any) => {
            toast.error(err.message || "Registration failed or server offline");
          },
        }
      );
    } catch (err) {
      // Handled by react-query onError
    }
  };

  // Quick Demo Login helper
  const handleDemoLogin = () => {
    const mockUser = {
      id: "demo-customer-id",
      name: "Veda Sharma",
      email: "veda@crunchveda.com",
      role: "customer" as const,
      phone: "+1 (555) 234-5678",
      createdAt: new Date().toISOString(),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    };

    const mockToken = "mock-jwt-token-key-for-debugging-purposes";

    if (typeof window !== "undefined") {
      localStorage.setItem("token", mockToken);
      localStorage.setItem("tocken", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      // Update query client cache manually (this matches hook logic)
      window.location.href = "/profile";
    }
    toast.success("Logged in as Demo Customer");
  };

  return (
    <Box
      sx={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 10% 20%, rgba(246, 243, 236, 1) 0%, rgba(252, 249, 242, 1) 90%)",
        py: 6,
        px: 2,
      }}
    >
      <Stack sx={{ maxWidth: 1000, width: "100%", direction: "column" }} spacing={3}>
        {/* Back link */}
        <Box>
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBack />}
            sx={{
              color: "primary.main",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              fontFamily: outFit.style.fontFamily,
              "&:hover": { background: "rgba(32, 53, 39, 0.04)" },
            }}
          >
            Back to Home
          </Button>
        </Box>

        <Card
          sx={{
            borderRadius: {lg:5, xs:3},
            boxShadow: "0px 24px 64px rgba(6, 27, 14, 0.05)",
            border: "1px solid",
            borderColor: "rgba(32, 53, 39, 0.08)",
            overflow: "hidden",
          }}
        >
          <Box sx={{ display: {md:"grid", xs:"flex"}, gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" }, flexDirection:{md:'row', xs:'column-reverse'} }}>
            
            {/* Left side: Premium Branding & Info */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #203527 0%, #0B2013 100%)",
                p: { xs: 2,md:4, lg: 6 },
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: { xs: 260, md: "auto" },
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  width: "250px",
                  height: "250px",
                  borderRadius: "50%",
                  background: "rgba(208, 233, 212, 0.03)",
                  top: "-50px",
                  left: "-50px",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: "350px",
                  height: "350px",
                  borderRadius: "50%",
                  background: "rgba(208, 233, 212, 0.02)",
                  bottom: "-100px",
                  right: "-100px",
                },
              }}
            >
              <Stack spacing={2} sx={{ zIndex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: outFit.style.fontFamily,
                    fontWeight: 800,
                    color: "rgba(255, 255, 255, 1)",
                    letterSpacing: "-0.5px",
                    lineHeight: 1.2,
                  }}
                >
                  Pure Harvest,<br />True Wellness.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.75)",
                    lineHeight: 1.6,
                    maxWidth: 380,
                  }}
                >
                  Join NutriHarvest to experience premium, hand-picked dry fruits and organic pantry collections delivered right to your doorstep.
                </Typography>
              </Stack>

              <Box sx={{ mt: 6, zIndex: 1 }}>
                <Stack spacing={2.5}>
                  <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      🌱
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        100% Sustainably Sourced
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Straight from heritage organic farms.
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      📦
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Zero-Plastic Packaging
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Delivered in eco-friendly glass jars & compostables.
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            </Box>

            {/* Right side: Auth Form */}
            <Box sx={{ p: { xs: 2,md:4, lg: 6 }, bgcolor: "background.paper" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
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
                  },
                }}
              >
                <Tab label="Sign In" />
                <Tab label="Create Account" />
              </Tabs>

              {/* TAB 1: LOGIN */}
              <CustomTabPanel value={tabValue} index={0}>
                <form onSubmit={handleLoginSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      required
                      fullWidth
                      placeholder="Email Address"
                      type="email"
                      variant="outlined"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlined color="action" />
                            </InputAdornment>
                          ),
                        }
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3.5 } }}
                    />

                    <TextField
                      required
                      fullWidth
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlined color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3.5 } }}
                    />

                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between", alignItems: "center" }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Remember me
                          </Typography>
                        }
                      />
                      <Typography
                        variant="body2"
                        component={Link}
                        href="/forgot-password"
                        sx={{
                          color: "secondary.light",
                          fontWeight: 700,
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Forgot Password?
                      </Typography>
                    </Stack>

                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={loginMutation.isPending}
                      sx={{
                        borderRadius: "14px",
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                    >
                      {loginMutation.isPending ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </Stack>
                </form>
              </CustomTabPanel>

              {/* TAB 2: REGISTER */}
              <CustomTabPanel value={tabValue} index={1}>
                <form onSubmit={handleRegisterSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      required
                      fullWidth
                      placeholder="Full Name"
                      type="text"
                      variant="outlined"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlined color="action" />
                            </InputAdornment>
                          ),
                        }
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3.5 } }}
                    />

                    <TextField
                      required
                      fullWidth
                      placeholder="Email Address"
                      type="email"
                      variant="outlined"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlined color="action" />
                            </InputAdornment>
                          ),
                        }
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3.5 }, mb: 3 }}
                    />

                    <TextField
                      required
                      fullWidth
                      placeholder="Phone Number"
                      type="tel"
                      variant="outlined"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneOutlined color="action" />
                            </InputAdornment>
                          ),
                        }
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3.5 } }}
                    />

                    <TextField
                      required
                      fullWidth
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlined color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3.5 } }}
                    />

                    {/* Account Role defaults to customer */}
                    
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={registerMutation.isPending}
                      sx={{
                        borderRadius: "14px",
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                    >
                      {registerMutation.isPending ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </Stack>
                </form>
              </CustomTabPanel>
            </Box>
          </Box>
        </Card>
      </Stack>
    </Box>
  );
}
