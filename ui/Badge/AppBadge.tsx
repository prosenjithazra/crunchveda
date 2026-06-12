import { Box, type BoxProps } from "@mui/material";

export function AppBadge(props: BoxProps) {
  return (
    <Box
      component="span"
      sx={{
        alignItems: "center",
        bgcolor: "success.light",
        borderRadius: "999px",
        color: "success.dark",
        display: "inline-flex",
        fontSize: 12,
        fontWeight: 800,
        lineHeight: 1,
        px: 1.25,
        py: 0.75
      }}
      {...props}
    />
  );
}
