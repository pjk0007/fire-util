import { db } from '@/lib/firebase';
import { doc, updateDoc, Timestamp, increment } from 'firebase/firestore';
import { TRACKER_SESSION_COLLECTION } from '@/components/FireTracker/settings';

/**
 * 세션 활동 시간 업데이트
 */
export async function updateSessionActivity(sessionId: string): Promise<void> {
    await updateDoc(doc(db, TRACKER_SESSION_COLLECTION, sessionId), {
        lastActivityAt: Timestamp.now(),
    });
}

/**
 * 세션 페이지뷰 카운트 증가
 */
export async function incrementPageView(sessionId: string): Promise<void> {
    await updateDoc(doc(db, TRACKER_SESSION_COLLECTION, sessionId), {
        lastActivityAt: Timestamp.now(),
        pageViews: increment(1),
    });
}

/**
 * 세션 이벤트 카운트 증가
 */
export async function incrementEventCount(sessionId: string): Promise<void> {
    await updateDoc(doc(db, TRACKER_SESSION_COLLECTION, sessionId), {
        lastActivityAt: Timestamp.now(),
        events: increment(1),
    });
}

/**
 * 세션 종료 처리
 */
export async function endSession(sessionId: string): Promise<void> {
    await updateDoc(doc(db, TRACKER_SESSION_COLLECTION, sessionId), {
        endedAt: Timestamp.now(),
    });
}

/**
 * 세션에 userId 연결
 */
export async function linkUserToSession(
    sessionId: string,
    userId: string
): Promise<void> {
    await updateDoc(doc(db, TRACKER_SESSION_COLLECTION, sessionId), {
        userId,
        lastActivityAt: Timestamp.now(),
    });
}
