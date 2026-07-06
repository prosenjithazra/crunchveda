'use client';

import EventListeners from '@/components/EventListener/EventListener';
import AppThemeProvider from '@/mui-theme/AppThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';
import { Toaster } from 'react-hot-toast';
import { useInitializeAuth } from '@/hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 0,
    },
  },
});

function AuthInitializer() {
  useInitializeAuth();
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      <AppThemeProvider>
        <Toaster
          position='top-center'
          reverseOrder={false}
          gutter={8}
          containerClassName=''
          containerStyle={{}}
          toastOptions={{
            duration: 2000,
          }}
        />
        <EventListeners />
        {children}
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
