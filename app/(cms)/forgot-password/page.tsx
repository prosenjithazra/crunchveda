import React from "react";
import ForgotPasswordUI from "@/components/AuthComponents/ForgotPasswordUI";
import JsonLd from "@/components/SEO/JsonLd";
import { createBreadcrumbSchema } from "@/lib/seo/schema";
import { createPageMetadata, getPageSeo } from "@/lib/seo/siteSeo";

export const metadata = createPageMetadata(getPageSeo("/forgot-password"));

export default function ForgotPasswordPage() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Sign In", path: "/login" },
          { name: "Forgot Password", path: "/forgot-password" },
        ])}
      />
      <ForgotPasswordUI />
    </>
  );
}
