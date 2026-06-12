"use client";

import type { AdminStatus } from "@/json/mock/admin";
import { Chip } from "@mui/material";

const statusColor = {
  Published: "success",
  Draft: "warning",
  Archived: "default",
} as const;

export default function AdminStatusChip({ status }: { status: AdminStatus }) {
  return <Chip label={status} color={statusColor[status]} size="small" variant="outlined" />;
}
