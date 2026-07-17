import UtilityPage, { comingSoonPageData } from "@/components/UtilityPages";
import { createPageMetadata } from "@/lib/seo/siteSeo";

export const metadata = createPageMetadata({
  title: "Coming Soon | Crunchveda",
  description: "A refined Crunchveda experience is coming soon with curated drops, seasonal gifting, and smoother shopping flows.",
  path: "/coming-soon",
  image: comingSoonPageData.image,
  noIndex: true,
});

export default function ComingSoonPage() {
  return <UtilityPage {...comingSoonPageData} />;
}
