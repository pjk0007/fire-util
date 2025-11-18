import { db } from '@/lib/firebase';
import {
    POST_COLLECTION,
    POST_CONTENT_FIELD,
    POST_CREATED_AT_FIELD,
    POST_ID_FIELD,
    POST_IS_PINNED_FIELD,
    POST_IS_SECRET_FIELD,
    POST_SHOW_TYPE_ALL,
    POST_SHOW_TYPE_FIELD,
    POST_TITLE_FIELD,
    POST_TYPE_FIELD,
    POST_TYPE_NOTICE,
    POST_UPDATED_AT_FIELD,
    POST_USER_FIELD,
    POST_VIEWS_FIELD,
    PostShowType,
    PostType,
} from '@/lib/FirePost/settings';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Content } from '@tiptap/react';

export default async function createPost<U>(
    userId: U,
    id: string,
    title: string,
    content: Content = '',
    type: PostType = POST_TYPE_NOTICE,
    showType: PostShowType = POST_SHOW_TYPE_ALL,
    isPinned: boolean = false,
    isSecret: boolean = false
) {
    const newPost = {
        [POST_ID_FIELD]: id,
        [POST_TITLE_FIELD]: title,
        [POST_CONTENT_FIELD]: content,
        [POST_TYPE_FIELD]: type,
        [POST_SHOW_TYPE_FIELD]: showType,
        [POST_USER_FIELD]: userId,
        [POST_VIEWS_FIELD]: 0,
        [POST_IS_PINNED_FIELD]: isPinned,
        [POST_IS_SECRET_FIELD]: isSecret,
        [POST_CREATED_AT_FIELD]: serverTimestamp(),
        [POST_UPDATED_AT_FIELD]: serverTimestamp(),
    };

    await setDoc(doc(db, POST_COLLECTION, id), newPost);
    return id;
}
