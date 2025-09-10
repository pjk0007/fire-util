import { db } from '@/lib/firebase';
import { FcUser, USER_COLLECTION } from '@/lib/FireChat/settings';
import { doc, getDoc } from 'firebase/firestore';

export default async function getUser<T extends FcUser>({
    id,
    userCollection = USER_COLLECTION,
}: {
    id: string;
    userCollection?: string;
}) {
    const user = await getDoc(doc(db, userCollection, id));
    return user.data() as T;
}
