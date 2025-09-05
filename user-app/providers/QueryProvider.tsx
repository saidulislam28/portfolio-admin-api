// providers/QueryProvider.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global defaults for all queries
      staleTime: 5 * 60 * 1000, // 5 minutes default stale time
      gcTime: 10 * 60 * 1000, // 10 minutes cache time
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export { queryClient };

// hooks/useAppSettings.ts - Reusable hook for app settings



// Alternative hook with prefetch capability (optional)
// hooks/useAppSettingsWithPrefetch.ts


// Usage in other components:
// const { data: appSettingsData, isLoading, error } = useAppSettings();
// const studyAbroadContent = appSettingsData?.data?.study_abroad;