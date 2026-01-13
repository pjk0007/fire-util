import { db } from '@/lib/firebase';
import { doc, setDoc, Timestamp, collection, query, where, limit, getDocs } from 'firebase/firestore';
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

async function checkIsFirstVisit(visitorId: string): Promise<boolean> {
    const sessionsRef = collection(db, TRACKER_SESSION_COLLECTION);
    const q = query(
        sessionsRef,
        where('visitorId', '==', visitorId),
        limit(1)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty;
}

export async function createSession(
    params: CreateSessionParams
): Promise<FireTrackerSession> {
    const now = Timestamp.now();

    const hasUtm = Object.keys(params.utm).length > 0;
    const isFirstVisit = await checkIsFirstVisit(params.visitorId);

    const session: FireTrackerSession = {
        id: params.sessionId,
        visitorId: params.visitorId,
        userId: params.userId ?? null,
        startedAt: now,
        lastActivityAt: now,
        utm: params.utm,
        hasUtm,
        customParams: params.customParams ?? null,
        referrer: params.referrer,
        referrerDomain: params.referrerDomain,
        trafficSource: params.trafficSource,
        landingPage: params.landingPage,
        isFirstVisit,
        device: params.device,
        pageViews: 1,
        events: 0,
    };

    await setDoc(doc(db, TRACKER_SESSION_COLLECTION, params.sessionId), session);

    return session;
}
