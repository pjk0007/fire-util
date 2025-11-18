import FirePosts from '@/components/FirePost/FirePosts';
import { POST_ID_FIELD } from '@/lib/FirePost/settings';
import { useRouter } from 'next/router';

export default function Posts() {
    const router = useRouter();
    return (
        <div className="w-full h-full flex flex-col gap-6 p-4">
            <FirePosts
                postShowType={['all', 'partner', 'client']}
                onPostClick={(post) =>
                    router.push(`/posts/${post[POST_ID_FIELD]}`)
                }
                createPostLink='/posts/new'
            />
        </div>
    );
}
