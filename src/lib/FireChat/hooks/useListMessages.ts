import { db } from '@/lib/firebase';
import getMessages from '@/lib/FireChat/api/getMessages';
import {
    CHANNEL_COLLECTION,
    FcMessage,
    FcMessageContent,
    MESSAGE_COLLECTION,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_UNIT,
} from '@/lib/FireChat/settings';
import {
    collection,
    DocumentData,
    onSnapshot,
    orderBy,
    query,
    startAfter,
    Unsubscribe,
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';

export default function useListMessages<
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ channelId }: { channelId?: string }) {
    const [messages, setMessages] = useState<M[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastVisible, setLastVisible] = useState<M | null>(null);
    const [hasMore, setHasMore] = useState(true);

    async function loadMoreMessages() {
        if (!channelId || !hasMore) return;
        setIsLoading(true);
        try {
            const msgs = await getMessages<M, T>(channelId, lastVisible);
            if (msgs.length < MESSAGE_UNIT) {
                setHasMore(false);
            }
            const lastMsg = msgs.at(0) || null;
            setLastVisible(lastMsg);
            setMessages((prev) => [...msgs, ...prev]);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!channelId) {
            setMessages([]);
            setIsLoading(false);
            return;
        }
        let unsubscribe: Unsubscribe;
        getMessages<M, T>(channelId, null).then((msgs) => {
            setMessages(msgs);
            if (msgs.length >= MESSAGE_UNIT) {
                setHasMore(true);
            } else {
                setHasMore(false);
            }

            const lastMsg = msgs.at(0) || null;
            const recentMsg = msgs.at(-1) || null;

            setLastVisible(lastMsg);
            unsubscribe = onSnapshot(
                query(
                    collection(
                        db,
                        CHANNEL_COLLECTION,
                        channelId,
                        MESSAGE_COLLECTION
                    ),
                    orderBy(MESSAGE_CREATED_AT_FIELD, 'asc'),
                    startAfter(recentMsg?.[MESSAGE_CREATED_AT_FIELD] ?? 0)
                ),
                (querySnapshot) => {
                    querySnapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            setMessages((prev) => [
                                ...prev,
                                change.doc.data() as M,
                            ]);
                        }
                    });
                }
            );
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [channelId]);

    return {
        messages,
        isLoading,
        lastVisible,
        hasMore,
        loadMoreMessages,
    };
}
