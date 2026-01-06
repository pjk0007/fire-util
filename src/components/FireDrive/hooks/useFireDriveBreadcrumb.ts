import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import { DRIVE_COLLECTION, DRIVE_PARENT_ID_FIELD, MAX_FOLDER_DEPTH } from '../settings';
import { FireDriveItem } from '../settings';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';

export default function useFireDriveBreadcrumb(
    channelId?: string,
    currentFolderId?: string | null
) {
    const [breadcrumb, setBreadcrumb] = useState<FireDriveItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const buildBreadcrumb = useCallback(async () => {
        if (
            !channelId ||
            currentFolderId === null ||
            currentFolderId === undefined
        ) {
            setBreadcrumb([]);
            return;
        }

        setIsLoading(true);
        const path: FireDriveItem[] = [];
        let folderId: string | null = currentFolderId;
        const visitedIds = new Set<string>(); // 순환 참조 방지

        while (folderId && path.length < MAX_FOLDER_DEPTH) {
            // 순환 참조 감지
            if (visitedIds.has(folderId)) {
                console.warn('Circular reference detected in breadcrumb:', folderId);
                break;
            }
            visitedIds.add(folderId);

            const folderRef = doc(
                db,
                CHANNEL_COLLECTION,
                channelId,
                DRIVE_COLLECTION,
                folderId
            );

            const folderSnap = await getDoc(folderRef);

            if (folderSnap.exists()) {
                const folder = folderSnap.data() as FireDriveItem;
                path.unshift(folder);
                folderId = folder[DRIVE_PARENT_ID_FIELD];
            } else {
                break;
            }
        }

        setBreadcrumb(path);
        setIsLoading(false);
    }, [channelId, currentFolderId]);

    useEffect(() => {
        buildBreadcrumb();
    }, [buildBreadcrumb]);

    return { breadcrumb, isLoading };
}
