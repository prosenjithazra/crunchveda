"use client";

import CommonInput from "@/ui/CommonInput/CommonInput";
import { adminAuthService } from "@/services/admin/authService";
import { assets } from "@/json/assest";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const session = adminAuthService.getSession();

    if (session) {
      router.replace("/admin");
    }
  }, [router]);

  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!email.trim()) {
      nextErrors.email = "Admin email is required.";
    } else if (!emailRegex.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await adminAuthService.login({ email, password });
      toast.success("Welcome back to the admin dashboard.");
      router.replace("/admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      sx={{
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 5,
        bgcolor: "customColors.greyLightBg",
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: { xs: 3, md: 5 },
          borderRadius: 2,
          boxShadow: 7,
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center" }}>
            <Image
              src={assets.logo}
              alt="NutriHarvest"
              width={170}
              height={48}
              priority
              style={{ width: "170px", height: "auto" }}
            />
            <Box>
              <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 34 } }}>
                Admin Login
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to manage content, products, media, and page sections.
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={2}>
            <CommonInput
              fullWidth
              value={email}
              type="email"
              placeholder="admin@crunchveda.com"
              onChange={event => {
                setEmail(event.target.value);
                setErrors(prev => ({ ...prev, email: undefined }));
              }}
              error={Boolean(errors.email)}
              helperText={errors.email}
              startAdornment={<MailOutlineRoundedIcon fontSize="small" />}
            />
            <CommonInput
              fullWidth
              value={password}
              placeholder="Password"
              isPassword
              onChange={event => {
                setPassword(event.target.value);
                setErrors(prev => ({ ...prev, password: undefined }));
              }}
              error={Boolean(errors.password)}
              helperText={errors.password}
              startAdornment={<LockOutlinedIcon fontSize="small" />}
            />
          </Stack>

          <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
            {loading ? "Signing in..." : "Login to dashboard"}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
