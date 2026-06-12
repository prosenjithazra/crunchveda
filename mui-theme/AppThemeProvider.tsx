'use client';

import { GlobalStyles } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { MuiThemeOptions } from './_muiTheme';
import GlobalStyling from './globalStyles';

// Mui theme set up provider for app directory

interface AppThemeProviderProps {
  children: React.ReactNode;
}

const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  const theme = createTheme(MuiThemeOptions('light'));

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles styles={() => GlobalStyling()} />
          {children}
        </StyledThemeProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default AppThemeProvider;
