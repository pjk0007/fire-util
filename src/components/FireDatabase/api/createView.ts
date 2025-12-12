import { DATABASE_COLLECTION } from '@/components/FireDatabase/settings/constants';
import { FireDatabaseView } from '@/components/FireDatabase/settings/types/database';
import { db } from '@/lib/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export default async function createView(
    databaseId: string,
    view: Omit<FireDatabaseView, 'id'>
) {
    const viewId = `view_${Date.now()}`;
    const viewDoc = doc(db, DATABASE_COLLECTION, databaseId, 'views', viewId);

    await setDoc(viewDoc, {
        ...view,
        id: viewId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });

    return viewId;
}
