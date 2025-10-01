import { db } from '@/lib/firebase';
import { FireUser } from '@/lib/FireAuth/settings';
import { USER_COLLECTION } from '@/lib/FireAuth/settings';
import { doc, getDoc } from 'firebase/firestore';

export default async function getUser<U extends FireUser>({
    id,
    userCollection = USER_COLLECTION,
}: {
    id: string;
    userCollection?: string;
}) {
    const user = await getDoc(doc(db, userCollection, id));
    return user.data() as U;
}
