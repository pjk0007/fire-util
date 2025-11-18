import FirePostCreate from '@/components/FirePost/FirePostCreate';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { USER_ID_FIELD } from '@/lib/FireAuth/settings';
import { useRouter } from 'next/router';

export default function NewPost() {
    const { user } = useFireAuth();
    const router = useRouter();

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>로그인이 필요합니다.</p>
            </div>
        );
    }

    return (
        <FirePostCreate
            user={user}
            goBackLink="/posts"
            onCreated={(postId) => router.push(`/posts/${postId}`)}
        />
    );
}
