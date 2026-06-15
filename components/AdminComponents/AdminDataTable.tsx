"use client";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

export type AdminTableColumn<T> = {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  width?: number | string;
};

export type AdminTableAction<T> = {
  label: string;
  icon: ReactNode;
  onClick: (row: T) => void;
  color?: string;
};

type ExtraAction<T> = {
  label: string;
  icon: ReactNode;
  onClick: (row: T) => void;
  color?: string;
};

type AdminDataTableProps<T> = {
  columns: AdminTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  loading?: boolean;
  emptyTitle: string;
  emptyDescription: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  extraActions?: ExtraAction<T>[];
};

export default function AdminDataTable<T>({
  columns,
  rows,
  getRowKey,
  loading,
  emptyTitle,
  emptyDescription,
  onEdit,
  onDelete,
  extraActions,
}: AdminDataTableProps<T>) {
  if (loading) {
    return (
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        {[0, 1, 2, 3].map(index => (
          <Skeleton key={index} height={52} sx={{ borderRadius: 1 }} />
        ))}
      </Paper>
    );
  }

  if (!rows.length) {
    return (
      <Paper
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h4" sx={{ mb: 1 }}>
          {emptyTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {emptyDescription}
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
      <Table sx={{ minWidth: 760 }}>
        <TableHead sx={{ bgcolor: "customColors.tableHeaderBg" }}>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.key} sx={{ width: column.width, fontWeight: 700 }}>
                {column.label}
              </TableCell>
            ))}
            {(onEdit || onDelete || extraActions) && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={getRowKey(row)} hover>
              {columns.map(column => (
                <TableCell key={column.key}>{column.render(row)}</TableCell>
              ))}
              {(onEdit || onDelete || extraActions) && (
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end" }}>
                    {extraActions?.map(action => (
                      <Tooltip key={action.label} title={action.label}>
                        <IconButton
                          aria-label={action.label}
                          sx={{ color: action.color }}
                          onClick={() => action.onClick(row)}
                          size="small"
                        >
                          {action.icon}
                        </IconButton>
                      </Tooltip>
                    ))}
                    {onEdit && (
                      <Tooltip title="Edit">
                        <IconButton aria-label="Edit" onClick={() => onEdit(row)} size="small">
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onDelete && (
                      <Tooltip title="Delete">
                        <IconButton aria-label="Delete" color="error" onClick={() => onDelete(row)} size="small">
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: "divider" }}>
        <Typography variant="caption" color="text.secondary">
          Showing {rows.length} record{rows.length === 1 ? "" : "s"}
        </Typography>
      </Box>
    </TableContainer>
  );
}
