import { dryFruits } from "@/json/mock/dryFruits";
import { siteSeo } from "@/lib/seo/siteSeo";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const baseUrl = siteSeo.url;

  // Key public static pages with search priorities
  const mainPublicPages = [
    { path: "/", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/categories", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/products", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/best-seller", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/gifts", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/about-us", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/our-story", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/sustainability", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact-us", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/help-support", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/privacy-policy", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/terms-condition", priority: 0.5, changeFrequency: "yearly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = mainPublicPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Dynamic product routes
  const productEntries: MetadataRoute.Sitemap = dryFruits.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
