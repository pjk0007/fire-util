import { db } from "@/lib/firebase";
import { doc, Timestamp, increment, setDoc } from "firebase/firestore";
import { TRACKER_SESSION_COLLECTION } from "@/components/FireTracker/settings";

/**
 * 세션 페이지뷰 카운트 증가
 */
export async function incrementPageView(sessionId: string): Promise<void> {
    await setDoc(
        doc(db, TRACKER_SESSION_COLLECTION, sessionId),
        {
            lastActivityAt: Timestamp.now(),
            pageViews: increment(1),
        },
        { merge: true }
    );
}

/**
 * 세션 이벤트 카운트 증가
 */
export async function incrementEventCount(sessionId: string): Promise<void> {
    await setDoc(
        doc(db, TRACKER_SESSION_COLLECTION, sessionId),
        {
            lastActivityAt: Timestamp.now(),
            events: increment(1),
        },
        { merge: true }
    );
}

/**
 * 세션에 userId 연결
 */
export async function linkUserToSession(sessionId: string, userId: string): Promise<void> {
    await setDoc(
        doc(db, TRACKER_SESSION_COLLECTION, sessionId),
        {
            userId,
            lastActivityAt: Timestamp.now(),
        },
        { merge: true }
    );
}
