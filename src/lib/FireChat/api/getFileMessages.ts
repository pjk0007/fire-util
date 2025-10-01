import { db } from '@/lib/firebase';
import {
    FireMessage,
    FireMessageContent,
    FILE_UNIT,
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
    where,
} from 'firebase/firestore';

export default async function getFileMessages<
    M extends FireMessage<T>,
    T extends FireMessageContent
>(channelId: string): Promise<M[]> {
    const q = query(
        collection(db, CHANNEL_COLLECTION, channelId, MESSAGE_COLLECTION),
        where(MESSAGE_TYPE_FIELD, '==', MESSAGE_TYPE_FILE),
        orderBy(MESSAGE_CREATED_AT_FIELD, 'asc'),
        limitToLast(FILE_UNIT)
    );

    const querySnapshot = await getDocs(q);
    const messages: M[] = [];
    querySnapshot.forEach((doc) => {
        messages.push(doc.data() as M);
    });
    return messages;
}
