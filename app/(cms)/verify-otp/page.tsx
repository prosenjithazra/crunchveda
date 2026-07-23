import React, { Suspense } from "react";
import VerifyOtpUI from "@/components/AuthComponents/VerifyOtpUI";
import JsonLd from "@/components/SEO/JsonLd";
import { createBreadcrumbSchema } from "@/lib/seo/schema";
import { createPageMetadata, getPageSeo } from "@/lib/seo/siteSeo";

export const metadata = createPageMetadata(getPageSeo("/verify-otp"));

export default function VerifyOtpPage() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Forgot Password", path: "/forgot-password" },
          { name: "Verify OTP", path: "/verify-otp" },
        ])}
      />
      <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          Loading verification...
        </div>
      }>
        <VerifyOtpUI />
      </Suspense>
    </>
  );
}

