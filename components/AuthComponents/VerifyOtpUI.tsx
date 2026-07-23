"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import OtpInput from "react-otp-input";
import {
  Box,
  Card,
  Button,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  VerifiedUserOutlined,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { outFit } from "@/mui-theme/_muiTheme";
import { authService } from "@/services/authService";

export default function VerifyOtpUI() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [isPending, setIsPending] = useState(false);

  // Resend OTP Countdown Timer
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (resendTimer > 0 || !email) return;
    setResendTimer(30);
    try {
      const data = await authService.sendOtp(email);
      toast.success(data.message || "A new OTP has been sent to your email!");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend OTP code");
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP code");
      return;
    }

    setIsPending(true);
    try {
      const data = await authService.verifyOtp(email, otp);
      toast.success(data.message || "OTP verified successfully!");
      router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
    } catch (err: any) {
      toast.error(err.message || "Invalid or expired verification code");
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
            href="/forgot-password"
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
            Back to Forgot Password
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
            {/* Left side: Premium Branding & Security Info */}
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
                  Verify Security<br />Passcode.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.75)",
                    lineHeight: 1.6,
                    maxWidth: 380,
                  }}
                >
                  Enter the 6-digit OTP code sent to your email to verify your identity before proceeding to set your new password.
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
                      🛡️
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        One-Time Passcode Verification
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Valid for 10 minutes from receipt.
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
                      🔑
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Instant Credentials Renewal
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Access your account immediately after reset.
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            </Box>

            {/* Right side: Verification Form */}
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
                    <VerifiedUserOutlined />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: outFit.style.fontFamily,
                      fontWeight: 800,
                      color: "primary.main",
                    }}
                  >
                    Verify OTP
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  Sent 6-digit code to <strong style={{ color: "#0B2013" }}>{email}</strong>
                </Typography>
              </Box>

              <form onSubmit={handleVerifySubmit}>
                <Stack spacing={3.5}>
                  {/* React OTP Input Container */}
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: outFit.style.fontFamily,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        color: "text.secondary",
                        mb: 2,
                        display: "block",
                      }}
                    >
                      Enter 6-Digit Verification Code
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        my: 1,
                        "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button": {
                          WebkitAppearance: "none",
                          margin: 0,
                        },
                        "& input[type=number]": {
                          MozAppearance: "textfield",
                        },
                      }}
                    >
                      <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        shouldAutoFocus
                        inputType="tel"
                        renderSeparator={<span style={{ margin: "0 4px" }} />}
                        renderInput={(props) => (
                          <input
                            {...props}
                            style={{
                              width: "44px",
                              height: "52px",
                              fontSize: "22px",
                              fontWeight: "700",
                              fontFamily: outFit.style.fontFamily,
                              textAlign: "center",
                              borderRadius: "12px",
                              border: "1.5px solid rgba(11, 32, 19, 0.2)",
                              background: "#FCF9F2",
                              color: "#0B2013",
                              outline: "none",
                              transition: "all 0.2s ease",
                              WebkitAppearance: "none",
                              MozAppearance: "textfield",
                            }}
                          />
                        )}
                      />
                    </Box>

                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Didn&apos;t receive the code?
                      </Typography>
                      <Button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendTimer > 0}
                        sx={{
                          fontSize: "12px",
                          fontWeight: 700,
                          textTransform: "none",
                          color: resendTimer > 0 ? "text.disabled" : "secondary.light",
                          p: 0,
                          minWidth: "auto",
                        }}
                      >
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                      </Button>
                    </Stack>
                  </Box>

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
                      "Submit & Verify OTP"
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

