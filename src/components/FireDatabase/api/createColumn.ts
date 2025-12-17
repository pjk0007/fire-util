import {
    DATABASE_COLLECTION,
    DATABASE_VIEW_SUBCOLLECTION,
} from '@/components/FireDatabase/settings/constants';
import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import { db } from '@/lib/firebase';
import {
    arrayUnion,
    collection,
    doc,
    getDocs,
    updateDoc,
} from 'firebase/firestore';

export default async function createColumn(
    databaseId: string,
    column: FireDatabaseColumn
) {
    // Update database columns
    await updateDoc(doc(db, DATABASE_COLLECTION, databaseId), {
        columns: arrayUnion(column),
    });

    // Get all views for this database
    const viewsSnapshot = await getDocs(
        collection(
            db,
            DATABASE_COLLECTION,
            databaseId,
            DATABASE_VIEW_SUBCOLLECTION
        )
    );

    // Update columnOrder for each view
    const updatePromises = viewsSnapshot.docs.map((viewDoc) => {
        return updateDoc(viewDoc.ref, {
            // columnOrder: [...currentColumnOrder, column.id],
            columnOrder: arrayUnion(column.id),
        });
    });

    await Promise.all(updatePromises);
}
