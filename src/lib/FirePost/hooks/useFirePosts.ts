import { FireUser } from '@/lib/FireAuth/settings';
import getPosts from '@/lib/FirePost/apis/getPosts';
import { FirePost, PostShowType, PostType } from '@/lib/FirePost/settings';
import { useEffect, useState } from 'react';

export default function useFirePosts<U extends FireUser>(
    postType: PostType,
    postShowTypes: PostShowType[]
) {
    const [posts, setPosts] = useState<FirePost<U>[]>([]);

    useEffect(() => {
        getPosts<U>(postType, postShowTypes).then((fetchedPosts) => {
            setPosts(fetchedPosts);
        });
    }, [postType, postShowTypes]);

    return { posts };
}
