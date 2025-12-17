import {
    DATABASE_VIEW_SUBCOLLECTION,
    DEFAULT_DATABASE_COLUMNS,
    DEFAULT_DATABASE_NAME,
    DEFAULT_DATABASE_VIEWS,
} from '../settings/constants';
import { DATABASE_COLLECTION } from '../settings/constants';
import { db } from '@/lib/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export default async function createDatabase(name?: string) {
    const id = `db_${Date.now()}`;

    // Create database document
    await setDoc(doc(db, DATABASE_COLLECTION, id), {
        id,
        name: name ?? DEFAULT_DATABASE_NAME,
        columns: DEFAULT_DATABASE_COLUMNS,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });

    // Create default view in subcollection
    for (const view of DEFAULT_DATABASE_VIEWS) {
        await setDoc(
            doc(
                db,
                DATABASE_COLLECTION,
                id,
                DATABASE_VIEW_SUBCOLLECTION,
                view.id
            ),
            {
                ...view,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            }
        );
    }

    return id;
}
