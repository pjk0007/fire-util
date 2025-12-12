import getDatabaseViews from '@/components/FireDatabase/api/getDatabaseViews';
import { useQuery } from '@tanstack/react-query';

export default function useDatabaseViews(databaseId: string) {
    const {
        data: views = [],
        refetch,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['databaseViews', databaseId],
        queryFn: () => getDatabaseViews(databaseId),
        enabled: !!databaseId,
        // Prevent automatic refetch on window focus or reconnect
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return { views, refetch, isLoading, error };
}
