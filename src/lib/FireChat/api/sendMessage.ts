import { db } from '@/lib/firebase';
import {
    FcMessage,
    FcMessageContent,
    MESSAGE_COLLECTION,
    MESSAGE_ID_FIELD,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_REPLY_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { CHANNEL_COLLECTION, CHANNEL_LAST_MESSAGE_FIELD } from '@/lib/FireChannel/settings';
import { doc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';

export default async function sendMessage<
    M extends FcMessage<T>,
    T extends FcMessageContent
>(channelId: string, message: M) {
    await setDoc(
        doc(
            db,
            CHANNEL_COLLECTION,
            channelId,
            MESSAGE_COLLECTION,
            message[MESSAGE_ID_FIELD]
        ),
        message
    );
}

export async function updateLastMessage<
    M extends FcMessage<T>,
    T extends FcMessageContent
>(channelId: string, msg: M) {
    await updateDoc(doc(db, CHANNEL_COLLECTION, channelId), {
        [CHANNEL_LAST_MESSAGE_FIELD]: msg,
    });
}

export async function sendTextMessage<M extends FcMessage<FcMessageContent>>(
    channelId: string,
    userId: string,
    message: string,
    replyingMessage?: M
) {
    if (!message.trim()) return;

    const now = Timestamp.now();
    const msg = {
        [MESSAGE_ID_FIELD]: `${MESSAGE_COLLECTION}-${now.seconds}${now.nanoseconds}`,
        [MESSAGE_USER_ID_FIELD]: userId,
        [MESSAGE_CREATED_AT_FIELD]: now,
        [MESSAGE_TYPE_FIELD]: 'text',
        [MESSAGE_CONTENTS_FIELD]: [
            {
                [MESSAGE_TYPE_FIELD]: 'text',
                [MESSAGE_CONTENT_TEXT_FIELD]: message,
            },
        ],
        [MESSAGE_REPLY_FIELD]: replyingMessage ?? null,
    } as M;

    sendMessage(channelId, msg);
    updateLastMessage(channelId, msg);
}
