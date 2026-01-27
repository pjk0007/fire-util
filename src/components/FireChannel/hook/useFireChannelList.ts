import { db } from '@/lib/firebase';
import {
    FireMessage,
    FireMessageContent,
    MESSAGE_CREATED_AT_FIELD,
} from '@/components/FireChat/settings';
import {
    CHANNEL_COLLECTION,
    CHANNEL_LAST_MESSAGE_FIELD,
    CHANNEL_PARTICIPANTS_FIELD,
    FireChannel,
} from '../settings';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function useFireChannelList<
    C extends FireChannel<M, T>,
    M extends FireMessage<T>,
    T extends FireMessageContent
>({
    userId,
    filterByParticipant = false,
}: {
    userId?: string;
    filterByParticipant?: boolean;
}) {
    const [channels, setChannels] = useState<C[]>([]);

    useEffect(() => {
        if (!userId) {
            setChannels([]);
            return;
        }

        const baseQuery = filterByParticipant
            ? query(
                  collection(db, CHANNEL_COLLECTION),
                  where(CHANNEL_PARTICIPANTS_FIELD, 'array-contains', userId)
              )
            : query(collection(db, CHANNEL_COLLECTION));

        const unsubscribe = onSnapshot(baseQuery, (querySnapshot) => {
            const chs: C[] = [];
            querySnapshot.forEach((doc) => {
                const ch = doc.data() as C;
                chs.push(ch);
            });

            setChannels(
                chs.sort((a, b) => {
                    const aTime =
                        a[CHANNEL_LAST_MESSAGE_FIELD]?.[
                            MESSAGE_CREATED_AT_FIELD
                        ]?.toMillis() || 0;
                    const bTime =
                        b[CHANNEL_LAST_MESSAGE_FIELD]?.[
                            MESSAGE_CREATED_AT_FIELD
                        ]?.toMillis() || 0;
                    return bTime - aTime;
                })
            );
        });

        return () => {
            unsubscribe();
        };
    }, [userId, filterByParticipant]);

    return { channels };
}
