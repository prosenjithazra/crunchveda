'use client';

import Link from "next/link";
import Image from "next/image";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import { Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import CommonInput from "@/ui/CommonInput/CommonInput";
import { FooterWrapper } from "@/styles/StyledComponents/FooterWrapper";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import { assets } from "@/json/assest";
import { useNewsletterStore } from "@/components/Newsletter/useNewsletterStore";
import { useStoreConfigStore } from "@/store/useStoreConfigStore";
import { useEffect } from "react";

const quickLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Our Story", href: "/our-story" },
  { label: "Best Sellers", href: "/best-seller" },
  { label: "Categories", href: "/categories" },
  { label: "Gift Hampers", href: "/gifts" },
  { label: "Contact Us", href: "/contact-us" },
];

const supportLinks = [
  { label: "Help & Support", href: "/help-support" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Saved Items", href: "/saved" },
  { label: "My Cart", href: "/cart" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-condition" }
];

interface NewsletterFormValues {
  email: string;
}

const isBlockedEmailDomain = (email: string) => {
  const blockedDomains = [
    "yopmail.com",
    "yopmail.net",
    "yopmail.fr",
    "mailinator.com",
    "mailer.com",
    "tempmail.com",
    "tempmail.net",
    "dispostable.com",
    "guerrillamail.com",
    "sharklasers.com",
    "10minutemail.com",
  ];
  const domain = email.split("@")[1]?.toLowerCase().trim() || "";
  return blockedDomains.some((blocked) => domain === blocked || domain.endsWith("." + blocked));
};

export function Footer() {
  const { config, fetchConfig } = useStoreConfigStore();

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const {
    isSubmitting,
    isSuccess,
    setSubmitting,
    setSuccess,
    setErrorMessage
  } = useNewsletterStore();

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: NewsletterFormValues) => {
    setSubmitting(true);
    setErrorMessage(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Welcome to Crunchveda! You have successfully subscribed to our newsletter.");
        setSuccess(true);
        resetForm();
      } else {
        const err = data.message || "Failed to subscribe. Please try again.";
        toast.error(err);
        setErrorMessage(err);
      }
    } catch (err) {
      const errMsg = "An unexpected error occurred. Please try again.";
      toast.error(errMsg);
      setErrorMessage(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FooterWrapper>
      <Container>
        <Box className="footer_grid">
          <Stack spacing={{lg:2.5, xs:1.25}} className="firstClm">
            <Box className="footer_logo" sx={{ maxWidth: 180 }}>
              <Link href={"/"}>
                <Image
                  src={assets.logo}
                  width={600}
                  height={400}
                  alt="crunchveda logo"
                  title="crunchveda"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </Link>
            </Box>
            <Typography variant="body2" className="brand_desc">
              Elevating agricultural heritage into premium wellness experiences. Our mission is to provide the
              world with the finest, most sustainable organic dry fruits.
            </Typography>
            <Stack direction="row" spacing={1}>
              <Link
                href={config.facebookLink || '#'}
                target={config.facebookLink ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="social_icon"
              >
                <FacebookIcon />
              </Link>
              <Link
                href={config.instagramLink || '#'}
                target={config.instagramLink ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="social_icon"
              >
                <InstagramIcon />
              </Link>
              <Link
                href={config.twitterLink || '#'}
                target={config.twitterLink ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="social_icon"
              >
                <XIcon />
              </Link>
            </Stack>
          </Stack>

          <FooterColumn title="Quick Links" links={quickLinks} />
          <FooterColumn title="Support" links={supportLinks} />

          <Stack spacing={{lg:2, xs:1}} className="newsLetterClm">
            <Typography variant="subtitle2" className="widget_title">
              Join Our Wellness List
            </Typography>
            <Typography variant="body2" className="subscribe_desc">
              Subscribe to receive recipe ideas and exclusive early access to harvests.
            </Typography>
            
            {isSuccess ? (
              <Typography variant="body2" sx={{ color: "#8F5E15", fontWeight: 700, mt: 1 }}>
                Welcome to Crunchveda! 🎉 We've sent a welcome email to your inbox.
              </Typography>
            ) : (
              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ alignItems: "flex-start" }}>
                  <Box sx={{ width: "100%" }}>
                    <CommonInput
                      fullWidth
                      placeholder="Email Address"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                        validate: {
                          noTempMail: (val) =>
                            !isBlockedEmailDomain(val) ||
                            "Disposable/temporary emails (like yopmail) are not allowed.",
                        },
                      })}
                    />
                  </Box>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                    className="subscribe_btn"
                    disabled={isSubmitting}
                    sx={{ minWidth: "90px", height: "46px" }}
                  >
                    {isSubmitting ? "..." : "Join"}
                  </Button>
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>

        <Divider className="footer_divider" />

        <Box className="footer_bottom">
          <Typography variant="caption" className="copyright_text">
            © 2026 <Link href={'/'}>{config.brandName || 'Crunchvedastore'}</Link>. Curated Excellence in Agriculture.
          </Typography>
          <Stack direction="row" spacing={2} className="payment_icons">
            <CreditCardRoundedIcon fontSize="small" />
            <LocalShippingRoundedIcon fontSize="small" />
            <VerifiedUserRoundedIcon fontSize="small" />
          </Stack>
        </Box>
      </Container>
    </FooterWrapper>
  );
}

function FooterColumn({
  title,
  links
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <Stack spacing={{lg:2, xs:1}} className="cmnClm">
      <Typography variant="subtitle2" className="widget_title">
        {title}
      </Typography>
      <Stack spacing={{lg:1.5, xs:0.5}}>
        {links.map((link) => (
          <Link key={link.label} href={link.href}>
            <Typography variant="body2" className="footer_link">
              {link.label}
            </Typography>
          </Link>
        ))}
      </Stack>
    </Stack>
  );
}
