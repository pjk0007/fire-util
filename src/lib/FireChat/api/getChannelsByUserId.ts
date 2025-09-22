import { db } from '@/lib/firebase';
import {
    CHANNEL_COLLECTION,
    CHANNEL_PARTICIPANTS_FIELD,
} from '@/lib/FireChat/settings';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default async function getChannelsByUserId(
    userId?: string
): Promise<string[]> {
    if (!userId) return [];
    const q = query(
        collection(db, CHANNEL_COLLECTION),
        where(CHANNEL_PARTICIPANTS_FIELD, 'array-contains', userId)
    );

    const querySnapshot = await getDocs(q);
    const channelIds: string[] = [];
    querySnapshot.forEach((doc) => {
        channelIds.push(doc.id);
    });

    return channelIds;
}
