import { db } from '@/lib/firebase';
import {
    FireMessage,
    FireMessageContent,
    MESSAGE_COLLECTION,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_FILE,
} from '@/lib/FireChat/settings';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import {
    collection,
    getDocs,
    limitToLast,
    orderBy,
    query,
    QueryConstraint,
    where,
} from 'firebase/firestore';

export default async function getFileMessages<
    M extends FireMessage<T>,
    T extends FireMessageContent
>(channelId: string, limit?: number): Promise<M[]> {
    const constraints: QueryConstraint[] = [
        where(MESSAGE_TYPE_FIELD, '==', MESSAGE_TYPE_FILE),
        orderBy(MESSAGE_CREATED_AT_FIELD, 'asc'),
    ];

    if (limit) {
        constraints.push(limitToLast(limit));
    }

    const q = query(
        collection(db, CHANNEL_COLLECTION, channelId, MESSAGE_COLLECTION),
        ...constraints
    );

    const querySnapshot = await getDocs(q);
    const messages: M[] = [];
    querySnapshot.forEach((doc) => {
        messages.push(doc.data() as M);
    });
    return messages;
}
