import {
    DATABASE_COLLECTION,
    DATABASE_ROW_SUBCOLLECTION,
    DEFAULT_DATABASE_ROW_NAME,
} from '@/components/FireDatabase/settings/constants';
import { db } from '@/lib/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export default async function createRow(
    databaseId: string,
    {
        name,
    }: {
        name?: string;
    }
) {
    const id = `row_${Date.now()}`;

    await setDoc(
        doc(
            db,
            DATABASE_COLLECTION,
            databaseId,
            DATABASE_ROW_SUBCOLLECTION,
            id
        ),
        {
            id,
            name: name || DEFAULT_DATABASE_ROW_NAME,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            data: {},
        }
    );
}
