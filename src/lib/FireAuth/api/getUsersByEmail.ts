import { db } from '@/lib/firebase';
import { FireUser } from '@/lib/FireAuth/settings';
import {
    USER_COLLECTION,
    USER_EMAIL_FIELD,
    USER_NAME_FIELD
} from '@/lib/FireAuth/settings';
import { collection, getDocs, where, query, or } from 'firebase/firestore';

export async function findUsersByNameOrEmail<U extends FireUser>(
    search: string
): Promise<U[]> {
    const users = await getDocs(
        query(
            collection(db, USER_COLLECTION),
            or(
                where(USER_EMAIL_FIELD, '==', search),
                where(USER_NAME_FIELD, '==', search)
            )
        )
    );
    return users.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as U[];
}
