import { FireDatabaseRow } from '@/components/FireDatabase/settings/types/row';
import { DATABASE_COLLECTION } from '../settings/constants';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function getDatabaseRows(id: string) {
    const docs = await getDocs(collection(db, DATABASE_COLLECTION, id, 'rows'));
    return docs.docs.map((doc) => doc.data() as FireDatabaseRow);
}
