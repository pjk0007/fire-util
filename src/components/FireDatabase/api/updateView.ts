import { DATABASE_COLLECTION } from '@/components/FireDatabase/settings/constants';
import { FireDatabaseView } from '@/components/FireDatabase/settings/types/database';
import { db } from '@/lib/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';

export default async function updateView(
    databaseId: string,
    viewId: string,
    updates: Partial<FireDatabaseView>
) {
    const viewDoc = doc(db, DATABASE_COLLECTION, databaseId, 'views', viewId);

    await updateDoc(viewDoc, {
        ...updates,
        updatedAt: Timestamp.now(),
    });
}
