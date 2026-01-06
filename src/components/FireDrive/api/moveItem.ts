import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import {
    DRIVE_COLLECTION,
    DRIVE_PARENT_ID_FIELD,
    DRIVE_UPDATED_AT_FIELD,
    MAX_FOLDER_DEPTH,
} from '../settings';
import { FireDriveItem } from '../settings';
import { doc, updateDoc, Timestamp, getDoc } from 'firebase/firestore';

/**
 * 폴더를 자기 자신 또는 하위 폴더로 이동하는 순환 참조 검사
 */
export async function wouldCreateCycle(
    channelId: string,
    itemId: string,
    newParentId: string | null
): Promise<boolean> {
    if (newParentId === null) return false;
    if (itemId === newParentId) return true;

    const visitedIds = new Set<string>();
    let currentId: string | null = newParentId;

    while (currentId && visitedIds.size < MAX_FOLDER_DEPTH) {
        if (currentId === itemId) return true;
        if (visitedIds.has(currentId)) break;
        visitedIds.add(currentId);

        const folderRef = doc(
            db,
            CHANNEL_COLLECTION,
            channelId,
            DRIVE_COLLECTION,
            currentId
        );
        const folderSnap = await getDoc(folderRef);

        if (folderSnap.exists()) {
            const folder = folderSnap.data() as FireDriveItem;
            currentId = folder[DRIVE_PARENT_ID_FIELD];
        } else {
            break;
        }
    }

    return false;
}

export default async function moveItem(
    channelId: string,
    itemId: string,
    newParentId: string | null
): Promise<void> {
    // 순환 참조 검사
    if (await wouldCreateCycle(channelId, itemId, newParentId)) {
        throw new Error('Cannot move folder into itself or its subfolder');
    }

    const itemRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        DRIVE_COLLECTION,
        itemId
    );

    await updateDoc(itemRef, {
        [DRIVE_PARENT_ID_FIELD]: newParentId,
        [DRIVE_UPDATED_AT_FIELD]: Timestamp.now(),
    });
}

export interface MoveItemsResult {
    successCount: number;
    failedCount: number;
}

export async function moveItems(
    channelId: string,
    items: FireDriveItem[],
    newParentId: string | null
): Promise<MoveItemsResult> {
    let successCount = 0;
    let failedCount = 0;

    for (const item of items) {
        try {
            await moveItem(channelId, item.id, newParentId);
            successCount++;
        } catch (error) {
            console.error('Failed to move item:', item.id, error);
            failedCount++;
        }
    }

    return { successCount, failedCount };
}
