import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import {
    DRIVE_COLLECTION,
    DRIVE_PARENT_ID_FIELD,
    DRIVE_TYPE_FIELD,
    DRIVE_NAME_FIELD,
} from '../settings';
import { FireDriveItem } from '../settings';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface UseFireDriveItemsOptions {
    channelId?: string;
    parentId?: string | null;
}

export default function useFireDriveItems({
    channelId,
    parentId = null,
}: UseFireDriveItemsOptions) {
    const [items, setItems] = useState<FireDriveItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!channelId) {
            setItems([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const itemsRef = collection(
            db,
            CHANNEL_COLLECTION,
            channelId,
            DRIVE_COLLECTION
        );

        const q = query(itemsRef, where(DRIVE_PARENT_ID_FIELD, '==', parentId));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const itemsData = snapshot.docs.map(
                    (doc) => doc.data() as FireDriveItem
                );

                const sortedItems = itemsData.sort((a, b) => {
                    if (a[DRIVE_TYPE_FIELD] !== b[DRIVE_TYPE_FIELD]) {
                        return a[DRIVE_TYPE_FIELD] === 'folder' ? -1 : 1;
                    }

                    const aValue = a[DRIVE_NAME_FIELD].toLowerCase();
                    const bValue = b[DRIVE_NAME_FIELD].toLowerCase();

                    return aValue.localeCompare(bValue, 'ko');
                });

                setItems(sortedItems);
                setIsLoading(false);
            },
            (err) => {
                setError(err);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [channelId, parentId]);

    return { items, isLoading, error };
}
