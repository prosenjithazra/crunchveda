// ** Type Imports
import { Palette } from '@mui/material';

export const palette = (mode: Palette['mode']): Palette => {
  // ** Vars
  const whiteColor = '#FFF';
  const lightColor = '#5F5E59'; // Hex equivalent of '47, 43, 61'
  const darkColor = '#1C1C18'; // Hex equivalent of '208, 212, 241'
  const darkPaperBgColor = '#2F3349';
  const mainColor = mode === 'light' ? darkColor : darkColor;
  const defaultBgColor = whiteColor;

  // Convert RGBA to Hex with opacity
  const hexWithOpacity = (hex: string, opacity: number) => {
    const alpha = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0');

    return `${hex}${alpha}`;
  };

  return {
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      lightPaperBg: whiteColor,
      darkPaperBg: darkPaperBgColor,
      bodyBg: mode === 'light' ? '#FFFFFF' : '#25293C', // Same as palette.background.default but doesn't consider bordered skin
      trackBg: mode === 'light' ? '#F1F0F2' : '#363B54',
      avatarBg: mode === 'light' ? '#DBDADE' : '#4A5072',
      tableHeaderBg: mode === 'light' ? '#F6F6F7' : '#4A5072',
      placeText: '#92918B',
      headerBg:'#FCF9F2',
      footerBg:'#F0EEE7',
      textColor:'#434843',
      lightGreen:'#D0E9D4',
      lightYellow: '#FFF2D5',
      lightOrange: '#FFE8E1',
      orangeText: '#E05F3F',
      lightGray: '#E8ECE9',
      lightCream:'#FCF9F2',
      lightGrey:'#F0EEE7',
      greyLightBg:'#F6F3EC'
    },
    mode: mode,
    common: {
      black: '#000',
      white: whiteColor,
    },
    primary: {
      light: '#4D6453',
      main: '#203527',
      dark: '#0B2013',
      contrastText: whiteColor,
    },
    secondary: {
      light: '#B88900',
      main: '#4B2E1E',
      dark: '#5C4300',
      contrastText: whiteColor,
    },
    error: {
      light: '#ED6F70',
      main: '#EA5455',
      dark: '#CE4A4B',
      contrastText: whiteColor,
    },
    warning: {
      light: '#FFC641',
      main: '#FF9F43',
      dark: '#E08C3B',
      contrastText: whiteColor,
    },
    info: {
      light: '#1FD5EB',
      main: '#00CFE8',
      dark: '#00B6CC',
      contrastText: whiteColor,
    },
    success: {
      light: '#42CE80',
      main: '#28C76F',
      dark: '#23AF62',
      contrastText: whiteColor,
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#F5F5F5',
      A200: '#EEEEEE',
      A400: '#BDBDBD',
      A700: '#616161',
    },
    text: {
      primary: mainColor,
      secondary: lightColor,
      disabled: hexWithOpacity(mainColor, 0.42),
    },
    divider: hexWithOpacity(mainColor, 0.16),
    background: {
      paper: mode === 'light' ? whiteColor : darkPaperBgColor,
      default: defaultBgColor,
    },
    action: {
      active: hexWithOpacity(mainColor, 0.54),
      hover: hexWithOpacity(mainColor, 0.04),
      selected: hexWithOpacity(mainColor, 0.06),
      selectedOpacity: 0.06,
      disabled: hexWithOpacity(mainColor, 0.26),
      disabledBackground: hexWithOpacity(mainColor, 0.12),
      focus: hexWithOpacity(mainColor, 0.12),
    },
  } as Palette;
};
