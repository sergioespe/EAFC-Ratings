import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24h en caché
      staleTime: 1000 * 60 * 5,    // 5 min para refrescar
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

export const persisterClient = () => {
  persistQueryClient({ queryClient, persister });
};