import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/components/FireChannel/settings';
import {
    DRIVE_COLLECTION,
    DRIVE_ID_FIELD,
    DRIVE_NAME_FIELD,
    DRIVE_TYPE_FIELD,
    DRIVE_TYPE_FOLDER,
    DRIVE_PARENT_ID_FIELD,
    DRIVE_CREATED_BY_FIELD,
    DRIVE_CREATED_AT_FIELD,
    DRIVE_UPDATED_AT_FIELD,
} from '../settings';
import { FireDriveFolder } from '../settings';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export default async function createFolder(
    channelId: string,
    parentId: string | null,
    name: string,
    userId: string
): Promise<string> {
    const folderId = `folder-${crypto.randomUUID()}`;

    const folderRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        DRIVE_COLLECTION,
        folderId
    );

    const folder: FireDriveFolder = {
        [DRIVE_ID_FIELD]: folderId,
        [DRIVE_NAME_FIELD]: name,
        [DRIVE_TYPE_FIELD]: DRIVE_TYPE_FOLDER,
        [DRIVE_PARENT_ID_FIELD]: parentId,
        [DRIVE_CREATED_BY_FIELD]: userId,
        [DRIVE_CREATED_AT_FIELD]: Timestamp.now(),
        [DRIVE_UPDATED_AT_FIELD]: Timestamp.now(),
    };

    await setDoc(folderRef, folder);
    return folderId;
}
