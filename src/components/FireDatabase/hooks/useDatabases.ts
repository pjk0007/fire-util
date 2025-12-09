import getDatabases from '@/components/FireDatabase/api/getDatabases';
import { useQuery } from '@tanstack/react-query';

export default function useDatabases() {
    const {
        data: databases = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['databases'],
        queryFn: async () => {
            const dbs = await getDatabases();
            return dbs.filter((db) => db.isDeleted !== true);
        },
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분
    });

    return { databases, isLoading, error, refetch };
}
