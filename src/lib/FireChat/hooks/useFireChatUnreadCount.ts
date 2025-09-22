import { db } from '@/lib/firebase';
import {
    CHANNEL_COLLECTION,
    CHANNEL_ID_FIELD,
    CHANNEL_LAST_SEEN_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
    MESSAGE_COLLECTION,
    MESSAGE_CREATED_AT_FIELD,
} from '@/lib/FireChat/settings';
import {
    collection,
    getDocs,
    limit,
    query,
    Timestamp,
    where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function useFireChatUnreadCount<
    C extends FcChannel<M, T>,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ channel, userId }: { channel?: C; userId?: string }) {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!channel || !userId) {
            setUnreadCount(0);
            return;
        }
        const lastSeen = userId
            ? channel[CHANNEL_LAST_SEEN_FIELD]?.[userId] ??
              Timestamp.fromMillis(0)
            : Timestamp.fromMillis(0);

        const queryUnreadCount = query(
            collection(
                db,
                CHANNEL_COLLECTION,
                channel[CHANNEL_ID_FIELD],
                MESSAGE_COLLECTION
            ),
            where(MESSAGE_CREATED_AT_FIELD, '>', lastSeen),
            limit(100)
        );

        getDocs(queryUnreadCount).then((querySnapshot) => {
            setUnreadCount(querySnapshot.size);
        });
    }, [channel, userId]);

    return unreadCount;
}
