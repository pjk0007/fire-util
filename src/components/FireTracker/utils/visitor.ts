import { VISITOR_ID_STORAGE_KEY } from '@/components/FireTracker/settings';

/**
 * 새 visitorId 생성
 */
export function generateVisitorId(): string {
    return crypto.randomUUID();
}

/**
 * localStorage에서 visitorId 가져오기 (없으면 생성)
 */
export function getOrCreateVisitorId(): string {
    if (typeof window === 'undefined') {
        return generateVisitorId();
    }

    let visitorId = localStorage.getItem(VISITOR_ID_STORAGE_KEY);

    if (!visitorId) {
        visitorId = generateVisitorId();
        localStorage.setItem(VISITOR_ID_STORAGE_KEY, visitorId);
    }

    return visitorId;
}

/**
 * visitorId 존재 여부 확인
 */
export function hasVisitorId(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    return localStorage.getItem(VISITOR_ID_STORAGE_KEY) !== null;
}
