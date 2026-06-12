import { publicPagesSeo, siteSeo } from "@/lib/seo/siteSeo";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: publicPagesSeo.map(page => page.path),
        disallow: ["/admin", "/admin/", "/admin/*"],
      },
    ],
    sitemap: `${siteSeo.url}/sitemap.xml`,
    host: siteSeo.url,
  };
}
