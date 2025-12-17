import {
    SESSION_STORAGE_KEY,
    SESSION_TIMEOUT_MS,
} from '@/components/FireTracker/settings';

interface StoredSession {
    id: string;
    lastActivityAt: number;
}

/**
 * 새 세션 ID 생성
 */
export function generateSessionId(): string {
    return `session_${crypto.randomUUID()}`;
}

/**
 * 현재 세션 정보 가져오기
 */
export function getStoredSession(): StoredSession | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) {
        return null;
    }

    try {
        return JSON.parse(stored) as StoredSession;
    } catch {
        return null;
    }
}

/**
 * 세션 정보 저장
 */
export function storeSession(session: StoredSession): void {
    if (typeof window === 'undefined') {
        return;
    }
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

/**
 * 세션 타임아웃 여부 확인
 */
export function isSessionExpired(lastActivityAt: number): boolean {
    return Date.now() - lastActivityAt > SESSION_TIMEOUT_MS;
}

/**
 * 현재 세션 ID 가져오기 (없거나 만료되면 null)
 */
export function getCurrentSessionId(): string | null {
    const stored = getStoredSession();

    if (!stored) {
        return null;
    }

    if (isSessionExpired(stored.lastActivityAt)) {
        return null;
    }

    return stored.id;
}

/**
 * 세션 활동 시간 업데이트
 */
export function updateSessionActivity(sessionId: string): void {
    storeSession({
        id: sessionId,
        lastActivityAt: Date.now(),
    });
}

/**
 * 새 세션 시작
 */
export function startNewSession(): string {
    const sessionId = generateSessionId();
    storeSession({
        id: sessionId,
        lastActivityAt: Date.now(),
    });
    return sessionId;
}
