import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import {
    TRACKER_SESSION_COLLECTION,
    FireTrackerSession,
} from '@/components/FireTracker/settings';

export async function getSession(
    sessionId: string
): Promise<FireTrackerSession | null> {
    const docRef = doc(db, TRACKER_SESSION_COLLECTION, sessionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return docSnap.data() as FireTrackerSession;
}
