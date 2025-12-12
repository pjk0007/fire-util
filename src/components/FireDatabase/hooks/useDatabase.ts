import getDatabase from '@/components/FireDatabase/api/getDatabase';
import { useQuery } from '@tanstack/react-query';

export default function useDatabase(databaseId: string) {
    const {
        data: database,
        refetch,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['database', databaseId],
        queryFn: () => getDatabase(databaseId),
        enabled: !!databaseId,
        // Prevent automatic refetch - only refetch when explicitly called
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    return { database, refetch, isLoading, error };
}
