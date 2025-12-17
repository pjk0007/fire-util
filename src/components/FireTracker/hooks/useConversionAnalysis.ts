import { useMemo } from 'react';
import { FireTrackerSession, FireTrackerEvent } from '@/components/FireTracker/settings';

export type GroupingCriteria = 'utm_source_medium' | 'landing_page' | 'device' | 'traffic_source';
export type ConversionGoal = 'signup' | 'purchase' | 'page_visit' | 'custom_event';

interface ConversionConfig {
    groupBy: GroupingCriteria;
    goal: ConversionGoal;
    goalValue?: string; // 특정 페이지 URL 또는 이벤트 이름
}

interface ConversionResult {
    group: string;
    totalVisitors: number;
    convertedVisitors: number;
    conversionRate: number;
}

interface VisitorData {
    visitorId: string;
    firstSession: FireTrackerSession;
    events: FireTrackerEvent[];
    hasConverted: boolean;
}

function getGroupKey(session: FireTrackerSession, groupBy: GroupingCriteria): string {
    switch (groupBy) {
        case 'utm_source_medium': {
            const source = session.utm?.utm_source || '(direct)';
            const medium = session.utm?.utm_medium || '(none)';
            return `${source} / ${medium}`;
        }
        case 'landing_page':
            return session.landingPage || '(unknown)';
        case 'device':
            if (session.device.isMobile) return 'Mobile';
            if (session.device.isTablet) return 'Tablet';
            return 'Desktop';
        case 'traffic_source':
            return session.trafficSource || 'unknown';
        default:
            return 'unknown';
    }
}

function checkConversion(
    events: FireTrackerEvent[],
    goal: ConversionGoal,
    goalValue?: string
): boolean {
    switch (goal) {
        case 'signup':
            // userId가 있는 이벤트가 있으면 회원가입 전환
            return events.some((e) => e.userId !== null);
        case 'purchase':
            return events.some((e) => e.type === 'purchase');
        case 'page_visit':
            if (!goalValue) return false;
            return events.some((e) => e.type === 'page_view' && e.page.includes(goalValue));
        case 'custom_event':
            if (!goalValue) return false;
            return events.some((e) => e.type === 'custom' && e.name === goalValue);
        default:
            return false;
    }
}

export function useConversionAnalysis(
    sessions: FireTrackerSession[] | undefined,
    events: FireTrackerEvent[] | undefined,
    config: ConversionConfig
): ConversionResult[] {
    return useMemo(() => {
        if (!sessions?.length || !events?.length) return [];

        // 1. visitorId별로 세션과 이벤트를 그룹화
        const visitorMap = new Map<string, VisitorData>();

        // 세션을 시간순으로 정렬 (오래된 것부터)
        const sortedSessions = [...sessions].sort(
            (a, b) => a.startedAt.toMillis() - b.startedAt.toMillis()
        );

        // 각 visitor의 첫 번째 세션 찾기
        sortedSessions.forEach((session) => {
            if (!visitorMap.has(session.visitorId)) {
                visitorMap.set(session.visitorId, {
                    visitorId: session.visitorId,
                    firstSession: session,
                    events: [],
                    hasConverted: false,
                });
            }
        });

        // 이벤트를 visitor에 매핑
        events.forEach((event) => {
            const visitor = visitorMap.get(event.visitorId);
            if (visitor) {
                visitor.events.push(event);
            }
        });

        // 2. 전환 여부 체크
        visitorMap.forEach((visitor) => {
            visitor.hasConverted = checkConversion(
                visitor.events,
                config.goal,
                config.goalValue
            );
        });

        // 3. 그룹별로 집계
        const groupMap = new Map<string, { total: number; converted: number }>();

        visitorMap.forEach((visitor) => {
            const groupKey = getGroupKey(visitor.firstSession, config.groupBy);

            if (!groupMap.has(groupKey)) {
                groupMap.set(groupKey, { total: 0, converted: 0 });
            }

            const group = groupMap.get(groupKey)!;
            group.total += 1;
            if (visitor.hasConverted) {
                group.converted += 1;
            }
        });

        // 4. 결과 배열 생성
        const results: ConversionResult[] = [];
        groupMap.forEach((value, key) => {
            results.push({
                group: key,
                totalVisitors: value.total,
                convertedVisitors: value.converted,
                conversionRate: value.total > 0
                    ? (value.converted / value.total) * 100
                    : 0,
            });
        });

        // 전환율 기준으로 정렬
        results.sort((a, b) => b.conversionRate - a.conversionRate);

        return results;
    }, [sessions, events, config]);
}
