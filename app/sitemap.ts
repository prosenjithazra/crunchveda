import { dryFruits } from "@/json/mock/dryFruits";
import { publicPagesSeo, siteSeo } from "@/lib/seo/siteSeo";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = publicPagesSeo.map(page => ({
    url: `${siteSeo.url}${page.path}`,
    lastModified: now,
    changeFrequency: page.path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: page.path === "/" ? 1 : 0.8,
  }));

  const productRoutes = dryFruits.map(product => ({
    url: `${siteSeo.url}/product/${product.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
