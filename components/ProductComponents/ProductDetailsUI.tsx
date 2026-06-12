"use client";
import React from "react";
import ProductDetailsMain from "./ProductDetailsMain";
import { DryFruitProduct } from "@/json/mock/dryFruits";

interface Props {
  product: DryFruitProduct;
}

export default function ProductDetailsUI({ product }: Props) {
  return <ProductDetailsMain product={product} />;
}
