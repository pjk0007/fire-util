import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import {
    DRIVE_COLLECTION,
    DRIVE_NAME_FIELD,
    DRIVE_UPDATED_AT_FIELD,
} from '../settings';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';

export default async function renameItem(
    channelId: string,
    itemId: string,
    newName: string
): Promise<void> {
    const itemRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        DRIVE_COLLECTION,
        itemId
    );

    await updateDoc(itemRef, {
        [DRIVE_NAME_FIELD]: newName,
        [DRIVE_UPDATED_AT_FIELD]: Timestamp.now(),
    });
}
