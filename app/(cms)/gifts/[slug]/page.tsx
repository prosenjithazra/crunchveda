/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import GiftDetailsMain from "@/components/GiftsComponents/GiftDetailsMain";
import JsonLd from "@/components/SEO/JsonLd";
import { createBreadcrumbSchema } from "@/lib/seo/schema";
import { createPageMetadata } from "@/lib/seo/siteSeo";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const formattedTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return createPageMetadata({
    title: `${formattedTitle} | Premium Gifting | NutriHarvest`,
    description: `Discover the details, ingredients, and custom options for our premium curated gift set: ${formattedTitle}.`,
    path: `/gifts/${slug}`,
  });
}

export default async function GiftDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const formattedTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <>
      <JsonLd
        data={[
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Gifts", path: "/gifts" },
            { name: formattedTitle, path: `/gifts/${slug}` },
          ]),
        ]}
      />
      <GiftDetailsMain slug={slug} />
    </>
  );
}
