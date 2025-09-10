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
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function useListMessages<
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ channelId }: { channelId?: string }) {
    const [messages, setMessages] = useState<M[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);

    useEffect(() => {
        if (!channelId) {
            setMessages([]);
            setLoading(false);
            return;
        }
        getMessages<M, T>(channelId).then((msgs) => {
            setMessages(msgs);
            if (msgs.length > 0) {
                setLastVisible(msgs[msgs.length - 1]);
            }
        });
    }, [channelId]);

    return { messages, loading, lastVisible };
}
