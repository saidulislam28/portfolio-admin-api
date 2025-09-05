import React from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, asyncStoragePersister } from '@/lib/queryClient';
import { QUERY_KEYS } from '@/constants/queryKey';

interface QueryProviderProps {
  children: React.ReactNode;
}

const persistableQueryKeys = [
  QUERY_KEYS.departments,
  QUERY_KEYS.hospitals.topRated,
];

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        dehydrateOptions: {
          shouldDehydrateQuery: query => {
            // Only persist certain queries
            const queryKey = query.queryKey[0] as string;
            return persistableQueryKeys.includes(queryKey);
          },
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
