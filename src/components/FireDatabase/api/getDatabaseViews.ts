import { DATABASE_COLLECTION } from '@/components/FireDatabase/settings/constants';
import { FireDatabaseView } from '@/components/FireDatabase/settings/types/database';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default async function getDatabaseViews(
    databaseId: string
): Promise<FireDatabaseView[]> {
    const viewsCollection = collection(
        db,
        DATABASE_COLLECTION,
        databaseId,
        'views'
    );

    const viewsQuery = query(viewsCollection, orderBy('name', 'asc'));
    const viewsSnap = await getDocs(viewsQuery);

    return viewsSnap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    })) as FireDatabaseView[];
}
