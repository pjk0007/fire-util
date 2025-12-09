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
    });

    return { database, refetch, isLoading, error };
}
