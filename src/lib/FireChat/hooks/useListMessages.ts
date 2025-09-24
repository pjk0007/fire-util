import { useAuth } from '@/components/provider/AuthProvider';
import { db } from '@/lib/firebase';
import getMessages from '@/lib/FireChat/api/getMessages';
import markMessageAsRead from '@/lib/FireChat/api/markMessageAsRead';
import {
    CHANNEL_COLLECTION,
    FcMessage,
    FcMessageContent,
    MESSAGE_COLLECTION,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_UNIT,
    USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    startAfter,
    startAt,
    Unsubscribe,
    where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function useListMessages<
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ channelId }: { channelId?: string }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<M[]>([]);
    const [beforeMessages, setBeforeMessages] = useState<M[]>([]);
    // const [newMessages, setNewMessages] = useState<M[]>([]);
    const [lastVisible, setLastVisible] = useState<M | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.error('messages rendered', messages.length);
    }, [messages]);

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
        console.time('Setting up message listener');
        setIsLoading(true);
        setBeforeMessages([]);
        // setNewMessages([]);
        setMessages([]);
        if (!channelId) {
            return;
        }
        let unsubscribe: Unsubscribe;
        let emojiUnsubscribe: Unsubscribe;
        getMessages<M, T>(channelId, null).then((msgs) => {
            markMessageAsRead(channelId, user?.[USER_ID_FIELD]);
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
                                markMessageAsRead(
                                    channelId,
                                    user?.[USER_ID_FIELD] || ''
                                );
                            }
                        }
                    });
                }
            );
        });

        emojiUnsubscribe = onSnapshot(
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
                                (m) => m[MESSAGE_ID_FIELD] === msg[MESSAGE_ID_FIELD]
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
                                (m) => m[MESSAGE_ID_FIELD] === msg[MESSAGE_ID_FIELD]
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
        console.timeEnd('Setting up message listener');

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
