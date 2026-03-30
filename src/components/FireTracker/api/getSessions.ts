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
    hasUtm?: boolean;
    isFirstVisit?: boolean;
    visitorId?: string;
}

export async function getSessions(
    params: GetSessionsParams = {}
): Promise<FireTrackerSession[]> {
    const { startDate, endDate, hasUtm, isFirstVisit } = params;

    const constraints = [];

    if (startDate) {
        constraints.push(
            where('startedAt', '>=', Timestamp.fromDate(startDate))
        );
    }

    if (endDate) {
        constraints.push(where('startedAt', '<=', Timestamp.fromDate(endDate)));
    }

    const q = query(collection(db, TRACKER_SESSION_COLLECTION), ...constraints);

    const snapshot = await getDocs(q);
    let sessions = snapshot.docs.map((doc) => doc.data() as FireTrackerSession);

    // 클라이언트 사이드 필터링 (Firestore 복합 인덱스 없이)
    if (hasUtm !== undefined) {
        sessions = sessions.filter((s) => s.hasUtm === hasUtm);
    }
    if (isFirstVisit !== undefined) {
        sessions = sessions.filter((s) => s.isFirstVisit === isFirstVisit);
    }
    if (params.trafficSource) {
        sessions = sessions.filter((s) => s.trafficSource === params.trafficSource);
    }
    if (params.visitorId) {
        sessions = sessions.filter((s) => s.visitorId === params.visitorId);
    }

    return sessions;
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
