import { db } from '@/lib/firebase';
import {
    FirePost,
    POST_COLLECTION,
    POST_SHOW_TYPE_FIELD,
    PostShowType,
} from '@/lib/FirePost/settings';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default async function getPosts<U>(postShowTypes: PostShowType[]) {
    const postsSnapshot = await getDocs(
        query(
            collection(db, POST_COLLECTION),
            where(POST_SHOW_TYPE_FIELD, 'in', postShowTypes)
        )
    );
    const posts = postsSnapshot.docs.map((doc) => doc.data() as FirePost<U>);
    return posts;
}
