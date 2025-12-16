import FirePostContent from '@/components/FirePost/FirePostContent';
import { useRouter } from 'next/router';

export default function Post() {
    const router = useRouter();
    const { postId } = router.query;

    return (
        <FirePostContent
            postId={postId as string}
            editable={true}
            onClickGoBack={() => router.push('/posts')}
        />
    );
}
