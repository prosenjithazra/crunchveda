import { siteSeo } from "@/lib/seo/siteSeo";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteSeo.title,
    short_name: siteSeo.name,
    description: siteSeo.description,
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FCF9F2",
    theme_color: "#203527",
    categories: ["shopping", "food", "lifestyle"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    shortcuts: [
      {
        name: "Shop Dry Fruits",
        short_name: "Products",
        description: "Browse organic dry fruits & nuts",
        url: "/products",
      },
      {
        name: "Curated Gift Hampers",
        short_name: "Gifts",
        description: "Explore dry fruit gifts",
        url: "/gifts",
      },
    ],
  };
}
