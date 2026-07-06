"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Container, Typography, Button, IconButton, CircularProgress } from "@mui/material";
import { assets } from "@/json/assest";
import { CartMainWrapper } from "@/styles/StyledComponents/CartMainWrapper";
import WhatsAppIcon from "@/ui/Icons/WhatsAppIcon";
import MinusIcon from "@/ui/Icons/MinusIcon";
import PlusIcon from "@/ui/Icons/PlusIcon";
import TrashIcon from "@/ui/Icons/TrashIcon";
import LockIcon from "@/ui/Icons/LockIcon";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { toast } from "react-hot-toast";

import { cartService, type CartItem } from "@/services/cartService";
import { mapApiProductToUi } from "@/services/productService";

interface UpsellItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function CartMain() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadCart = useCallback(async () => {
    try {
      const items = await cartService.getCart();
      if (items.length === 0) {
        const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("tocken")) : null;
        if (!token) {
          const defaultItems: CartItem[] = [
            {
              id: "strawberries",
              name: "Artisanal Forest Strawberries",
              badge: "SEASONAL SELECTION",
              price: 18.0,
              quantity: 2,
              image: assets.strawberries,
              size: "250g",
            },
            {
              id: "olive_oil",
              name: "Cold-Pressed Heritage Olive Oil",
              badge: "ESTATE BOTTLED",
              price: 45.0,
              quantity: 1,
              image: assets.oliveOil,
              size: "500ml",
            },
          ];
          setCartItems(defaultItems);
          cartService.saveLocalFallback(defaultItems);
          // Sync defaults to DB asynchronously
          defaultItems.forEach(item => {
            cartService.updateItem(item.id, item.quantity, item.size, item.price);
          });
        } else {
          setCartItems([]);
        }
      } else {
        setCartItems(items);
        cartService.saveLocalFallback(items);
      }
    } catch (error) {
      console.error("CartMain: Failed to load cart:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("cartUpdated", loadCart);
    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, [loadCart]);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    cartService.saveLocalFallback(items);
  };

  const upsellProducts: UpsellItem[] = [
    {
      id: "fleur_de_sel",
      name: "Infused Fleur de Sel",
      price: 12.0,
      image: assets.fleurDeSel,
    },
    {
      id: "wildflower_honey",
      name: "Raw Wildflower Honey",
      price: 22.0,
      image: assets.wildflowerHoney,
    },
    {
      id: "sourdough_bread",
      name: "Stone-Baked Sourdough",
      price: 9.0,
      image: assets.sourdoughBread,
    },
  ];

  const handleIncrease = async (id: string, size: string) => {
    const updated = cartItems.map((item) => {
      if (item.id === id && item.size === size) {
        const newQty = item.quantity + 1;
        cartService.updateItem(id, newQty, size, item.price);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleDecrease = async (id: string, size: string) => {
    const updated = cartItems.map((item) => {
      if (item.id === id && item.size === size && item.quantity > 1) {
        const newQty = item.quantity - 1;
        cartService.updateItem(id, newQty, size, item.price);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleRemove = async (id: string, size: string) => {
    const updated = cartItems.filter((item) => !(item.id === id && item.size === size));
    saveCart(updated);
    toast.success("Item removed from basket");
    await cartService.removeItem(id, size);
  };

  const handleAddUpsell = async (upsell: UpsellItem) => {
    let updated: CartItem[] = [];
    const size = "Regular";
    const existing = cartItems.find((item) => item.id === upsell.id && item.size === size);

    if (existing) {
      toast.success(`Incremented quantity of ${upsell.name}`);
      const newQty = existing.quantity + 1;
      updated = cartItems.map((item) =>
        item.id === upsell.id && item.size === size
          ? { ...item, quantity: newQty }
          : item
      );
      cartService.updateItem(upsell.id, newQty, size, upsell.price);
    } else {
      toast.success(`Added ${upsell.name} to basket`);
      let badgeText = "UPSELL EXCLUSIVE";
      if (upsell.id === "fleur_de_sel") badgeText = "HERITAGE SALT";
      if (upsell.id === "wildflower_honey") badgeText = "ORGANIC HONEY";
      if (upsell.id === "sourdough_bread") badgeText = "DAILY FRESH";

      const newItem = {
        id: upsell.id,
        name: upsell.name,
        badge: badgeText,
        price: upsell.price,
        quantity: 1,
        image: upsell.image,
        size,
      };
      updated = [...cartItems, newItem];
      cartService.updateItem(upsell.id, 1, size, upsell.price);
    }
    saveCart(updated);
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 12.0 : 0.0;
  const tax = subtotal > 0 ? Math.round(subtotal * 0.0555 * 100) / 100 : 0.0; // matching the 5.55% mockup tax ratio
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your basket is empty!");
      return;
    }
    router.push("/checkout");
  };

  return (
    <CartMainWrapper>
      <Container fixed>
        {/* Title Block */}
        <Typography variant="h1" className="cart_title">
          Harvest Basket
        </Typography>
        <Typography variant="body1" className="cart_subtitle">
          Review your selected artisanal produce before checkout.
        </Typography>

        {/* Layout */}
        <Box className="cart_layout">
          {/* Left: Cart items */}
          <Box className="items_column">
            {!isLoaded ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : cartItems.length === 0 ? (
              <Box
                sx={{
                  background: "#FFF",
                  borderRadius: "20px",
                  p: 6,
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                  border: "1px solid rgba(0,0,0,0.03)",
                }}
              >
                <Box
                  component="p"
                  sx={{
                    fontSize: "18px",
                    fontWeight: 600,
                    mb: 3,
                    color: "text.secondary",
                  }}
                >
                  Your basket is currently empty.
                </Box>
                <Link
                  href="/products"
                  style={{
                    display: "inline-block",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    background: "#0B2013",
                    color: "#FFF",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Browse Products
                </Link>
              </Box>
            ) : (
              cartItems.map((item) => (
                <Box className="cart_item_card" key={`${item.id}-${item.size}`}>
                  {/* Image */}
                  <Box className="item_image">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={800}
                      height={800}
                      priority
                    />
                  </Box>{" "}
                  {/* Info */}
                  <Box className="item_details">
                    <Box className="item_badge">{item.badge}</Box>
                    <Typography variant="h3" className="item_name">
                      {item.name} {item.size && `(${item.size})`}
                    </Typography>

                    {/* Actions Row */}
                    <Box className="item_actions">
                      <Box className="cart_quantity">
                        <IconButton
                          onClick={() => handleDecrease(item.id, item.size)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                          disableRipple
                        >
                          <MinusIcon />
                        </IconButton>
                        <Box className="qty_text">
                          {String(item.quantity).padStart(2, "0")}
                        </Box>
                        <IconButton
                          onClick={() => handleIncrease(item.id, item.size)}
                          aria-label="Increase quantity"
                          disableRipple
                        >
                          <PlusIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                  {/* Price */}
                  <Box className="item_price_box">
                    <Box className="item_price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Box>

                    <Button
                      className="remove_btn"
                      onClick={() => handleRemove(item.id, item.size)}
                      disableRipple
                    >
                      <TrashIcon />
                      Remove
                    </Button>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {/* Right: Summary Card */}
          <Box className="summary_column">
            <Box className="summary_card">
              <Box component="h2" className="summary_title">
                Summary
              </Box>

              <Box className="summary_row">
                <Box className="row_label">Subtotal</Box>
                <Box className="row_value">${subtotal.toFixed(2)}</Box>
              </Box>

              <Box className="summary_row">
                <Box className="row_label">Estimated Shipping</Box>
                <Box className="row_value">${shipping.toFixed(2)}</Box>
              </Box>

              <Box className="summary_row">
                <Box className="row_label">Tax</Box>
                <Box className="row_value">${tax.toFixed(2)}</Box>
              </Box>

              <Box className="summary_divider" />

              <Box className="total_row">
                <Box className="total_label">Total</Box>
                <Box className="total_value">${total.toFixed(2)}</Box>
              </Box>

              <Button
                variant="contained"
                color="primary"
                disableRipple
                onClick={handleCheckout}
                endIcon={<ArrowForwardIcon />}
                fullWidth
                sx={{marginBottom:'10px'}}
              >
                Proceed to Checkout
              </Button>

              <Link href="/products" className="continue_browsing_btn">
                Continue Browsing
              </Link>

              {/* Secure Badge */}
              <Box className="secure_badge">
                <LockIcon />
                <Box className="secure_info">
                  <Box className="secure_title">Secure Transaction</Box>
                  <Box className="secure_sub">Personalized manual checkout</Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Upsell Section */}
        <Box className="upsell_section">
          <Typography variant="h2" className="upsell_title">
            Enhance Your Harvest
          </Typography>
          <Box className="upsell_grid">
            {upsellProducts.map((upsell) => (
              <Box className="upsell_card" key={upsell.id}>
                <Box className="upsell_img">
                  <Image
                    src={upsell.image}
                    alt={upsell.name}
                    width={300}
                    height={250}
                  />
                </Box>
                <Box className="upsell_details">
                  <Typography variant="h4" className="upsell_name">
                    {upsell.name}
                  </Typography>
                  <Box className="upsell_price">${upsell.price.toFixed(2)}</Box>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  disableRipple
                  onClick={() => handleAddUpsell(upsell)}
                  fullWidth
                >
                  Add to Basket
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </CartMainWrapper>
  );
}
