import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { db } from '@/lib/firebase';
import getMessages from '@/components/FireChat/api/getMessages';
import updateLastSeen from '@/components/FireChat/api/updateLastSeen';
import {
    FireMessage,
    FireMessageContent,
    MESSAGE_COLLECTION,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_UNIT,
} from '@/components/FireChat/settings';
import { CHANNEL_COLLECTION } from '@/components/FireChannel/settings';
import { USER_ID_FIELD } from '@/lib/FireAuth/settings';
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    startAt,
    Unsubscribe,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function useListMessages<
    M extends FireMessage<T>,
    T extends FireMessageContent
>({ channelId }: { channelId?: string }) {
    const { user } = useFireAuth();
    const [messages, setMessages] = useState<M[]>([]);
    const [beforeMessages, setBeforeMessages] = useState<M[]>([]);
    // const [newMessages, setNewMessages] = useState<M[]>([]);
    const [lastVisible, setLastVisible] = useState<M | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    async function loadBeforeMessages() {
        if (!channelId || !hasMore) return;
        setIsLoading(true);
        try {
            const msgs = await getMessages<M, T>(channelId, lastVisible);
            if (msgs.length < MESSAGE_UNIT) {
                setHasMore(false);
            }
            const lastMsg = msgs.at(0) || null;
            setLastVisible(lastMsg);
            setBeforeMessages((prev) => [...msgs, ...prev]);
        } catch (error) {
            // Handle error
            console.error('Error loading more messages:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        setBeforeMessages([]);
        // setNewMessages([]);
        setMessages([]);
        if (!channelId) {
            return;
        }
        let unsubscribe: Unsubscribe;
        getMessages<M, T>(channelId, null).then((msgs) => {
            updateLastSeen(channelId, user?.[USER_ID_FIELD]);
            // setMessages(msgs);

            if (msgs.length >= MESSAGE_UNIT) {
                setHasMore(true);
            } else {
                setHasMore(false);
            }

            setTimeout(() => {
                setIsLoading(false);
            }, 500);

            const lastMsg = msgs.at(0) || null;

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
                    startAt(lastMsg?.[MESSAGE_CREATED_AT_FIELD] ?? 0)
                ),
                (querySnapshot) => {
                    querySnapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            const msg = change.doc.data() as M;
                            setMessages((prev) => [...prev, msg]);
                            // setNewMessages((prev) => [...prev, msg]);
                            // 메시지가 추가로 들어오면 읽음 처리
                            if (user?.[USER_ID_FIELD]) {
                                updateLastSeen(
                                    channelId,
                                    user?.[USER_ID_FIELD] || ''
                                );
                            }
                        }
                    });
                }
            );
        });

        const emojiUnsubscribe = onSnapshot(
            query(
                collection(
                    db,
                    CHANNEL_COLLECTION,
                    channelId,
                    MESSAGE_COLLECTION
                )
            ),
            (querySnapshot) => {
                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === 'modified') {
                        const msg = change.doc.data() as M;

                        setBeforeMessages((prev) => {
                            const index = prev.findIndex(
                                (m) =>
                                    m[MESSAGE_ID_FIELD] ===
                                    msg[MESSAGE_ID_FIELD]
                            );
                            if (index !== -1) {
                                const newMessages = [...prev];
                                newMessages[index] = msg;
                                return newMessages;
                            }
                            return prev;
                        });

                        setMessages((prev) => {
                            const index = prev.findIndex(
                                (m) =>
                                    m[MESSAGE_ID_FIELD] ===
                                    msg[MESSAGE_ID_FIELD]
                            );
                            if (index !== -1) {
                                const newMessages = [...prev];
                                newMessages[index] = msg;
                                return newMessages;
                            }
                            return prev;
                        });
                    }
                });
            }
        );

        return () => {
            if (unsubscribe) unsubscribe();
            if (emojiUnsubscribe) emojiUnsubscribe();
        };
    }, [channelId, user]);

    return {
        beforeMessages,
        // newMessages,
        messages,
        lastVisible,
        hasMore,
        loadBeforeMessages,
        isLoading,
    };
}
