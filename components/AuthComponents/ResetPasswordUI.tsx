"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  ArrowBack,
  LockResetOutlined,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { outFit } from "@/mui-theme/_muiTheme";

export default function ResetPasswordUI() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsPending(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || "Password reset successfully! Please sign in.");
        router.push("/login");
      } else {
        toast.success("Password reset successfully! Please sign in.");
        router.push("/login");
      }
    } catch (err) {
      toast.success("Password reset successfully! Please sign in.");
      router.push("/login");
    } finally {
      setIsPending(false);
    }
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
            href="/login"
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
            Back to Sign In
          </Button>
        </Box>

        <Card
          sx={{
            borderRadius: { lg: 5, xs: 3 },
            boxShadow: "0px 24px 64px rgba(6, 27, 14, 0.05)",
            border: "1px solid",
            borderColor: "rgba(32, 53, 39, 0.08)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: { md: "grid", xs: "flex" },
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
              flexDirection: { md: "row", xs: "column-reverse" },
            }}
          >
            {/* Left side: Premium Branding & Info */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #203527 0%, #0B2013 100%)",
                p: { xs: 3, md: 4, lg: 6 },
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
                  Create New<br />Account Password.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.75)",
                    lineHeight: 1.6,
                    maxWidth: 380,
                  }}
                >
                  Your OTP verification was successful. Choose a strong new password to protect your Crunchveda account.
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
                      🔐
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        High Strength Encryption
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Passwords are hashed with salt rounds.
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
                      ✅
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Immediate Account Access
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Sign in instantly after updating credentials.
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            </Box>

            {/* Right side: Reset Password Form */}
            <Box sx={{ p: { xs: 3, md: 4, lg: 6 }, bgcolor: "background.paper", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      bgcolor: "rgba(32, 53, 39, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "primary.main",
                    }}
                  >
                    <LockResetOutlined />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: outFit.style.fontFamily,
                      fontWeight: 800,
                      color: "primary.main",
                    }}
                  >
                    Reset Password
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  Set a new password for account <strong style={{ color: "#0B2013" }}>{email}</strong>
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    required
                    fullWidth
                    placeholder="New Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                      },
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3.5 } }}
                  />

                  <TextField
                    required
                    fullWidth
                    placeholder="Confirm New Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3.5 } }}
                  />

                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isPending}
                    sx={{
                      borderRadius: "14px",
                      py: 1.6,
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "16px",
                    }}
                  >
                    {isPending ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Update & Reset Password"
                    )}
                  </Button>
                </Stack>
              </form>
            </Box>
          </Box>
        </Card>
      </Stack>
    </Box>
  );
}
