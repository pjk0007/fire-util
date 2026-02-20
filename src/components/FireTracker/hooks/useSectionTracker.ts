import { useEffect, useRef, useCallback } from 'react';
import { EVENT_TYPES } from '@/components/FireTracker/settings';
import { useTracker } from './useTracker';

export interface SectionTrackerOptions {
    sectionId: string;
    sectionName: string;
    sectionCategory: string;
    version: string;
    order: number;
    enabled?: boolean;
}

/**
 * 섹션 뷰 추적 훅
 * Intersection Observer를 사용하여 섹션이 뷰포트에 진입/이탈할 때 추적
 */
export function useSectionTracker(options: SectionTrackerOptions) {
    const {
        sectionId,
        sectionName,
        sectionCategory,
        version,
        order,
        enabled = true,
    } = options;

    const ref = useRef<HTMLDivElement>(null);
    const { trackEvent } = useTracker();

    // 타이머 관련 ref
    const startTimeRef = useRef<number | null>(null);
    const isVisibleRef = useRef(false);
    const hasTrackedRef = useRef(false);

    // 섹션 뷰 이벤트 전송
    const sendSectionViewEvent = useCallback(
        (dwellTime: number) => {
            trackEvent(EVENT_TYPES.SECTION_VIEW, sectionName, {
                sectionId,
                sectionCategory,
                version,
                order,
                dwellTime,
            });
        },
        [trackEvent, sectionName, sectionId, sectionCategory, version, order]
    );

    // 현재 체류시간 계산 및 이벤트 전송
    const trackCurrentDwellTime = useCallback(() => {
        if (isVisibleRef.current && startTimeRef.current !== null) {
            const dwellTime = Date.now() - startTimeRef.current;
            sendSectionViewEvent(dwellTime);
            startTimeRef.current = null;
            isVisibleRef.current = false;
        }
    }, [sendSectionViewEvent]);

    useEffect(() => {
        if (!enabled || typeof window === 'undefined' || !ref.current) return;

        const element = ref.current;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // 섹션이 뷰포트 중앙 50%에 진입
                        if (!isVisibleRef.current) {
                            startTimeRef.current = Date.now();
                            isVisibleRef.current = true;
                        }
                    } else {
                        // 섹션이 뷰포트에서 벗어남
                        if (isVisibleRef.current && startTimeRef.current !== null) {
                            const dwellTime = Date.now() - startTimeRef.current;
                            sendSectionViewEvent(dwellTime);
                            startTimeRef.current = null;
                            isVisibleRef.current = false;
                            hasTrackedRef.current = true;
                        }
                    }
                });
            },
            {
                // 뷰포트 중앙 50% 영역에서 감지
                rootMargin: '-25% 0px -25% 0px',
                threshold: 0,
            }
        );

        observer.observe(element);

        // 페이지 이탈 시 현재 보이는 섹션 체류시간 전송
        const handleBeforeUnload = () => {
            trackCurrentDwellTime();
        };

        // 탭 전환 시 처리
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // 탭이 숨겨짐 - 현재 체류시간 기록
                trackCurrentDwellTime();
            } else {
                // 탭이 다시 보임 - 새로운 타이머 시작
                if (ref.current) {
                    const rect = ref.current.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    const topThreshold = viewportHeight * 0.25;
                    const bottomThreshold = viewportHeight * 0.75;

                    // 섹션이 뷰포트 중앙 50%에 있는지 확인
                    if (rect.top < bottomThreshold && rect.bottom > topThreshold) {
                        startTimeRef.current = Date.now();
                        isVisibleRef.current = true;
                    }
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            observer.disconnect();
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);

            // 컴포넌트 언마운트 시 현재 체류시간 전송
            trackCurrentDwellTime();
        };
    }, [enabled, sendSectionViewEvent, trackCurrentDwellTime]);

    return { ref };
}
