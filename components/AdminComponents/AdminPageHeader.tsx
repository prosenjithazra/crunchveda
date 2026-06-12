"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
  children?: ReactNode;
};

export default function AdminPageHeader({
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  children,
}: AdminPageHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{ mb: 3, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" } }}
    >
      <Box>
        <Typography variant="h2" sx={{ fontSize: { xs: 26, md: 34 }, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
          {description}
        </Typography>
      </Box>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        {children}
        {actionLabel && onAction && (
          <Button
            variant="contained"
            color="primary"
            startIcon={actionIcon}
            onClick={onAction}
            sx={{ whiteSpace: "nowrap" }}
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
