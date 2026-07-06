import ProductDetailsUI from "@/components/ProductComponents/ProductDetailsUI";
import JsonLd from "@/components/SEO/JsonLd";
import { createBreadcrumbSchema, createProductSchema } from "@/lib/seo/schema";
import { createPageMetadata } from "@/lib/seo/siteSeo";
import { mapApiProductToUi, Product } from "@/services/productService";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://192.168.6.128:5000/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    // Try direct backend lookup by slug
    const res = await fetch(`${BACKEND_URL}/products/${slug}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const product = data.data?.product || data.data;
      if (product) return product as Product;
    }

    // Fallback: search all products and match by name-based slug
    const allRes = await fetch(`${BACKEND_URL}/products?limit=200`, {
      cache: "no-store",
    });
    if (allRes.ok) {
      const allData = await allRes.json();
      const products: Product[] = Array.isArray(allData.data)
        ? allData.data
        : allData.data?.products || [];
      const match = products.find((p) => {
        const pSlug =
          p.slug ||
          p.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        return pSlug === slug;
      });
      return match || null;
    }
    return null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${BACKEND_URL}/products?limit=100`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    const products: Product[] = Array.isArray(data.data)
      ? data.data
      : data.data?.products || [];
    return products.map((p) => ({
      slug:
        p.slug ||
        p.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await fetchProductBySlug(slug);

    if (!product) {
      return createPageMetadata({
        title: "Product Not Found | NutriHarvest",
        description: "The requested NutriHarvest product could not be found.",
        path: `/products/${slug}`,
        noIndex: true,
      });
    }

    const productSlug =
      product.slug ||
      product.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return createPageMetadata({
      title: `${product.name} | NutriHarvest`,
      description: product.description,
      path: `/products/${productSlug}`,
      keywords: [product.name, ...((product as any).dietary || []), "premium dry fruits"],
      image: (product as any).images?.[0] || (product as any).image || "",
    });
  } catch {
    return createPageMetadata({
      title: "Product Not Found | NutriHarvest",
      description: "The requested NutriHarvest product could not be found.",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const apiProduct = await fetchProductBySlug(slug);

  if (!apiProduct) return notFound();

  const product = mapApiProductToUi(apiProduct);

  return (
    <>
      <JsonLd
        data={[
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: product.name, path: `/products/${product.id}` },
          ]),
          createProductSchema(product),
        ]}
      />
      <ProductDetailsUI product={product} />
    </>
  );
}


