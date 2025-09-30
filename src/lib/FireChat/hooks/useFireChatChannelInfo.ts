import { useAuth } from '@/components/provider/AuthProvider';
import { db } from '@/lib/firebase';
import {
    CHANNEL_COLLECTION,
    CHANNEL_ID_FIELD,
    CHANNEL_LAST_SEEN_FIELD,
    CHANNEL_PARTICIPANTS_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
    MESSAGE_COLLECTION,
    MESSAGE_CREATED_AT_FIELD,
} from '@/lib/FireChat/settings';
import { FcUser } from '@/lib/FireAuth/settings';
import {
    USER_COLLECTION,
    USER_ID_FIELD
} from '@/lib/FireAuth/settings';
import {
    and,
    collection,
    doc,
    getDocs,
    limit,
    onSnapshot,
    query,
    Timestamp,
    where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function useFireChatChannelInfo<
    C extends FcChannel<M, T>,
    M extends FcMessage<T>,
    T extends FcMessageContent,
    U extends FcUser
>({
    channelId,
    channelCollection = CHANNEL_COLLECTION,
    userCollection = USER_COLLECTION,
}: {
    channelId?: string;
    channelCollection?: string;
    userCollection?: string;
}) {
    const { user } = useAuth();
    const userId = user?.[USER_ID_FIELD];
    const [channel, setChannel] = useState<C | undefined>(undefined);
    const [participants, setParticipants] = useState<U[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!channelId) {
            setChannel(undefined);
            setParticipants([]);
            setUnreadCount(0);
            return;
        }

        const channelDoc = doc(db, channelCollection, channelId);

        const unsubscribe = onSnapshot(channelDoc, async (doc) => {
            const channel = doc.data() as C | undefined;
            setChannel(channel);

            if (channel) {
                // Calculate unread count
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

                // Fetch participants if not already fetched or if there's a mismatch
                const parti = channel[CHANNEL_PARTICIPANTS_FIELD];
                if (
                    parti.length !== participants.length ||
                    !parti.every((id) =>
                        participants.some(
                            (participant) => participant[USER_ID_FIELD] === id
                        )
                    )
                ) {
                    const q = query(
                        collection(db, userCollection),
                        and(where(USER_ID_FIELD, 'in', parti))
                    );
                    const querySnapshot = await getDocs(q);
                    const usersData: U[] = [];
                    querySnapshot.forEach((doc) => {
                        const userData = doc.data() as U;
                        usersData.push(userData);
                    });
                    setParticipants(usersData);
                }
            }
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channelId]);

    return { channel, participants, unreadCount };
}
