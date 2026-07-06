/* eslint-disable @typescript-eslint/no-explicit-any */
import { siteSeo } from "@/lib/seo/siteSeo";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteSeo.name,
    short_name: siteSeo.name,
    description: siteSeo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FCF9F2",
    theme_color: "#203527",
    icons: [
      {
        src: "/assets/logo-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
