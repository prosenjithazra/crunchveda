"use client";

import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { muiTheme } from "@/mui-theme/_muiTheme";

export function ThemeProvider({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <StyledThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </StyledThemeProvider>
    </MuiThemeProvider>
  );
}
