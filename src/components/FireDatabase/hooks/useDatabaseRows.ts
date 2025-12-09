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
    });

    return { rows, isLoading, error, refetch };
}
