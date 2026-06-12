"use client";

import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";

type AdminBreadcrumbProps = {
  items: {
    label: string;
    href?: string;
  }[];
};

export default function AdminBreadcrumb({ items }: AdminBreadcrumbProps) {
  return (
    <Breadcrumbs separator={<NavigateNextRoundedIcon fontSize="small" />} sx={{ mb: 2 }}>
      <MuiLink component={Link} href="/admin" underline="hover" color="text.secondary">
        Admin
      </MuiLink>
      {items.map(item =>
        item.href ? (
          <MuiLink key={item.label} component={Link} href={item.href} underline="hover" color="text.secondary">
            {item.label}
          </MuiLink>
        ) : (
          <Typography key={item.label} color="text.primary" sx={{ fontWeight: 700 }}>
            {item.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
}
