import ProductDetailsUI from "@/components/ProductComponents/ProductDetailsUI";
import JsonLd from "@/components/SEO/JsonLd";
import { dryFruits } from "@/json/mock/dryFruits";
import { createBreadcrumbSchema, createProductSchema } from "@/lib/seo/schema";
import { createPageMetadata } from "@/lib/seo/siteSeo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return dryFruits.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = dryFruits.find((p) => p.id === slug);

  if (!product) {
    return createPageMetadata({
      title: "Product Not Found | NutriHarvest",
      description: "The requested NutriHarvest product could not be found.",
      path: `/product/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${product.name} | ${product.category} | NutriHarvest`,
    description: product.description,
    path: `/product/${product.id}`,
    keywords: [product.name, product.category, ...product.dietary, "premium dry fruits"],
    image: product.image,
  });
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = dryFruits.find((p) => p.id === slug);

  if (!product) return notFound();

  return (
    <>
      <JsonLd
        data={[
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Products", path: "/product" },
            { name: product.name, path: `/product/${product.id}` },
          ]),
          createProductSchema(product),
        ]}
      />
      <ProductDetailsUI product={product} />
    </>
  );
}
