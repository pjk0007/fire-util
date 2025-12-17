import { DATABASE_COLLECTION } from '@/components/FireDatabase/settings/constants';
import { FireDatabase, FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default async function updateColumn(
    databaseId: string,
    columnId: string,
    updates: Partial<FireDatabaseColumn>
) {
    const databaseDoc = await getDoc(doc(db, DATABASE_COLLECTION, databaseId));
    const database = databaseDoc.data() as FireDatabase;

    const updatedColumns = database.columns.map((col) =>
        col.id === columnId ? { ...col, ...updates } : col
    );

    await updateDoc(doc(db, DATABASE_COLLECTION, databaseId), {
        columns: updatedColumns,
    });
}
