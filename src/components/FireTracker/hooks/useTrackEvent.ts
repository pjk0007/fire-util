import { useCallback } from 'react';
import { EVENT_TYPES } from '@/components/FireTracker/settings';
import { useTracker } from './useTracker';

/**
 * 간편한 이벤트 추적 훅
 * 특정 이벤트 타입별로 미리 정의된 함수 제공
 */
export function useTrackEvent(userId?: string) {
    const { trackEvent, identify } = useTracker({ userId });

    const trackClick = useCallback(
        (name: string, properties?: Record<string, unknown>) => {
            trackEvent(EVENT_TYPES.CLICK, name, properties);
        },
        [trackEvent]
    );

    const trackFormSubmit = useCallback(
        (name: string, properties?: Record<string, unknown>) => {
            trackEvent(EVENT_TYPES.FORM_SUBMIT, name, properties);
        },
        [trackEvent]
    );

    const trackPurchase = useCallback(
        (properties: { amount: number; productId?: string; [key: string]: unknown }) => {
            trackEvent(EVENT_TYPES.PURCHASE, 'purchase', properties);
        },
        [trackEvent]
    );

    const trackCustom = useCallback(
        (name: string, properties?: Record<string, unknown>) => {
            trackEvent(EVENT_TYPES.CUSTOM, name, properties);
        },
        [trackEvent]
    );

    return {
        trackClick,
        trackFormSubmit,
        trackPurchase,
        trackCustom,
        identify,
    };
}
