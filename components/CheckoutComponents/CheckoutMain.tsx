"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Paper,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WhatsAppIcon from "@/ui/Icons/WhatsAppIcon";
import LockIcon from "@/ui/Icons/LockIcon";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useAuth";
import { outFit } from "@/mui-theme/_muiTheme";
import { cartService, type CartItem } from "@/services/cartService";



export default function CheckoutMain() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please log in to complete your checkout.");
      router.push("/login?redirect=/checkout");
    }
  }, [user, isLoading, router]);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Form states for Shipping/Delivery Details
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("United States");

  // Load cart from database via cartService
  useEffect(() => {
    let active = true;
    cartService.getCart().then((items) => {
      if (!active) return;
      setCartItems(items);
      setIsCartLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  // Pre-fill address if available in user mock info
  useEffect(() => {
    if (user) {
      // If we want to use some default address or let user type
      setStreet("123 Heritage Farm Lane");
      setCity("Portland");
      setState("OR");
      setZip("97201");
      setCountry("United States");
    }
  }, [user]);

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 12.0 : 0.0;
  const tax = subtotal > 0 ? Math.round(subtotal * 0.0555 * 100) / 100 : 0.0;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    if (!user) {
      toast.error("Please log in first");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your basket is empty!");
      return;
    }
    if (!street || !city || !state || !zip || !country) {
      toast.error("Please complete all shipping address fields");
      return;
    }

    const itemsText = cartItems
      .map(
        (item) =>
          `• ${item.quantity} x ${item.name} (${item.badge}) - ₹${(
            item.price * item.quantity
          ).toFixed(2)}`,
      )
      .join("\n");

    const checkoutMessage = `Hi, I would like to place an order!\n\n` +
      `👤 Customer Information:\n` +
      `Name: ${user.name}\n` +
      `Email: ${user.email}\n` +
      `Phone: ${user.phone}\n\n` +
      `📍 Delivery Address:\n` +
      `Street: ${street}\n` +
      `City: ${city}, ${state} ${zip}\n` +
      `Country: ${country}\n\n` +
      `📦 Order Details:\n` +
      `${itemsText}\n\n` +
      `Subtotal: ₹${subtotal.toFixed(2)}\n` +
      `Shipping: ₹${shipping.toFixed(2)}\n` +
      `Tax: ₹${tax.toFixed(2)}\n` +
      `Total: ₹${total.toFixed(2)}\n\n` +
      `Please confirm receipt and send me the payment link. Thank you!`;

    window.open(
      `https://wa.me/+91908430340?text=${encodeURIComponent(checkoutMessage)}`,
      "_blank",
    );

    // Clear cart upon successful order
    if (typeof window !== "undefined") {
      localStorage.removeItem("cartItems");
    }
    toast.success("Order request sent! Clearing basket.");
    router.push("/profile");
  };

  if (isLoading || !isCartLoaded) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

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
            You must be logged in to access the checkout page.
          </Typography>
          <Button
            component={Link}
            href="/login?redirect=/checkout"
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#FDFDFD", py: 8 }}>
      <Container maxWidth="lg">
        {/* Back to Cart link */}
        <Box sx={{ mb: 4 }}>
          <Button
            component={Link}
            href="/cart"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "primary.main",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              fontFamily: outFit.style.fontFamily,
              "&:hover": { background: "rgba(32, 53, 39, 0.04)" },
            }}
          >
            Back to Cart
          </Button>
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontFamily: outFit.style.fontFamily,
            fontWeight: 800,
            color: "primary.main",
            mb: 1,
          }}
        >
          Secure Checkout
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 5 }}>
          Provide your shipping details and verify your harvest items to request manual WhatsApp checkout.
        </Typography>

        <Grid container spacing={4}>
          {/* Left: Shipping Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0px 10px 30px rgba(6, 27, 14, 0.03)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}>
                Customer & Shipping Details
              </Typography>

              <Stack spacing={3}>
                {/* Read-only profile details */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={user.name}
                      disabled
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={user.email}
                      disabled
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={user.phone}
                      disabled
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                      helperText="Required phone number configured in account profile"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 1 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.secondary" }}>
                  DELIVERY ADDRESS
                </Typography>

                <TextField
                  required
                  fullWidth
                  label="Street Address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField
                      required
                      fullWidth
                      label="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField
                      required
                      fullWidth
                      label="ZIP / Postal Code"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  required
                  fullWidth
                  label="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Stack>
            </Paper>
          </Grid>

          {/* Right: Order Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
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
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, fontFamily: outFit.style.fontFamily }}>
                  Order Summary
                </Typography>

                {/* Items */}
                <Stack spacing={2} sx={{ mb: 3, maxHeight: "250px", overflowY: "auto", pr: 1 }}>
                  {cartItems.length === 0 ? (
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      No items in basket.
                    </Typography>
                  ) : (
                    cartItems.map((item) => (
                      <Stack key={item.id} direction="row" spacing={2} sx={{ alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            position: "relative",
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="50px"
                            style={{ objectFit: "cover" }}
                          />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "13px" }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                          </Typography>
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Stack>
                    ))
                  )}
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* Calculations */}
                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Subtotal</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{subtotal.toFixed(2)}</Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Estimated Shipping</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{shipping.toFixed(2)}</Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Tax (5.55%)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{tax.toFixed(2)}</Typography>
                  </Stack>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "primary.main" }}>
                      ₹{total.toFixed(2)}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Place Order */}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handlePlaceOrder}
                  startIcon={<WhatsAppIcon />}
                  sx={{
                    borderRadius: "14px",
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "16px",
                    mb: 2.5,
                  }}
                >
                  Confirm Order via WhatsApp
                </Button>

                {/* Trust Badge */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    bgcolor: "rgba(32, 53, 39, 0.03)",
                    p: 2,
                    borderRadius: 3,
                  }}
                >
                  <LockIcon />
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, display: "block", color: "primary.main" }}>
                      Manual Secure Verification
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Your order details are verified securely by our farm concierge.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
