import { db } from '@/lib/firebase';
import {
    FcUser,
    USER_COLLECTION,
    USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from 'firebase/firestore';

export default async function getUsersById<U extends FcUser>({
    ids,
    userCollection = USER_COLLECTION,
}: {
    ids: string[];
    userCollection?: string;
}) {
    const users: U[] = [];
    if (ids.length === 0) return users;
    
    const snapshot = await getDocs(
        query(collection(db, userCollection), where(USER_ID_FIELD, 'in', ids))
    );
    snapshot.forEach((doc) => {
        users.push(doc.data() as U);
    });
    return users;
}
