import { db } from '@/lib/firebase';
import {
    CHANNEL_COLLECTION,
    CHANNEL_LAST_MESSAGE_FIELD,
    FcMessage,
    FcMessageContent,
} from '@/lib/FireChat/settings';
import { doc, updateDoc } from 'firebase/firestore';

export default async function updateLastMessage<
    M extends FcMessage<T>,
    T extends FcMessageContent
>(channelId: string, msg: M) {
    await updateDoc(doc(db, CHANNEL_COLLECTION, channelId), {
        [CHANNEL_LAST_MESSAGE_FIELD]: msg,
    });
    // Update the last message in the channel document if needed
    // This part is optional and depends on your requirements
}
