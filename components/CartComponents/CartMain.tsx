"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Container, Typography, Button, IconButton } from "@mui/material";
import { assets } from "@/json/assest";
import { CartMainWrapper } from "@/styles/StyledComponents/CartMainWrapper";
import WhatsAppIcon from "@/ui/Icons/WhatsAppIcon";
import MinusIcon from "@/ui/Icons/MinusIcon";
import PlusIcon from "@/ui/Icons/PlusIcon";
import TrashIcon from "@/ui/Icons/TrashIcon";
import LockIcon from "@/ui/Icons/LockIcon";
import { toast } from "react-hot-toast";

interface CartItem {
  id: string;
  name: string;
  badge: string;
  price: number;
  quantity: number;
  image: string;
}

interface UpsellItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function CartMain() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "strawberries",
      name: "Artisanal Forest Strawberries",
      badge: "SEASONAL SELECTION",
      price: 18.0,
      quantity: 2,
      image: assets.strawberries,
    },
    {
      id: "olive_oil",
      name: "Cold-Pressed Heritage Olive Oil",
      badge: "ESTATE BOTTLED",
      price: 45.0,
      quantity: 1,
      image: assets.oliveOil,
    },
  ]);

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

  const handleIncrease = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const handleDecrease = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed from basket");
  };

  const handleAddUpsell = (upsell: UpsellItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === upsell.id);
      if (existing) {
        toast.success(`Incremented quantity of ${upsell.name}`);
        return prev.map((item) =>
          item.id === upsell.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        toast.success(`Added ${upsell.name} to basket`);
        let badgeText = "UPSELL EXCLUSIVE";
        if (upsell.id === "fleur_de_sel") badgeText = "HERITAGE SALT";
        if (upsell.id === "wildflower_honey") badgeText = "ORGANIC HONEY";
        if (upsell.id === "sourdough_bread") badgeText = "DAILY FRESH";

        return [
          ...prev,
          {
            id: upsell.id,
            name: upsell.name,
            badge: badgeText,
            price: upsell.price,
            quantity: 1,
            image: upsell.image,
          },
        ];
      }
    });
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
    const itemsText = cartItems
      .map(
        (item) =>
          `• ${item.quantity} x ${item.name} (${item.badge}) - $${(
            item.price * item.quantity
          ).toFixed(2)}`,
      )
      .join("\n");
    const checkoutMessage = `Hi, I would like to place an order for my Harvest Basket:\n\n${itemsText}\n\nSubtotal: $${subtotal.toFixed(
      2,
    )}\nShipping: $${shipping.toFixed(2)}\nTax: $${tax.toFixed(
      2,
    )}\nTotal: $${total.toFixed(2)}\n\nPlease assist me with checking out. Thank you!`;

    window.open(
      `https://wa.me/+91908430340?text=${encodeURIComponent(checkoutMessage)}`,
      "_blank",
    );
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
            {cartItems.length === 0 ? (
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
                  href="/product"
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
                <Box className="cart_item_card" key={item.id}>
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
                      {item.name}
                    </Typography>

                    {/* Actions Row */}
                    <Box className="item_actions">
                      <Box className="cart_quantity">
                        <IconButton
                          onClick={() => handleDecrease(item.id)}
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
                          onClick={() => handleIncrease(item.id)}
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
                      onClick={() => handleRemove(item.id)}
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
                endIcon={<WhatsAppIcon />}
                fullWidth
              >
                Proceed to WhatsApp Order
              </Button>

              <Link href="/product" className="continue_browsing_btn">
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
