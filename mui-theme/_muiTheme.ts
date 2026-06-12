import { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { Outfit, Playfair_Display } from "next/font/google";
import { palette } from "./_palette";

/**
 * The function `MuiThemeOptions` returns a configuration object for the Material-UI theme based on the
 * provided mode (light or dark) and includes customizations for various components and typography.
 * @param {PaletteMode} mode - The `mode` parameter is of type `PaletteMode` and is used to determine
 * the color palette mode for the theme. The `PaletteMode` type can have two possible values: "light"
 * or "dark".
 * @returns The function `MuiThemeOptions` returns a `ThemeOptions` object.
 */

export const playFair = Playfair_Display({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-play-fair",
});
export const outFit = Outfit({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const MuiThemeOptions = (mode: PaletteMode): ThemeOptions => {
  return {
    palette: palette(mode),
    typography: {
      fontFamily: [`${outFit.style.fontFamily}`].join(","),
      fontSize: 14,
      h1: {
        fontSize: "64px",
        lineHeight: "1.2",
        fontWeight: "600",
        letterSpacing:'-1.28px',
        fontFamily: [`${playFair.style.fontFamily}`].join(","),
        "@media(max-width:1199px)": {
          fontSize: "48px",
        },

        "@media(max-width:899px)": {
          fontSize: "36px",
        },
        "@media(max-width:599px)": {
          fontSize: "32px",
        },
         "@media(max-width:479px)": {
          fontSize: "30px",
        },
      },
      h2: {
        fontSize: "48px",
        lineHeight: "1.2",
        fontWeight: "600",
        color: palette(mode).text.primary,
        fontFamily: [`${playFair.style.fontFamily}`].join(","),

        "@media(max-width:1199px)": {
          fontSize: "40px",
        },

        "@media(max-width:899px)": {
          fontSize: "32px",
        },
        "@media(max-width:599px)": {
          fontSize: "24px",
        },
      },
      h3: {
        fontSize: "18px",
        lineHeight: "1.2",
        fontWeight: "600",
        color: palette(mode).text.primary,
        fontFamily: [`${playFair.style.fontFamily}`].join(","),

        "@media(max-width:899px)": {
          fontSize: "16px",
        },
      },
      h4: {
        fontSize: "16px",
        lineHeight: "1.2",
        fontWeight: "700",
        color: palette(mode).text.primary,
      },
      h5: {
        fontSize: "24px",
        lineHeight: "1.2",
        fontWeight: "600",
      },
      h6: {
        fontSize: "12px",
        lineHeight: "1.2",
        fontWeight: "600",
      },
      body1: {
        fontSize: "16px",
        lineHeight: "1.5",
        fontWeight: 400,
        "@media(max-width: 599px)": {
          fontSize: "15px",
        },
      },
      body2: {
        fontSize: "14px",
        lineHeight: "1.5",
        color: palette(mode).text.secondary,
        fontWeight: 400,
      },
      caption: {
        fontSize: "14px",
        lineHeight: "1.5em",
      },
    },
    shadows: [
      "none",
      "0px 2px 4px 0px rgba(47, 43, 61, 0.12)",
      "0px 2px 6px 0px rgba(47, 43, 61, 0.14)",
      "0px 3px 8px 0px rgba(47, 43, 61, 0.14)",
      "0px 3px 9px 0px rgba(47, 43, 61, 0.15)",
      "0px 4px 10px 0px rgba(47, 43, 61, 0.15)",
      "0px 4px 11px 0px rgba(47, 43, 61, 0.16)",
      "0px 4px 18px 0px rgba(47, 43, 61, 0.1)",
      "0px 4px 13px 0px rgba(47, 43, 61, 0.18)",
      "0px 5px 14px 0px rgba(47, 43, 61, 0.18)",
      "0px 5px 15px 0px rgba(47, 43, 61, 0.2)",
      "0px 5px 16px 0px rgba(47, 43, 61, 0.2)",
      "0px 6px 17px 0px rgba(47, 43, 61, 0.22)",
      "0px 6px 18px 0px rgba(47, 43, 61, 0.22)",
      "0px 6px 19px 0px rgba(47, 43, 61, 0.24)",
      "0px 7px 20px 0px rgba(47, 43, 61, 0.24)",
      "0px 7px 21px 0px rgba(47, 43, 61, 0.26)",
      "0px 7px 22px 0px rgba(47, 43, 61, 0.26)",
      "0px 8px 23px 0px rgba(47, 43, 61, 0.28)",
      "0px 8px 24px 6px rgba(47, 43, 61, 0.28)",
      "0px 9px 25px 0px rgba(47, 43, 61, 0.3)",
      "0px 9px 26px 0px rgba(47, 43, 61, 0.32)",
      "0px 9px 27px 0px rgba(47, 43, 61, 0.32)",
      "0px 10px 28px 0px rgba(47, 43, 61, 0.34)",
      "0px 10px 30px 0px rgba(47, 43, 61, 0.34)",
    ],

    components: {
      MuiSkeleton: {
        defaultProps: {
          animation: "wave",
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => {
            return {
              borderRadius: "8px",
              boxShadow: `0px 4px 24px 0px ${theme.palette.background.paper}`,
            };
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: () => {
            return {
              "@media(max-width:899px)": {
                minHeight: "20px",
              },
            };
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: () => {
            return {
              overflow: "visible !important",
              filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.32))",
              marginTop: "6px",

              "@media(max-width:899px)": {
                marginTop: "0",
              },
            };
          },
          list: () => {
            return {
              paddingTop: "4px",
              paddingBottom: "4px",
            };
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: ({ ownerState, theme }) => {
            if (
              ownerState.variant === "contained" &&
              ownerState.color === "primary"
            ) {
              return {
                background: theme.palette.primary.main,
                borderRadius: "12px",
                fontWeight: 500,
                fontSize: "14px",
                padding: "14px 29px",
                lineHeight: 1.135,
                textTransform: "none",
                fontFamily:outFit.style.fontFamily,
                color:theme.palette.common.white,
                "@media(max-width: 1199px)":{
                    padding: "12px 20px",
                },

                "&:hover": {
                  background: theme.palette.secondary.dark,
                },
              };
            }

            if (
              ownerState.variant === "contained" &&
              ownerState.color === "info"
            ) {
              return {
                background: theme.palette.common.white,
                borderRadius: "15px",
                fontWeight: 500,
                fontSize: "14px",
                color: theme.palette.secondary.light,
                padding: "14px 29px",
                lineHeight: 1.1,
                textTransform: "none",

                "&:hover": {
                  background: theme.palette.primary.dark,
                },
              };
            }
          },
        },
        defaultProps: {
          disableElevation: true,
        },
      },

      MuiBackdrop: {
        styleOverrides: {
          root: {
            // backdropFilter: "blur(4px)"
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: ({ theme }) => ({
            backgroundColor: theme?.palette?.primary.main,
          }),
        },
      },
    },
  };
};

// Pre-built theme instance (light mode) for direct import
export const muiTheme = createTheme(MuiThemeOptions("light"));
