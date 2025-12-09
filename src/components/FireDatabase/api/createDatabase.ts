import { FireDatabase } from '../settings/types/database';
import {
    DEFAULT_DATABASE_COLUMNS,
    DEFAULT_DATABASE_NAME,
    DEFAULT_DATABASE_VIEWS,
} from '../settings/constants';
import { DATABASE_COLLECTION } from '../settings/constants';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default async function createDatabase(name?: string) {
    const id = `db_${Date.now()}`;

    await setDoc(doc(db, DATABASE_COLLECTION, id), {
        id,
        name: name ?? DEFAULT_DATABASE_NAME,
        columns: DEFAULT_DATABASE_COLUMNS,
        views: DEFAULT_DATABASE_VIEWS,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });
}
