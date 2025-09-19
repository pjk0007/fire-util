import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION, CHANNEL_PARTICIPANTS_FIELD } from '@/lib/FireChat/settings';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';

export default async function inviteUser(
    channelId: string,
    userId: string
): Promise<void> {    
    const channelRef = doc(db, CHANNEL_COLLECTION, channelId);
    await updateDoc(channelRef, {
        [CHANNEL_PARTICIPANTS_FIELD]: arrayUnion(userId),
    });
}
