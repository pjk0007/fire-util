import { db } from '@/lib/firebase';
import getFileMessages from '@/lib/FireChat/api/getFileMessages';
import getImageMessages from '@/lib/FireChat/api/getImageMessages';
import {
    CHANNEL_COLLECTION,
    FcMessage,
    FcMessageContent,
    MESSAGE_COLLECTION,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_FILE,
    MESSAGE_TYPE_IMAGE,
} from '@/lib/FireChat/settings';
import {
    collection,
    onSnapshot,
    or,
    orderBy,
    query,
    startAfter,
    where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function useListFiles<
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ channelId }: { channelId?: string }) {
    const [imageMessages, setImageMessages] = useState<M[]>([]);
    const [fileMessages, setFileMessages] = useState<M[]>([]);

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

        const unsubscribe = onSnapshot(
            query(
                collection(
                    db,
                    CHANNEL_COLLECTION,
                    channelId,
                    MESSAGE_COLLECTION
                ),
                or(
                    where(MESSAGE_TYPE_FIELD, '==', MESSAGE_TYPE_FILE),
                    where(MESSAGE_TYPE_FIELD, '==', MESSAGE_TYPE_IMAGE)
                ),
                orderBy(MESSAGE_CREATED_AT_FIELD, 'asc')
            ),
            (querySnapshot) => {
                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const msg = change.doc.data() as M;
                        if (msg[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_IMAGE) {
                            setImageMessages((prev) => [...prev, msg]);
                        } else if (
                            msg[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_FILE
                        ) {
                            setFileMessages((prev) => [...prev, msg]);
                        }
                    }
                });
            }
        );
    }, [channelId]);

    return { imageMessages, fileMessages };
}
