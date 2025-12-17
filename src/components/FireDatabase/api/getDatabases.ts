import { FireDatabase } from "../settings/types/database";
import { DATABASE_COLLECTION } from "../settings/constants";
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function getDatabases() {
    const docs = await getDocs(collection(db, DATABASE_COLLECTION));
    return docs.docs.map((doc) => doc.data() as FireDatabase);
}
