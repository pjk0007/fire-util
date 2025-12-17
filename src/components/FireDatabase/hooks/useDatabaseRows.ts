import getDatabaseRows from '@/components/FireDatabase/api/getDatabaseRows';
import { useQuery } from '@tanstack/react-query';

export default function useDatabaseRows(databaseId: string) {
    const {
        data: rows = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['databaseRows', databaseId],
        queryFn: () => getDatabaseRows(databaseId),
        enabled: !!databaseId,
        gcTime: 0, // Don't cache data (previously cacheTime)
        staleTime: 0, // Always consider data stale
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return { rows, isLoading, error, refetch };
}
