import { DATABASE_COLLECTION } from '@/components/FireDatabase/settings/constants';
import { FireDatabase } from '@/components/FireDatabase/settings/types/database';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default async function getDatabase(databaseId: string) {
    const databaseDoc = await getDoc(doc(db, DATABASE_COLLECTION, databaseId));
    return databaseDoc.exists() ? (databaseDoc.data() as FireDatabase) : null;
}
