import { db } from '@/lib/firebase';
import {
    CHANNEL_COLLECTION,
    CHANNEL_LAST_SEEN_FIELD,
} from '@/lib/FireChat/settings';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';

export default async function updateLastSeen(
    channelId: string,
    userId?: string
) {
    if (!userId) return;
    const channelRef = doc(db, CHANNEL_COLLECTION, channelId);
    await updateDoc(channelRef, {
        [`${CHANNEL_LAST_SEEN_FIELD}.${userId}`]: Timestamp.now(),
    });
}
