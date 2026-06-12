import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import type { ElementType } from "react";
import { Button, type ButtonProps } from "@mui/material";
import type { ButtonVariant } from "@/mui-theme/types";

type AppButtonProps = ButtonProps & {
  appVariant?: ButtonVariant;
  component?: ElementType;
  href?: string;
  showArrow?: boolean;
};

const variantStyles = {
  primary: {
    bgcolor: "primary.main",
    color: "primary.contrastText",
    "&:hover": { bgcolor: "primary.dark" }
  },
  secondary: {
    bgcolor: "secondary.main",
    color: "secondary.contrastText",
    "&:hover": { bgcolor: "secondary.dark", color: "primary.contrastText" }
  },
  ghost: {
    bgcolor: "transparent",
    color: "primary.main",
    borderColor: "divider",
    "&:hover": { bgcolor: "primary.light", borderColor: "primary.light" }
  }
} as const;

export function AppButton({
  appVariant = "primary",
  showArrow,
  children,
  sx,
  ...props
}: AppButtonProps) {
  return (
    <Button
      variant={appVariant === "ghost" ? "outlined" : "contained"}
      endIcon={showArrow ? <ArrowForwardRoundedIcon /> : props.endIcon}
      sx={[variantStyles[appVariant], ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      {...props}
    >
      {children}
    </Button>
  );
}
