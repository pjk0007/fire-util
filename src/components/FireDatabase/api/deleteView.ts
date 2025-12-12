import { DATABASE_COLLECTION } from '@/components/FireDatabase/settings/constants';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export default async function deleteView(databaseId: string, viewId: string) {
    const viewDoc = doc(db, DATABASE_COLLECTION, databaseId, 'views', viewId);
    await deleteDoc(viewDoc);
}
