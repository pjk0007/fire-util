import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/components/FireChannel/settings';
import { DRIVE_COLLECTION } from '../settings';
import { FireDriveItem } from '../settings';
import { doc, getDoc } from 'firebase/firestore';

export default async function getItem(
    channelId: string,
    itemId: string
): Promise<FireDriveItem | null> {
    const itemRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        DRIVE_COLLECTION,
        itemId
    );

    const snapshot = await getDoc(itemRef);

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.data() as FireDriveItem;
}
