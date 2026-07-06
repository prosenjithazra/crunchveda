import UtilityPage, { maintenancePageData } from "@/components/UtilityPages";
import { createPageMetadata } from "@/lib/seo/siteSeo";

export const metadata = createPageMetadata({
  title: "Maintenance | NutriHarvest",
  description: "NutriHarvest is briefly under maintenance while we refresh product details, checkout support, and content modules.",
  path: "/maintenance",
  image: maintenancePageData.image,
  noIndex: true,
});

export default function MaintenancePage() {
  return <UtilityPage {...maintenancePageData} />;
}
