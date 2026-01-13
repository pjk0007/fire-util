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
    TRACKER_EVENT_COLLECTION,
    FireTrackerEvent,
    EventType,
} from '@/components/FireTracker/settings';

interface GetEventsParams {
    startDate?: Date;
    endDate?: Date;
    type?: EventType;
    sessionId?: string;
}

export async function getEvents(
    params: GetEventsParams = {}
): Promise<FireTrackerEvent[]> {
    const { startDate, endDate, type, sessionId } = params;

    const constraints = [];

    if (startDate) {
        constraints.push(where('timestamp', '>=', Timestamp.fromDate(startDate)));
    }

    if (endDate) {
        constraints.push(where('timestamp', '<=', Timestamp.fromDate(endDate)));
    }

    if (type) {
        constraints.push(where('type', '==', type));
    }

    if (sessionId) {
        constraints.push(where('sessionId', '==', sessionId));
    }

    const q = query(
        collection(db, TRACKER_EVENT_COLLECTION),
        ...constraints,
        orderBy('timestamp', 'desc'),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as FireTrackerEvent);
}

export async function getEventsToday(): Promise<FireTrackerEvent[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return getEvents({ startDate: today });
}

export async function getEventsThisWeek(): Promise<FireTrackerEvent[]> {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    return getEvents({ startDate: weekStart });
}

export async function getEventsThisMonth(): Promise<FireTrackerEvent[]> {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    return getEvents({ startDate: monthStart });
}
