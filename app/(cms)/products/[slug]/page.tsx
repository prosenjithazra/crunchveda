import ProductDetailsUI from "@/components/ProductComponents/ProductDetailsUI";
import JsonLd from "@/components/SEO/JsonLd";
import { createBreadcrumbSchema, createProductSchema } from "@/lib/seo/schema";
import { createPageMetadata } from "@/lib/seo/siteSeo";
import { productService, mapApiProductToUi } from "@/services/productService";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const res = await productService.getProducts({ limit: 100 });
    return res.data.map((p) => ({ slug: p.slug }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await productService.getProductBySlug(slug);
    const product = res.data;

    if (!product) {
      return createPageMetadata({
        title: "Product Not Found | NutriHarvest",
        description: "The requested NutriHarvest product could not be found.",
        path: `/product/${slug}`,
        noIndex: true,
      });
    }

    return createPageMetadata({
      title: `${product.name} | NutriHarvest`,
      description: product.description,
      path: `/product/${product.slug}`,
      keywords: [product.name, ...(product.dietary || []), "premium dry fruits"],
      image: product.images?.[0] || "",
    });
  } catch {
    return createPageMetadata({
      title: "Product Not Found | NutriHarvest",
      description: "The requested NutriHarvest product could not be found.",
      path: `/product/${slug}`,
      noIndex: true,
    });
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  let apiProduct;
  try {
    const res = await productService.getProductBySlug(slug);
    apiProduct = res.data;
  } catch {
    return notFound();
  }
  
  if (!apiProduct) return notFound();

  const product = mapApiProductToUi(apiProduct);

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

