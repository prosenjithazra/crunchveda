
import HomeUI from "@/components/HomeComponents/HomeUI";
import JsonLd from "@/components/SEO/JsonLd";
import { createBreadcrumbSchema, homeFaqSchema } from "@/lib/seo/schema";
import { createPageMetadata, getPageSeo } from "@/lib/seo/siteSeo";

export const metadata = createPageMetadata(getPageSeo("/"));

export default function Page() {
  return (
    <>
      <JsonLd data={[createBreadcrumbSchema([{ name: "Home", path: "/" }]), homeFaqSchema]} />
      <HomeUI />
    </>
  );
}
