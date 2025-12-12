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
        // Prevent automatic refetch on window focus or reconnect
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return { rows, isLoading, error, refetch };
}
