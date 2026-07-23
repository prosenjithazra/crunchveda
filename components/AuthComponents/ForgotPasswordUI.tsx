"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Stack,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  EmailOutlined,
  ArrowBack,
  LockResetOutlined,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { outFit } from "@/mui-theme/_muiTheme";
import { authService } from "@/services/authService";

export default function ForgotPasswordUI() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsPending(true);
    try {
      const data = await authService.sendOtp(email);
      toast.success(data.message || "OTP sent successfully to your email!");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP to email address");
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
                  Secure Reset,<br />Instant Recovery.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.75)",
                    lineHeight: 1.6,
                    maxWidth: 380,
                  }}
                >
                  Enter your registered email address to receive a secure 6-digit OTP to reset your Crunchveda password.
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
                      🔒
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        256-bit Encrypted Security
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Your information is strictly protected.
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
                      📩
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Instant OTP Dispatch
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Receive your 6-digit code within seconds.
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            </Box>

            {/* Right side: Forgot Password Form */}
            <Box sx={{ p: { xs: 3, md: 4, lg: 6 }, bgcolor: "background.paper", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Box sx={{ mb: 4 }}>
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
                    Forgot Password?
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  No worries! Enter your account email below and we will send you a verification code.
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    required
                    fullWidth
                    placeholder="Enter your registered email"
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined color="action" />
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
                      "Send Verification OTP"
                    )}
                  </Button>

                  <Stack direction="row" sx={{ justifyContent: "center", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Remembered your password?{" "}
                      <Typography
                        component={Link}
                        href="/login"
                        variant="body2"
                        sx={{
                          color: "secondary.light",
                          fontWeight: 700,
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Sign In
                      </Typography>
                    </Typography>
                  </Stack>
                </Stack>
              </form>
            </Box>
          </Box>
        </Card>
      </Stack>
    </Box>
  );
}
