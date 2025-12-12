import { DATABASE_COLLECTION } from '@/components/FireDatabase/settings/constants';
import { FireDatabase, FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import { db } from '@/lib/firebase';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';

export default async function createColumn(
    databaseId: string,
    column: FireDatabaseColumn
) {
    const databaseDoc = await getDoc(doc(db, DATABASE_COLLECTION, databaseId));
    const database = databaseDoc.data() as FireDatabase;
    
    const views = database.views

    await updateDoc(doc(db, DATABASE_COLLECTION, databaseId), {
        columns: arrayUnion(column),
        views: views.map(view => ({
            ...view,
            columnOrder: [...view.columnOrder, column.id],
        })),
    });
}
