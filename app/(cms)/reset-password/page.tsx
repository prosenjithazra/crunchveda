import React, { Suspense } from "react";
import ResetPasswordUI from "@/components/AuthComponents/ResetPasswordUI";
import JsonLd from "@/components/SEO/JsonLd";
import { createBreadcrumbSchema } from "@/lib/seo/schema";
import { createPageMetadata, getPageSeo } from "@/lib/seo/siteSeo";

export const metadata = createPageMetadata(getPageSeo("/reset-password"));

export default function ResetPasswordPage() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Forgot Password", path: "/forgot-password" },
          { name: "Verify OTP", path: "/verify-otp" },
          { name: "Reset Password", path: "/reset-password" },
        ])}
      />
      <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          Loading reset password...
        </div>
      }>
        <ResetPasswordUI />
      </Suspense>
    </>
  );
}

