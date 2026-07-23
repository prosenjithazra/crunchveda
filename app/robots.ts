import { siteSeo } from "@/lib/seo/siteSeo";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/cart",
          "/checkout",
          "/profile",
          "/forgot-password",
          "/verify-otp",
          "/reset-password",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/cart",
          "/checkout",
          "/profile",
          "/forgot-password",
          "/verify-otp",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${siteSeo.url}/sitemap.xml`,
    host: siteSeo.url,
  };
}
