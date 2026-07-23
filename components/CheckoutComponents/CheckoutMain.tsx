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
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WhatsAppIcon from "@/ui/Icons/WhatsAppIcon";
import LockIcon from "@/ui/Icons/LockIcon";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useAuth";
import { outFit } from "@/mui-theme/_muiTheme";
import { cartService, type CartItem } from "@/services/cartService";

// Helper function to load external Razorpay checkout.js SDK dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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

  // Selected Payment Method: 'razorpay' | 'cod' | 'whatsapp'
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod" | "whatsapp">("razorpay");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Form states for Shipping/Delivery Details
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("India");

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

  // Pre-fill default/first address if available in user info
  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setPhone(user.phone || "");
      const u = user as any;
      const addrs = u.addresses || [];
      if (addrs.length > 0) {
        const def = addrs.find((a: any) => a.isDefault) || addrs[0];
        setSelectedAddressId(def._id || def.id || "");
        setStreet(def.address || "");
        setCity(def.city || "");
        setState(def.state || "");
        setZip(def.postalCode || "");
        setCountry(def.country || "India");
        if (def.fullName) setFullName(def.fullName);
        if (def.phone) setPhone(def.phone);
      } else {
        setSelectedAddressId("new");
        setStreet("");
        setCity("");
        setState("");
        setZip("");
        setCountry("India");
      }
    }
  }, [user]);

  const handleAddressChange = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (addrId === "new") {
      setStreet("");
      setCity("");
      setState("");
      setZip("");
      setCountry("India");
      setFullName(user?.name || "");
      setPhone(user?.phone || "");
    } else {
      const u = user as any;
      const selected = (u.addresses || []).find((a: any) => (a._id || a.id) === addrId);
      if (selected) {
        setStreet(selected.address || "");
        setCity(selected.city || "");
        setState(selected.state || "");
        setZip(selected.postalCode || "");
        setCountry(selected.country || "India");
        setFullName(selected.fullName || user?.name || "");
        setPhone(selected.phone || user?.phone || "");
      }
    }
  };

  // Order Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 50.0 : 0.0;
  const tax = subtotal > 0 ? Math.round(subtotal * 0.05 * 100) / 100 : 0.0;
  const total = subtotal + shipping + tax;

  const validateAddress = () => {
    if (!user) {
      toast.error("Please log in first");
      return false;
    }
    if (cartItems.length === 0) {
      toast.error("Your basket is empty!");
      return false;
    }
    if (!fullName || !phone || !street || !city || !state || !zip || !country) {
      toast.error("Please complete all shipping address fields");
      return false;
    }
    return true;
  };

  // Razorpay Online Payment Flow
  const handleRazorpayPayment = async () => {
    if (!validateAddress()) return;

    setIsProcessingPayment(true);
    try {
      const resScript = await loadRazorpayScript();
      if (!resScript) {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.");
        setIsProcessingPayment(false);
        return;
      }

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || localStorage.getItem("tocken")
          : null;

      // 1. Call backend API to create Razorpay Order
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/orders/create-razorpay-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: total }),
        }
      );

      const orderData = await res.json();

      let orderId = orderData.orderId;
      let razorpayKey =
        orderData.key ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        "rzp_test_TDmacLxHVFGtvl";

      if (!res.ok || !orderId) {
        // Fallback simulation orderId if backend fails
        orderId = `order_sim_${Date.now()}`;
      }

      // 2. Open Razorpay Checkout Modal Window
      const options: any = {
        key: razorpayKey,
        amount: Math.round(total * 100), // in paise
        currency: "INR",
        name: "Crunchveda",
        description: "Organic Dry Fruits & Harvest Purchase",
        image: "/assets/homeBannerImg.png",
        prefill: {
          name: fullName,
          email: user?.email || "",
          contact: phone,
        },
        theme: {
          color: "#0B2013",
        },
        handler: async function (response: any) {
          try {
            // Verify payment signature on backend server
            const verifyRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/orders/verify-razorpay-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id || orderId,
                  razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                  razorpay_signature: response.razorpay_signature || "simulated_signature",
                  orderItems: cartItems.map((item) => ({
                    product: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image,
                  })),
                  shippingAddress: {
                    fullName,
                    address: street,
                    city,
                    state,
                    postalCode: zip,
                    country,
                    phone,
                  },
                  itemsPrice: subtotal,
                  taxPrice: tax,
                  shippingPrice: shipping,
                  totalPrice: total,
                }),
              }
            );

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              toast.error(verifyData.message || "Payment verification failed.");
              setIsProcessingPayment(false);
              return;
            }

            toast.success("Payment Successful! Your harvest order has been confirmed.");
            if (typeof window !== "undefined") {
              localStorage.removeItem("cartItems");
            }
            router.push("/profile");
          } catch (err: any) {
            toast.error(err.message || "Failed to process payment verification");
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
            toast.error("Payment cancelled");
          },
        },
      };

      if (orderId && !orderId.startsWith("order_sim_")) {
        options.order_id = orderId;
      }

      const razorpayWindow = new (window as any).Razorpay(options);
      razorpayWindow.on("payment.failed", function (response: any) {
        setIsProcessingPayment(false);
        toast.error(response.error?.description || "Payment failed. Please try again.");
      });

      razorpayWindow.open();
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Cash on Delivery (COD) Flow
  const handleCodPayment = async () => {
    if (!validateAddress()) return;

    setIsProcessingPayment(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || localStorage.getItem("tocken")
          : null;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/orders/cod`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderItems: cartItems.map((item) => ({
              product: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image,
            })),
            shippingAddress: {
              fullName,
              address: street,
              city,
              state,
              postalCode: zip,
              country,
              phone,
            },
            itemsPrice: subtotal,
            taxPrice: tax,
            shippingPrice: shipping,
            totalPrice: total,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to place COD order.");
        setIsProcessingPayment(false);
        return;
      }

      toast.success("Cash on Delivery order placed successfully!");
      if (typeof window !== "undefined") {
        localStorage.removeItem("cartItems");
      }
      router.push("/profile");
    } catch (err: any) {
      toast.error(err.message || "Failed to place COD order");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // WhatsApp Order Flow
  const handleWhatsAppPayment = () => {
    if (!validateAddress()) return;

    const itemsText = cartItems
      .map(
        (item) =>
          `• ${item.quantity} x ${item.name} (${item.badge}) - ₹${(
            item.price * item.quantity
          ).toFixed(2)}`,
      )
      .join("\n");

    const checkoutMessage =
      `Hi, I would like to place an order!\n\n` +
      `👤 Customer Information:\n` +
      `Name: ${fullName}\n` +
      `Email: ${user?.email}\n` +
      `Phone: ${phone}\n\n` +
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
      `https://wa.me/+919903309030?text=${encodeURIComponent(checkoutMessage)}`,
      "_blank",
    );

    if (typeof window !== "undefined") {
      localStorage.removeItem("cartItems");
    }
    toast.success("Order request sent via WhatsApp!");
    router.push("/profile");
  };

  const handlePlaceOrderSubmit = () => {
    if (paymentMethod === "razorpay") {
      handleRazorpayPayment();
    } else if (paymentMethod === "cod") {
      handleCodPayment();
    } else {
      handleWhatsAppPayment();
    }
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
      <Container maxWidth="sm" sx={{ py: {xs:5, md:8, lg:12}, textAlign: "center" }}>
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#FDFDFD", py: {xs:6, md:8, lg:12} }}>
      <Container maxWidth="lg">
        {/* Back to Cart link */}
        <Box sx={{ mb: {xs:3, md:4, lg:4} }}>
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
          Checkout &amp; Payment
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 5 }}>
          Enter your delivery details and choose your preferred payment option below.
        </Typography>

        <Grid container spacing={4}>
          {/* Left: Shipping Form & Payment Selection */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={4}>
              {/* Shipping Address Paper */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 4 },
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0px 10px 30px rgba(6, 27, 14, 0.03)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}>
                  1. Shipping &amp; Contact Details
                </Typography>

                <Stack spacing={3}>
                  {/* Saved Addresses Section */}
                  {(() => {
                    const u = user as any;
                    const userAddresses: any[] = u?.addresses || [];

                    if (userAddresses.length > 0) {
                      return (
                        <Stack spacing={2} sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.secondary" }}>
                            SELECT DELIVERY ADDRESS
                          </Typography>
                          <Grid container spacing={2}>
                            {userAddresses.map((addr: any) => {
                              const isSelected = selectedAddressId === (addr._id || addr.id);
                              return (
                                <Grid size={{ xs: 12, sm: 6 }} key={addr._id || addr.id}>
                                  <Paper
                                    variant="outlined"
                                    onClick={() => handleAddressChange(addr._id || addr.id)}
                                    sx={{
                                      p: {xs:2,md:2.5},
                                      borderRadius: 3.5,
                                      cursor: "pointer",
                                      position: "relative",
                                      borderColor: isSelected ? "primary.main" : "divider",
                                      borderWidth: isSelected ? 2 : 1,
                                      bgcolor: isSelected ? "rgba(32, 53, 39, 0.03)" : "background.paper",
                                      transition: "all 0.2s ease",
                                      "&:hover": {
                                        borderColor: "primary.main",
                                      },
                                    }}
                                  >
                                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main" }}>
                                        {addr.fullName}
                                      </Typography>
                                      {addr.isDefault && (
                                        <Chip
                                          label="Default"
                                          color="primary"
                                          size="small"
                                          sx={{ height: 16, fontSize: "9px", fontWeight: 700 }}
                                        />
                                      )}
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.5, mb: 1 }}>
                                      {addr.address}, {addr.city}, {addr.state} - {addr.postalCode}, {addr.country || "India"}
                                    </Typography>
                                    {addr.phone && (
                                      <Typography variant="caption" sx={{ fontWeight: 700, color: "primary.main" }}>
                                        📞 {addr.phone}
                                      </Typography>
                                    )}
                                  </Paper>
                                </Grid>
                              );
                            })}
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Paper
                                variant="outlined"
                                onClick={() => handleAddressChange("new")}
                                sx={{
                                  p: {xs:2, md:2.5},
                                  borderRadius: 3.5,
                                  cursor: "pointer",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: "100%",
                                  minHeight: 100,
                                  borderColor: selectedAddressId === "new" ? "primary.main" : "divider",
                                  borderWidth: selectedAddressId === "new" ? 2 : 1,
                                  bgcolor: selectedAddressId === "new" ? "rgba(32, 53, 39, 0.03)" : "background.paper",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    borderColor: "primary.main",
                                  },
                                }}
                              >
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main" }}>
                                  + Use Different Address
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", mt: 0.5 }}>
                                  Type in custom shipping details
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        </Stack>
                      );
                    }
                    return null;
                  })()}

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.secondary" }}>
                    DELIVERY ADDRESS DETAILS
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        label="Recipient Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={selectedAddressId !== "new"}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        label="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={selectedAddressId !== "new"}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        value={user.email}
                        disabled
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    required
                    fullWidth
                    label="Street Address"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    disabled={selectedAddressId !== "new"}
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
                        disabled={selectedAddressId !== "new"}
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
                        disabled={selectedAddressId !== "new"}
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
                        disabled={selectedAddressId !== "new"}
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
                    disabled={selectedAddressId !== "new"}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                  />
                </Stack>
              </Paper>

              {/* Payment Method Section */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 4 },
                  borderRadius: {xs: 2, md:4},
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0px 10px 30px rgba(6, 27, 14, 0.03)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}>
                  2. Payment Method
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    p: {xs:1.5, md:2.5},
                    borderRadius: 3,
                    borderColor: "primary.main",
                    bgcolor: "rgba(32, 53, 39, 0.03)",
                    borderWidth: 2,
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 1 }}>
                    <CreditCardIcon sx={{ color: "primary.main" }} />
                      Pay Online
                    </Typography>
                    <Chip label="Instant &amp; Secure" color="primary" size="small" sx={{ fontWeight: 700, height: 20 }} />
                  </Stack>
                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                    Instant payment via UPI (GPay, PhonePe, Paytm), Credit &amp; Debit Cards, NetBanking &amp; Wallets.
                  </Typography>
                </Paper>
              </Paper>
            </Stack>
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
              <CardContent sx={{ p: {xs:2, md:4} }}>
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
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Delivery Shipping</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{shipping.toFixed(2)}</Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Estimated Tax (5%)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{tax.toFixed(2)}</Typography>
                  </Stack>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total Payable</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "primary.main", fontSize: "20px" }}>
                      ₹{total.toFixed(2)}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Action Submit Button */}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleRazorpayPayment}
                  disabled={isProcessingPayment}
                  startIcon={<CreditCardIcon />}
                  sx={{
                    borderRadius: "14px",
                    py: 1.6,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "16px",
                    mb: 2.5,
                  }}
                >
                  {isProcessingPayment ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    `Pay ₹${total.toFixed(2)} via Razorpay`
                  )}
                </Button>

                {/* Trust Badge */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    bgcolor: "rgba(39, 43, 41, 0.03)",
                    p: 2,
                    borderRadius: 3,
                  }}
                >
                  <LockIcon/>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, display: "block", color: "primary.main" }}>
                      256-Bit Encrypted Security
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Razorpay payments are encrypted &amp; verified securely.
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
