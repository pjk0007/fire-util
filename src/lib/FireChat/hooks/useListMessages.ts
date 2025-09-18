import { db } from '@/lib/firebase';
import getFileMessages from '@/lib/FireChat/api/getFileMessages';
import getImageMessages from '@/lib/FireChat/api/getImageMessages';
import getMessages from '@/lib/FireChat/api/getMessages';
import {
    CHANNEL_COLLECTION,
    FcMessage,
    FcMessageContent,
    MESSAGE_COLLECTION,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_FILE,
    MESSAGE_TYPE_IMAGE,
    MESSAGE_UNIT,
} from '@/lib/FireChat/settings';
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    startAfter,
    Unsubscribe,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function useListMessages<
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ channelId }: { channelId?: string }) {
    const [messages, setMessages] = useState<M[]>([]);
    const [imageMessages, setImageMessages] = useState<M[]>([]);
    const [fileMessages, setFileMessages] = useState<M[]>([]);
    const [lastVisible, setLastVisible] = useState<M | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    async function loadMoreMessages() {
        if (!channelId || !hasMore) return;
        try {
            const msgs = await getMessages<M, T>(channelId, lastVisible);
            if (msgs.length < MESSAGE_UNIT) {
                setHasMore(false);
            }
            const lastMsg = msgs.at(0) || null;
            setLastVisible(lastMsg);
            setMessages((prev) => [...msgs, ...prev]);
        } catch (error) {
            // Handle error
        }
    }

    useEffect(() => {
        if (!channelId) {
            setImageMessages([]);
            setFileMessages([]);
            return;
        }

        getImageMessages<M, T>(channelId).then((imgs) => {
            setImageMessages(imgs);
        });

        getFileMessages<M, T>(channelId).then((files) => {
            setFileMessages(files);
        });
    }, [channelId]);

    useEffect(() => {
        if (!channelId) {
            setMessages([]);
            return;
        }
        setIsLoading(true);
        let unsubscribe: Unsubscribe;
        getMessages<M, T>(channelId, null)
            .then((msgs) => {
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
                                const msg = change.doc.data() as M;
                                setMessages((prev) => [...prev, msg]);
                                if (
                                    msg[MESSAGE_TYPE_FIELD] ===
                                    MESSAGE_TYPE_IMAGE
                                ) {
                                    setImageMessages((prev) => [...prev, msg]);
                                } else if (
                                    msg[MESSAGE_TYPE_FIELD] ===
                                    MESSAGE_TYPE_FILE
                                ) {
                                    setFileMessages((prev) => [...prev, msg]);
                                }
                            }
                        });
                    }
                );
            })
            .finally(() => {
                setIsLoading(false);
            });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [channelId]);

    return {
        messages,
        imageMessages,
        fileMessages,
        lastVisible,
        hasMore,
        loadMoreMessages,
        isLoading,
    };
}
