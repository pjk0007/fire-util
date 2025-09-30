import { db } from '@/lib/firebase';
import {
    FcMessage,
    FcMessageContent,
} from '@/lib/FireChat/settings';
import { FcChannel } from '../settings';
import {
    CHANNEL_COLLECTION,
    CHANNEL_PARTICIPANTS_FIELD
} from '../settings';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function useFireChannelList<
    C extends FcChannel<M, T>,
    M extends FcMessage<T>,
    T extends FcMessageContent
>(userId?: string) {
    const [channels, setChannels] = useState<C[]>([]);

    useEffect(() => {
        if (!userId) {
            setChannels([]);
            return;
        }

        const unsubscribe = onSnapshot(
            query(
                collection(db, CHANNEL_COLLECTION),
                where(CHANNEL_PARTICIPANTS_FIELD, 'array-contains', userId)
            ),
            (querySnapshot) => {
                const chs: C[] = [];
                querySnapshot.forEach((doc) => {
                    const ch = doc.data() as C;
                    chs.push(ch);
                });
                setChannels(chs);
            }
        );

        return () => {
            unsubscribe();
        };
    }, [userId]);

    return { channels };
}
