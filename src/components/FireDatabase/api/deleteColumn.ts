import {
    DATABASE_COLLECTION,
    DATABASE_VIEW_SUBCOLLECTION,
} from '@/components/FireDatabase/settings/constants';
import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import { db } from '@/lib/firebase';
import {
    arrayRemove,
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
} from 'firebase/firestore';

export default async function deleteColumn(
    databaseId: string,
    columnId: string
) {
    // Get the column data first (needed for arrayRemove)
    const databaseDoc = await getDoc(doc(db, DATABASE_COLLECTION, databaseId));
    const databaseData = databaseDoc.data();

    if (!databaseData) {
        throw new Error('Database not found');
    }

    const column = databaseData.columns.find(
        (col: FireDatabaseColumn) => col.id === columnId
    );

    if (!column) {
        throw new Error('Column not found');
    }

    // Update database columns - remove the column
    await updateDoc(doc(db, DATABASE_COLLECTION, databaseId), {
        columns: arrayRemove(column),
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

    // Remove columnId from columnOrder for each view
    const updatePromises = viewsSnapshot.docs.map((viewDoc) => {
        const viewData = viewDoc.data();
        const currentColumnOrder = viewData.columnOrder || [];
        const newColumnOrder = currentColumnOrder.filter(
            (id: string) => id !== columnId
        );

        return updateDoc(viewDoc.ref, {
            columnOrder: newColumnOrder,
        });
    });

    await Promise.all(updatePromises);
}