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
    limitToLast,
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
>({
    channelId,
    onNewMessage,
}: {
    channelId?: string;
    onNewMessage?: (msg?: M) => void;
}) {
    const [messages, setMessages] = useState<M[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);

    useEffect(() => {
        if (!channelId) {
            setMessages([]);
            setIsLoading(false);
            return;
        }
        let unsubscribe: Unsubscribe;
        getMessages<M, T>(channelId).then((msgs) => {
            setMessages(msgs);

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
                    startAfter(recentMsg),
                ),
                (querySnapshot) => {
                    querySnapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            setMessages((prev) => [
                                ...prev,
                                change.doc.data() as M,
                            ]);
                            onNewMessage?.(change.doc.data() as M);
                        }
                    });
                }
            );
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [channelId]);
    
    return { messages, isLoading, lastVisible };
}
