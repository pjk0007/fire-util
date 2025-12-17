import { db } from '@/lib/firebase';
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    Timestamp,
    limit,
} from 'firebase/firestore';
import {
    TRACKER_SESSION_COLLECTION,
    FireTrackerSession,
} from '@/components/FireTracker/settings';

interface GetSessionsParams {
    startDate?: Date;
    endDate?: Date;
    trafficSource?: string;
    limitCount?: number;
}

export async function getSessions(
    params: GetSessionsParams = {}
): Promise<FireTrackerSession[]> {
    const { startDate, endDate, trafficSource, limitCount = 100 } = params;

    let q = query(
        collection(db, TRACKER_SESSION_COLLECTION),
        orderBy('startedAt', 'desc'),
        limit(limitCount)
    );

    const constraints = [];

    if (startDate) {
        constraints.push(where('startedAt', '>=', Timestamp.fromDate(startDate)));
    }

    if (endDate) {
        constraints.push(where('startedAt', '<=', Timestamp.fromDate(endDate)));
    }

    if (trafficSource) {
        constraints.push(where('trafficSource', '==', trafficSource));
    }

    if (constraints.length > 0) {
        q = query(
            collection(db, TRACKER_SESSION_COLLECTION),
            ...constraints,
            orderBy('startedAt', 'desc'),
            limit(limitCount)
        );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as FireTrackerSession);
}

export async function getSessionsToday(): Promise<FireTrackerSession[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return getSessions({ startDate: today });
}

export async function getSessionsThisWeek(): Promise<FireTrackerSession[]> {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    return getSessions({ startDate: weekStart });
}

export async function getSessionsThisMonth(): Promise<FireTrackerSession[]> {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    return getSessions({ startDate: monthStart });
}
