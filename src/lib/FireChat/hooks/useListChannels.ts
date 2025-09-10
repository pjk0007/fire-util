import { db } from '@/lib/firebase';
import getUser from '@/lib/FireChat/api/getUser';
import {
    FcChannel,
    CHANNEL_COLLECTION,
    CHANNEL_PARTICIPANTS_FIELD,
    FcUser,
    FcChannelParticipants,
    FcMessage,
    FcMessageContent,
    USER_COLLECTION,
} from '@/lib/FireChat/settings';
import { and, collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function useListChannels<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({
    userId,
    channelCollection = CHANNEL_COLLECTION,
    userCollection = USER_COLLECTION,
}: {
    userId?: string;
    channelCollection?: string;
    userCollection?: string;
}) {
    const [channels, setChannels] = useState<
        FcChannelParticipants<C, U, M, T>[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setChannels([]);
            setLoading(false);
            return;
        }

        let q = query(
            collection(db, channelCollection),
            and(where(CHANNEL_PARTICIPANTS_FIELD, 'array-contains', userId))
        );
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const channelsData: FcChannelParticipants<C, U, M, T>[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data() as C;
                channelsData.push({ channel: data, participants: [] });
            });

            const channels = await Promise.all(
                channelsData.map(async (channel) => {
                    const participants = await Promise.all(
                        channel.channel[CHANNEL_PARTICIPANTS_FIELD].map(
                            async (id) => {
                                return await getUser<U>({
                                    id,
                                    userCollection,
                                });
                            }
                        )
                    );

                    return { ...channel, participants };
                })
            );

            setChannels(channels);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    return { channels, setChannels, loading };
}
