import { db } from '@/lib/firebase';
import { POST_COLLECTION } from '@/lib/FirePost/settings';
import { deleteDoc, doc } from 'firebase/firestore';

export default async function deletePost(postId: string) {
    await deleteDoc(doc(db, POST_COLLECTION, postId));
}
