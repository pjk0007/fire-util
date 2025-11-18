import { db } from '@/lib/firebase';
import { POST_COLLECTION, POST_VIEWS_FIELD } from '@/lib/FirePost/settings';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default async function incrementViewCount(postId: string) {
    const postRef = doc(db, POST_COLLECTION, postId);

    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
        const currentViews = postSnap.data()[POST_VIEWS_FIELD] || 0;
        updateDoc(postRef, {
            [POST_VIEWS_FIELD]: currentViews + 1,
        });
    }
}
