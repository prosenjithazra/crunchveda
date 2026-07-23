import React from "react";
import HelpSupportMain from "@/components/HelpSupportComponents/HelpSupportMain";
import JsonLd from "@/components/SEO/JsonLd";
import { createBreadcrumbSchema } from "@/lib/seo/schema";
import { createPageMetadata, getPageSeo } from "@/lib/seo/siteSeo";

export const metadata = createPageMetadata(getPageSeo("/help-support"));

export default function HelpSupportPage() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Help & Support", path: "/help-support" },
        ])}
      />
      <HelpSupportMain />
    </>
  );
}
