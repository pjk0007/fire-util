import { db } from '@/lib/firebase';
import {
    CHANNEL_COLLECTION,
    FcMessage,
    FcMessageContent,
    MESSAGE_COLLECTION,
    MESSAGE_ID_FIELD,
} from '@/lib/FireChat/settings';
import { doc, setDoc } from 'firebase/firestore';

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