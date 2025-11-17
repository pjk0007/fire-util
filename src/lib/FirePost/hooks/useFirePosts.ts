import getPosts from '@/lib/FirePost/apis/getPosts';
import {
    POST_TYPE_FIELD,
    PostShowType,
} from '@/lib/FirePost/settings';
import { useQuery } from '@tanstack/react-query';

export default function useFirePosts<U>(postShowTypes: PostShowType[]) {
    const { data: posts = [], isLoading } = useQuery({
        queryKey: ['fire-posts', postShowTypes],
        queryFn: () => getPosts<U>(postShowTypes),
    });

    const notices = posts.filter((post) => post[POST_TYPE_FIELD] === 'notice');
    const faqs = posts.filter((post) => post[POST_TYPE_FIELD] === 'faq');

    return { posts, notices, faqs, isLoading };
}
