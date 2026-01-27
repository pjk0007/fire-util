import { db } from '@/lib/firebase';
import {
    FireMessage,
    FireMessageContent,
    MESSAGE_COLLECTION,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_UNIT,
} from '@/components/FireChat/settings';
import { CHANNEL_COLLECTION } from '@/components/FireChannel/settings';
import {
    collection,
    endBefore,
    getDocs,
    limitToLast,
    orderBy,
    query,
} from 'firebase/firestore';

export default async function getMessages<
    M extends FireMessage<T>,
    T extends FireMessageContent
>(channelId: string, lastMessage: M | null): Promise<M[]> {
    const q = lastMessage
        ? query(
              collection(db, CHANNEL_COLLECTION, channelId, MESSAGE_COLLECTION),
              orderBy(MESSAGE_CREATED_AT_FIELD, 'asc'),
              endBefore(lastMessage[MESSAGE_CREATED_AT_FIELD]),
              limitToLast(MESSAGE_UNIT)
          )
        : query(
              collection(db, CHANNEL_COLLECTION, channelId, MESSAGE_COLLECTION),
              orderBy(MESSAGE_CREATED_AT_FIELD, 'asc'),
              limitToLast(MESSAGE_UNIT)
          );

    const querySnapshot = await getDocs(q);
    const messages: M[] = [];
    querySnapshot.forEach((doc) => {
        messages.push(doc.data() as M);
    });
    return messages;
}
