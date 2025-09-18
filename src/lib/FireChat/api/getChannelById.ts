import { db } from '@/lib/firebase';
import {
    CHANNEL_COLLECTION,
    FcChannel,
    FcMessage,
    FcMessageContent,
    FcUser,
} from '@/lib/FireChat/settings';
import { doc, getDoc } from 'firebase/firestore';

export default async function getChannelById<
    C extends FcChannel<M, T>,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({
    channelId,
    channelCollection = CHANNEL_COLLECTION,
}: {
    channelId?: string;
    channelCollection?: string;
}) {
    if (!channelId) return null;
    const channelDoc = await getDoc(doc(db, channelCollection, channelId));
    return channelDoc.exists() ? (channelDoc.data() as C) : null;
}
