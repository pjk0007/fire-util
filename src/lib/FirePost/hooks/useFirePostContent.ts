import { FireUser } from '@/lib/FireAuth/settings';
import deletePost from '@/lib/FirePost/apis/deletePost';
import incrementViewCount from '@/lib/FirePost/apis/incrementViewCount';
import updatePost from '@/lib/FirePost/apis/updatePost';
import useFirePost from '@/lib/FirePost/hooks/useFirePost';
import {
    FIRE_POST_LOCALE,
    POST_CONTENT_FIELD,
    POST_CREATED_AT_FIELD,
    POST_IS_PINNED_FIELD,
    POST_IS_SECRET_FIELD,
    POST_SHOW_TYPE_FIELD,
    POST_TITLE_FIELD,
    POST_TYPE_FIELD,
    PostShowType,
    PostType,
} from '@/lib/FirePost/settings';
import { Content } from '@tiptap/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function useFirePostContent<U>(
    postId: string,
    onClickGoBack: () => void
) {
    const router = useRouter();
    const { post, refetch } = useFirePost<U>(postId);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<Content>();
    const [type, setType] = useState<PostType>();
    const [showType, setShowType] = useState<PostShowType>();
    const [isPinned, setIsPinned] = useState<boolean>(false);
    const [isSecret, setIsSecret] = useState<boolean>(false);

    const createdAt = post?.[POST_CREATED_AT_FIELD]?.toDate();
    const now = new Date();
    // Check if the post is new (created within the last 24 hours)
    const isNew = createdAt
        ? (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60) < 24
        : false;

    // Check if the content or title has changed
    const isChanged =
        (post &&
            content !== undefined &&
            post[POST_CONTENT_FIELD] !== content) ||
        (post && title !== post[POST_TITLE_FIELD]) ||
        (post && type !== post[POST_TYPE_FIELD]) ||
        (post && showType !== post[POST_SHOW_TYPE_FIELD]) ||
        (post && isPinned !== !!post[POST_IS_PINNED_FIELD]) ||
        (post && isSecret !== !!post[POST_IS_SECRET_FIELD]);

    async function onSave() {
        await updatePost(
            postId,
            title,
            content,
            type,
            showType,
            isPinned,
            isSecret
        );
        toast.success(FIRE_POST_LOCALE.SAVE_SUCCESS);
        refetch();
    }

    async function onDelete() {
        if (postId) {
            await deletePost(postId);
            toast.success(FIRE_POST_LOCALE.DELETE_SUCCESS);
            onClickGoBack();
        }
    }

    useEffect(() => {
        if (post) {
            // view count update could be handled here if needed
            void incrementViewCount(postId);
            setTitle(post[POST_TITLE_FIELD]);
            setContent(post[POST_CONTENT_FIELD] || '');
            setType(post[POST_TYPE_FIELD]);
            setShowType(post[POST_SHOW_TYPE_FIELD]);
            setIsPinned(!!post[POST_IS_PINNED_FIELD]);
            setIsSecret(!!post[POST_IS_SECRET_FIELD]);
        }
    }, [post, postId]);

    return {
        post,
        title,
        setTitle,
        content,
        setContent,
        type,
        setType,
        showType,
        setShowType,
        isPinned,
        setIsPinned,
        isSecret,
        setIsSecret,
        isNew,
        isChanged,
        onSave,
        onDelete,
    };
}
