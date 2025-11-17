import { db } from '@/lib/firebase';
import { FirePost, POST_COLLECTION } from '@/lib/FirePost/settings';
import { doc, getDoc } from 'firebase/firestore';

export default async function getPost<U>(id: string) {
    const postSnapshot = await getDoc(doc(db, POST_COLLECTION, id));
    const post = postSnapshot.data() as FirePost<U>;
    return post;
}
