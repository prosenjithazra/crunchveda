'use client';

import Link from "next/link";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import { Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import CommonInput from "@/ui/CommonInput/CommonInput";
import { FooterWrapper } from "@/styles/StyledComponents/FooterWrapper";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';

const quickLinks = [
  { label: "Our Story", href: "/our-story" },
  { label: "Best Sellers", href: "/best-seller" },
  { label: "Categories", href: "/categories" },
  { label: "Gift Hampers", href: "/gifts" },
  { label: "Contact Us", href: "/contact-us" },
];

const supportLinks = [
  { label: "Sustainability", href: "/sustainability" },
  { label: "Saved Items", href: "/saved" },
  { label: "My Cart", href: "/cart" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-condition" }
];

export function Footer() {
  return (
    <FooterWrapper>
      <Container>
        <Box className="footer_grid">
          <Stack spacing={{lg:2.5, xs:1.25}} className="firstClm">
            <Typography variant="h5" className="brand_title">
              NutriHarvest
            </Typography>
            <Typography variant="body2" className="brand_desc">
              Elevating agricultural heritage into premium wellness experiences. Our mission is to provide the
              world with the finest, most sustainable organic dry fruits.
            </Typography>
            <Stack direction="row" spacing={1}>
              <Link href={'#url'} className="social_icon">
                <FacebookIcon />
              </Link>
              <Link href={'#url'}  className="social_icon">
                <InstagramIcon />
              </Link>
              <Link href={'#url'}  className="social_icon">
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
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <CommonInput
                fullWidth
                placeholder="Email Address"
              />
              <Button variant="contained" color="primary" className="subscribe_btn">Join</Button>
            </Stack>
          </Stack>
        </Box>

        <Divider className="footer_divider" />

        <Box className="footer_bottom">
          <Typography variant="caption" className="copyright_text">
            © 2026 <Link href={'/'}>NutriHarvest</Link>. Curated Excellence in Agriculture.
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
