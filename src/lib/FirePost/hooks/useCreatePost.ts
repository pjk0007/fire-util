import { FireUser } from '@/lib/FireAuth/settings';
import createPost from '@/lib/FirePost/apis/createPost';
import {
    FIRE_POST_LOCALE,
    POST_SHOW_TYPE_ALL,
    POST_TYPE_NOTICE,
    PostShowType,
    PostType,
} from '@/lib/FirePost/settings';
import { Content } from '@tiptap/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function useCreatePost<U>(
    user: U,
    onCreated?: (postId: string) => void
) {
    const id = `post_${new Date().getTime()}`;
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<Content>('');
    const [type, setType] = useState<PostType>(POST_TYPE_NOTICE);
    const [showType, setShowType] = useState<PostShowType>(POST_SHOW_TYPE_ALL);
    const [isPinned, setIsPinned] = useState<boolean>(false);
    const [isSecret, setIsSecret] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    async function onSubmit() {
        if (!title.trim()) {
            toast.error(FIRE_POST_LOCALE.NEED_TITLE);
            return;
        }

        setIsSubmitting(true);
        try {
            await createPost(
                user,
                id,
                title,
                content,
                type,
                showType,
                isPinned,
                isSecret
            );
            toast.success(FIRE_POST_LOCALE.SAVE_SUCCESS);
            onCreated?.(id);
        } catch (error) {
            toast.error(FIRE_POST_LOCALE.SAVE_FAILED);
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        id,
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
        isSubmitting,
        onSubmit,
    };
}
