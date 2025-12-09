import {
    DATABASE_COLLECTION,
    DATABASE_ROW_SUBCOLLECTION,
} from '@/components/FireDatabase/settings/constants';
import { FireDatabaseData } from '@/components/FireDatabase/settings/types/row';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function updateRowData(
    databaseId: string,
    rowId: string,
    data?: { [columnId: string]: FireDatabaseData }
) {
    const updateData: { [key: string]: any } = {};
    if (data) {
        for (const columnId in data) {
            updateData[`data.${columnId}`] = data[columnId];
        }
    }
    return updateDoc(
        doc(
            db,
            `${DATABASE_COLLECTION}/${databaseId}/${DATABASE_ROW_SUBCOLLECTION}`,
            rowId
        ),
        updateData
    );
}
