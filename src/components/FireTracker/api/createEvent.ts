import { db } from '@/lib/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import {
    TRACKER_EVENT_COLLECTION,
    FireTrackerEvent,
    EventType,
} from '@/components/FireTracker/settings';

interface CreateEventParams {
    sessionId: string;
    visitorId: string;
    userId?: string;
    type: EventType;
    name: string;
    page: string;
    pageTitle: string;
    properties?: Record<string, unknown>;
}

export async function createEvent(
    params: CreateEventParams
): Promise<FireTrackerEvent> {
    const eventId = `event_${crypto.randomUUID()}`;

    const event: FireTrackerEvent = {
        id: eventId,
        sessionId: params.sessionId,
        visitorId: params.visitorId,
        userId: params.userId ?? null,
        type: params.type,
        name: params.name,
        timestamp: Timestamp.now(),
        page: params.page,
        pageTitle: params.pageTitle,
        properties: params.properties ?? null,
    };

    await setDoc(doc(db, TRACKER_EVENT_COLLECTION, eventId), event);

    return event;
}
