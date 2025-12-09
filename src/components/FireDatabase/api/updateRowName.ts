import {
    DATABASE_COLLECTION,
    DATABASE_ROW_SUBCOLLECTION,
} from '@/components/FireDatabase/settings/constants';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function updateRowName(
    databaseId: string,
    rowId: string,
    name: string
) {
    return updateDoc(
        doc(
            db,
            `${DATABASE_COLLECTION}/${databaseId}/${DATABASE_ROW_SUBCOLLECTION}`,
            rowId
        ),
        { name }
    );
}
