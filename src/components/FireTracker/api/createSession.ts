import { db } from '@/lib/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import {
    TRACKER_SESSION_COLLECTION,
    FireTrackerSession,
    UTMData,
    TrafficSource,
    DeviceInfo,
} from '@/components/FireTracker/settings';

interface CreateSessionParams {
    sessionId: string;
    visitorId: string;
    userId?: string;
    utm: UTMData;
    customParams?: Record<string, string> | null;
    referrer: string | null;
    referrerDomain: string | null;
    trafficSource: TrafficSource;
    landingPage: string;
    device: DeviceInfo;
}

export async function createSession(
    params: CreateSessionParams
): Promise<FireTrackerSession> {
    const now = Timestamp.now();

    const session: FireTrackerSession = {
        id: params.sessionId,
        visitorId: params.visitorId,
        userId: params.userId ?? null,
        startedAt: now,
        lastActivityAt: now,
        utm: params.utm,
        customParams: params.customParams ?? null,
        referrer: params.referrer,
        referrerDomain: params.referrerDomain,
        trafficSource: params.trafficSource,
        landingPage: params.landingPage,
        device: params.device,
        pageViews: 1,
        events: 0,
    };

    await setDoc(doc(db, TRACKER_SESSION_COLLECTION, params.sessionId), session);

    return session;
}
