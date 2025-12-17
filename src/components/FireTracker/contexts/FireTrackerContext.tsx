import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useCallback,
    useState,
} from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
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
    storeSession,
} from '@/components/FireTracker/utils';
import {
    createSession,
    createEvent,
    incrementPageView,
    incrementEventCount,
    linkUserToSession,
} from '@/components/FireTracker/api';

interface FireTrackerContextProps {
    trackEvent: (
        type: EventType,
        name: string,
        properties?: Record<string, unknown>
    ) => Promise<void>;
    trackPageView: () => Promise<void>;
    identify: (userId: string) => Promise<void>;
    session: FireTrackerSession | null;
}

const FireTrackerContext = createContext<FireTrackerContextProps>({
    trackEvent: async () => {},
    trackPageView: async () => {},
    identify: async () => {},
    session: null,
});

export function useFireTracker() {
    return useContext(FireTrackerContext);
}

interface FireTrackerProviderProps {
    children: ReactNode;
    enabled?: boolean;
}

export function FireTrackerProvider({
    children,
    enabled = true,
}: FireTrackerProviderProps) {
    const router = useRouter();
    const { user } = useFireAuth();
    const userId = user?.id;
    const [session, setSession] = useState<FireTrackerSession | null>(null);
    const initializedRef = useRef(false);

    console.log(userId);
    

    const initSession = useCallback(async () => {
        if (typeof window === 'undefined') return null;

        const existingSessionId = getCurrentSessionId();

        if (existingSessionId && session) {
            return session;
        }

        const visitorId = getOrCreateVisitorId();
        const sessionId = startNewSession();
        const utm = parseUTMParams();
        const { referrer, referrerDomain } = getReferrerInfo();
        const trafficSource = classifyTrafficSource(referrer, utm.utm_medium);
        const device = getDeviceInfo();

        const newSession = await createSession({
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

        setSession(newSession);

        await createEvent({
            sessionId,
            visitorId,
            userId,
            type: EVENT_TYPES.SESSION_START,
            name: 'session_start',
            page: window.location.pathname,
            pageTitle: document.title,
        });

        return newSession;
    }, [userId, session]);

    const trackPageView = useCallback(async () => {
        if (!enabled || typeof window === 'undefined') return;

        let sessionId = getCurrentSessionId();

        if (!sessionId) {
            const newSession = await initSession();
            sessionId = newSession?.id ?? null;
        } else {
            storeSession({ id: sessionId, lastActivityAt: Date.now() });
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

    const trackEvent = useCallback(
        async (
            type: EventType,
            name: string,
            properties?: Record<string, unknown>
        ) => {
            if (!enabled || typeof window === 'undefined') return;

            let sessionId = getCurrentSessionId();

            if (!sessionId) {
                const newSession = await initSession();
                sessionId = newSession?.id ?? null;
            } else {
                storeSession({ id: sessionId, lastActivityAt: Date.now() });
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

    const identify = useCallback(async (newUserId: string) => {
        const sessionId = getCurrentSessionId();
        if (!sessionId) return;

        await linkUserToSession(sessionId, newUserId);

        setSession((prev) =>
            prev ? { ...prev, userId: newUserId } : null
        );
    }, []);

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

    return (
        <FireTrackerContext.Provider
            value={{
                trackEvent,
                trackPageView,
                identify,
                session,
            }}
        >
            {children}
        </FireTrackerContext.Provider>
    );
}
