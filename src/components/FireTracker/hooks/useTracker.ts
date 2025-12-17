import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {
    EventType,
    EVENT_TYPES,
    FireTrackerSession,
} from '@/components/FireTracker/settings';
import {
    parseUTMParams,
    getReferrerInfo,
    classifyTrafficSource,
    getDeviceInfo,
    getOrCreateVisitorId,
    getCurrentSessionId,
    startNewSession,
    updateSessionActivity,
} from '@/components/FireTracker/utils';
import {
    createSession,
    createEvent,
    incrementPageView,
    incrementEventCount,
    linkUserToSession,
} from '@/components/FireTracker/api';

interface UseTrackerOptions {
    userId?: string;
    enabled?: boolean;
}

export function useTracker(options: UseTrackerOptions = {}) {
    const { userId, enabled = true } = options;
    const router = useRouter();

    const sessionRef = useRef<FireTrackerSession | null>(null);
    const initializedRef = useRef(false);

    /**
     * 세션 초기화 (첫 진입 또는 세션 만료 시)
     */
    const initSession = useCallback(async () => {
        if (typeof window === 'undefined') return;

        const existingSessionId = getCurrentSessionId();

        // 이미 유효한 세션이 있으면 스킵
        if (existingSessionId && sessionRef.current) {
            return sessionRef.current;
        }

        const visitorId = getOrCreateVisitorId();
        const sessionId = startNewSession();
        const utm = parseUTMParams();
        const { referrer, referrerDomain } = getReferrerInfo();
        const trafficSource = classifyTrafficSource(referrer, utm.utm_medium);
        const device = getDeviceInfo();

        const session = await createSession({
            sessionId,
            visitorId,
            userId,
            utm,
            referrer,
            referrerDomain,
            trafficSource,
            landingPage: window.location.pathname,
            device,
        });

        sessionRef.current = session;

        // session_start 이벤트
        await createEvent({
            sessionId,
            visitorId,
            userId,
            type: EVENT_TYPES.SESSION_START,
            name: 'session_start',
            page: window.location.pathname,
            pageTitle: document.title,
        });

        return session;
    }, [userId]);

    /**
     * 페이지뷰 추적
     */
    const trackPageView = useCallback(async () => {
        if (!enabled || typeof window === 'undefined') return;

        let sessionId = getCurrentSessionId();

        // 세션이 없거나 만료되었으면 새로 생성
        if (!sessionId) {
            const session = await initSession();
            sessionId = session?.id ?? null;
        } else {
            // 기존 세션 활동 시간 업데이트
            updateSessionActivity(sessionId);
            await incrementPageView(sessionId);
        }

        if (!sessionId) return;

        const visitorId = getOrCreateVisitorId();

        await createEvent({
            sessionId,
            visitorId,
            userId,
            type: EVENT_TYPES.PAGE_VIEW,
            name: 'page_view',
            page: window.location.pathname,
            pageTitle: document.title,
        });
    }, [enabled, userId, initSession]);

    /**
     * 커스텀 이벤트 추적
     */
    const trackEvent = useCallback(
        async (
            type: EventType,
            name: string,
            properties?: Record<string, unknown>
        ) => {
            if (!enabled || typeof window === 'undefined') return;

            let sessionId = getCurrentSessionId();

            if (!sessionId) {
                const session = await initSession();
                sessionId = session?.id ?? null;
            } else {
                updateSessionActivity(sessionId);
                await incrementEventCount(sessionId);
            }

            if (!sessionId) return;

            const visitorId = getOrCreateVisitorId();

            await createEvent({
                sessionId,
                visitorId,
                userId,
                type,
                name,
                page: window.location.pathname,
                pageTitle: document.title,
                properties,
            });
        },
        [enabled, userId, initSession]
    );

    /**
     * 사용자 식별 (로그인 시 호출)
     */
    const identify = useCallback(
        async (newUserId: string) => {
            const sessionId = getCurrentSessionId();
            if (!sessionId) return;

            await linkUserToSession(sessionId, newUserId);

            if (sessionRef.current) {
                sessionRef.current.userId = newUserId;
            }
        },
        []
    );

    // 초기 세션 생성
    useEffect(() => {
        if (!enabled || initializedRef.current) return;

        initializedRef.current = true;
        initSession();
    }, [enabled, initSession]);

    // 페이지 이동 추적
    useEffect(() => {
        if (!enabled) return;

        const handleRouteChange = () => {
            trackPageView();
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [enabled, router.events, trackPageView]);

    return {
        trackEvent,
        trackPageView,
        identify,
        session: sessionRef.current,
    };
}
