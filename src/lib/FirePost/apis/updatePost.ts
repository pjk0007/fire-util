import { db } from '@/lib/firebase';
import {
    FirePost,
    POST_COLLECTION,
    POST_CONTENT_FIELD,
    POST_IS_PINNED_FIELD,
    POST_IS_SECRET_FIELD,
    POST_SHOW_TYPE_FIELD,
    POST_TYPE_FIELD,
    PostShowType,
    PostType,
} from '@/lib/FirePost/settings';
import { doc, updateDoc } from 'firebase/firestore';
import { Content } from '@tiptap/react';

export default async function updatePost<U>(
    postId: string,
    title: string,
    content?: Content,
    type?: PostType,
    showType?: PostShowType,
    isPinned?: boolean,
    isSecret?: boolean
) {
    const newPost: Partial<FirePost<U>> = {
        title: title,
    };
    if (content !== undefined) {
        newPost[POST_CONTENT_FIELD] = content;
    }
    if (type !== undefined) {
        newPost[POST_TYPE_FIELD] = type;
    }
    if (showType !== undefined) {
        newPost[POST_SHOW_TYPE_FIELD] = showType;
    }
    if (isPinned !== undefined) {
        newPost[POST_IS_PINNED_FIELD] = isPinned;
    }
    if (isSecret !== undefined) {
        newPost[POST_IS_SECRET_FIELD] = isSecret;
    }
    await updateDoc(doc(db, POST_COLLECTION, postId), newPost);
}
