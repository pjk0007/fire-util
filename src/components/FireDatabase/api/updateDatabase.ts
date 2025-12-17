import { DATABASE_COLLECTION } from '@/components/FireDatabase/settings/constants';
import { FireDatabase } from '@/components/FireDatabase/settings/types/database';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default async function updateDatabase(
    databaseId: string,
    updateDatabase: Partial<FireDatabase>
) {
    return await updateDoc(
        doc(db, DATABASE_COLLECTION, databaseId),
        updateDatabase
    );
}
