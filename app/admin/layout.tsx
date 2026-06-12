import { createPageMetadata } from "@/lib/seo/siteSeo";

export const metadata = createPageMetadata({
  title: "Admin | NutriHarvest",
  description: "NutriHarvest administrative workspace.",
  path: "/admin",
  noIndex: true,
});

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
