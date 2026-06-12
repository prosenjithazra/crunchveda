import { Chip, type ChipProps } from "@mui/material";

export function AppChip(props: ChipProps) {
  return (
    <Chip
      size="small"
      sx={{
        bgcolor: "secondary.light",
        color: "secondary.dark",
        fontWeight: 700,
        borderRadius: 1
      }}
      {...props}
    />
  );
}
