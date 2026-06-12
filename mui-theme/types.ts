declare module '@mui/material/styles' {
  interface Palette {
    customColors: {
      dark: string;
      main: string;
      light: string;
      bodyBg: string;
      trackBg: string;
      avatarBg: string;
      darkPaperBg: string;
      lightPaperBg: string;
      tableHeaderBg: string;
      placeText: string;
      headerBg?:string;
      footerBg?:string;
      textColor?:string;
      lightGreen?:string;
      lightYellow?:string;
      lightOrange?:string;
      orangeText?:string;
      lightGray?:string;
      lightCream?:string;
      lightGrey?:string;
      greyLightBg?:string;
    };
  }
}

declare module '@mui/material/ButtonGroup' {
  interface ButtonGroupPropsVariantOverrides {
    tonal: true;
  }
}

export type ButtonVariant = "primary" | "secondary" | "ghost";

export {};
