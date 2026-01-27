import { db, storage } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/components/FireChannel/settings';
import {
    DRIVE_COLLECTION,
    DRIVE_TYPE_FOLDER,
    DRIVE_PARENT_ID_FIELD,
    DRIVE_STORAGE_PATH_FIELD,
} from '../settings';
import { FireDriveItem } from '../settings';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

export default async function deleteItem(
    channelId: string,
    item: FireDriveItem
): Promise<void> {
    if (item.type === DRIVE_TYPE_FOLDER) {
        await deleteFolderContents(channelId, item.id);
    } else {
        if (item[DRIVE_STORAGE_PATH_FIELD]) {
            const storageRef = ref(storage, item[DRIVE_STORAGE_PATH_FIELD]);
            try {
                await deleteObject(storageRef);
            } catch (error) {
                // Storage 삭제 실패 시 (파일이 이미 없거나 권한 문제)
                // Firestore 문서는 삭제하되 경고 로그 남김
                console.warn(
                    `Storage delete failed for ${item[DRIVE_STORAGE_PATH_FIELD]}:`,
                    error
                );
                // storage/object-not-found 에러가 아닌 경우 에러 전파
                const firebaseError = error as { code?: string };
                if (firebaseError.code !== 'storage/object-not-found') {
                    throw error;
                }
            }
        }
    }

    const itemRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        DRIVE_COLLECTION,
        item.id
    );
    await deleteDoc(itemRef);
}

async function deleteFolderContents(
    channelId: string,
    folderId: string
): Promise<void> {
    const itemsRef = collection(
        db,
        CHANNEL_COLLECTION,
        channelId,
        DRIVE_COLLECTION
    );

    const q = query(itemsRef, where(DRIVE_PARENT_ID_FIELD, '==', folderId));
    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
        const item = docSnap.data() as FireDriveItem;
        await deleteItem(channelId, item);
    }
}

export interface DeleteItemsResult {
    successCount: number;
    failedCount: number;
}

export async function deleteItems(
    channelId: string,
    items: FireDriveItem[]
): Promise<DeleteItemsResult> {
    let successCount = 0;
    let failedCount = 0;

    for (const item of items) {
        try {
            await deleteItem(channelId, item);
            successCount++;
        } catch (error) {
            console.error('Failed to delete item:', item.id, error);
            failedCount++;
        }
    }

    return { successCount, failedCount };
}
