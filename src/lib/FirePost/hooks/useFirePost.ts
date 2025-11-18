import getPost from '@/lib/FirePost/apis/getPost';
import { useQuery } from '@tanstack/react-query';

export default function useFirePost<U>(id: string) {
    const { data: post, isLoading, refetch } = useQuery({
        queryKey: ['fire-posts', id],
        queryFn: () => getPost<U>(id),
    });

    return { post, isLoading, refetch };
}
