import { FireTrackerSession, FireTrackerEvent } from '@/components/FireTracker/settings';
import type { VisitorJourney, ChannelBehaviorStats, ExitPageStats, EventStats, DeviceStats, DeviceType } from './types';

// 디바이스 타입 결정
function getDeviceType(session: FireTrackerSession): DeviceType {
    if (session.device.isMobile) return 'mobile';
    if (session.device.isTablet) return 'tablet';
    return 'pc';
}

// 세션 시간 계산 (초)
function getSessionDuration(session: FireTrackerSession): number {
    const start = session.startedAt.toMillis();
    const end = session.lastActivityAt.toMillis();
    return Math.max(0, Math.floor((end - start) / 1000));
}

// 세션에서 source/medium 추출 (organic 지원)
function getSourceMedium(session: FireTrackerSession): { source: string; medium: string } {
    // UTM이 있으면 UTM 사용
    if (session.utm?.utm_source && session.utm?.utm_medium) {
        return {
            source: session.utm.utm_source,
            medium: session.utm.utm_medium,
        };
    }

    // Organic 세션 (trafficSource=organic, UTM 없음, customParams 없음)
    if (
        session.trafficSource === 'organic' &&
        !session.hasUtm &&
        session.customParams === null &&
        session.referrerDomain
    ) {
        return {
            source: 'organic',
            medium: session.referrerDomain,
        };
    }

    // 기본값
    return {
        source: 'direct',
        medium: 'none',
    };
}

// visitorId 기반으로 세션과 이벤트를 묶어서 여정 생성
export function buildVisitorJourneys(
    sessions: FireTrackerSession[],
    events: FireTrackerEvent[]
): VisitorJourney[] {
    const visitorMap: Record<string, VisitorJourney> = {};

    // 세션을 visitorId로 그룹화
    sessions.forEach((session) => {
        const { visitorId } = session;
        const { source, medium } = getSourceMedium(session);

        if (!visitorMap[visitorId]) {
            visitorMap[visitorId] = {
                visitorId,
                sessions: [],
                events: [],
                source,
                medium,
                deviceType: getDeviceType(session),
                totalPageViews: 0,
                totalEvents: 0,
                totalDuration: 0,
                lastEventPage: null,
            };
        }

        visitorMap[visitorId].sessions.push(session);
        visitorMap[visitorId].totalPageViews += session.pageViews;
        visitorMap[visitorId].totalDuration += getSessionDuration(session);
    });

    // 이벤트를 visitorId로 매핑
    events.forEach((event) => {
        const journey = visitorMap[event.visitorId];
        if (journey) {
            journey.events.push(event);
            journey.totalEvents += 1;
        }
    });

    // 각 visitor의 마지막 이벤트 페이지 설정
    Object.values(visitorMap).forEach((journey) => {
        if (journey.events.length > 0) {
            // 시간순 정렬 후 마지막 이벤트
            const sortedEvents = journey.events.sort(
                (a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()
            );
            journey.lastEventPage = sortedEvents[0].page;
        } else if (journey.sessions.length > 0) {
            // 이벤트가 없으면 마지막 세션의 랜딩페이지
            const sortedSessions = journey.sessions.sort(
                (a, b) => b.startedAt.toMillis() - a.startedAt.toMillis()
            );
            journey.lastEventPage = sortedSessions[0].landingPage;
        }
    });

    return Object.values(visitorMap);
}

// 채널별 행동 통계 계산
export function calculateChannelStats(journeys: VisitorJourney[]): ChannelBehaviorStats[] {
    const channelMap: Record<string, {
        visitorCount: number;
        signedUpCount: number;
        totalPageViews: number;
        totalEvents: number;
        totalDuration: number;
    }> = {};

    journeys.forEach((journey) => {
        const key = `${journey.source}|${journey.medium}`;

        if (!channelMap[key]) {
            channelMap[key] = {
                visitorCount: 0,
                signedUpCount: 0,
                totalPageViews: 0,
                totalEvents: 0,
                totalDuration: 0,
            };
        }

        channelMap[key].visitorCount++;
        channelMap[key].totalPageViews += journey.totalPageViews;
        channelMap[key].totalEvents += journey.totalEvents;
        channelMap[key].totalDuration += journey.totalDuration;

        // 이벤트 중 signup이 있으면 회원가입한 것으로 간주
        if (journey.events.some(e => e.name === 'signup')) {
            channelMap[key].signedUpCount++;
        }
    });

    return Object.entries(channelMap)
        .map(([key, stats]) => {
            const [source, medium] = key.split('|');
            return {
                source,
                medium,
                visitorCount: stats.visitorCount,
                signedUpCount: stats.signedUpCount,
                signUpRate: Math.round((stats.signedUpCount / stats.visitorCount) * 1000) / 10,
                avgPageViews: Math.round((stats.totalPageViews / stats.visitorCount) * 10) / 10,
                avgEvents: Math.round((stats.totalEvents / stats.visitorCount) * 10) / 10,
                avgDuration: Math.round(stats.totalDuration / stats.visitorCount),
            };
        })
        .sort((a, b) => b.visitorCount - a.visitorCount);
}

// 이탈 페이지 통계 계산
export function calculateExitPageStats(journeys: VisitorJourney[]): ExitPageStats[] {
    const pageMap: Record<string, number> = {};
    let totalWithExitPage = 0;

    journeys.forEach((journey) => {
        if (journey.lastEventPage) {
            pageMap[journey.lastEventPage] = (pageMap[journey.lastEventPage] || 0) + 1;
            totalWithExitPage++;
        }
    });

    return Object.entries(pageMap)
        .map(([page, count]) => ({
            page,
            count,
            percentage: Math.round((count / totalWithExitPage) * 1000) / 10,
        }))
        .sort((a, b) => b.count - a.count);
}

// 특정 채널의 이탈 페이지 통계 계산
export function calculateChannelExitPages(
    journeys: VisitorJourney[],
    source: string,
    medium: string
): ExitPageStats[] {
    const filteredJourneys = journeys.filter(
        (j) => j.source === source && j.medium === medium
    );
    return calculateExitPageStats(filteredJourneys);
}

// 특정 채널의 이벤트 통계 계산
export function calculateChannelEventStats(
    journeys: VisitorJourney[],
    source: string,
    medium: string
): EventStats[] {
    const filteredJourneys = journeys.filter(
        (j) => j.source === source && j.medium === medium
    );

    const eventMap: Record<string, number> = {};
    let totalEvents = 0;

    filteredJourneys.forEach((journey) => {
        journey.events.forEach((event) => {
            eventMap[event.name] = (eventMap[event.name] || 0) + 1;
            totalEvents++;
        });
    });

    return Object.entries(eventMap)
        .map(([name, count]) => ({
            name,
            count,
            percentage: totalEvents > 0 ? Math.round((count / totalEvents) * 1000) / 10 : 0,
        }))
        .sort((a, b) => b.count - a.count);
}

// 디바이스별 통계 계산
export function calculateDeviceStats(journeys: VisitorJourney[]): DeviceStats[] {
    const deviceMap: Record<DeviceType, {
        visitorCount: number;
        signedUpCount: number;
        totalPageViews: number;
        totalEvents: number;
        totalDuration: number;
    }> = {
        mobile: { visitorCount: 0, signedUpCount: 0, totalPageViews: 0, totalEvents: 0, totalDuration: 0 },
        tablet: { visitorCount: 0, signedUpCount: 0, totalPageViews: 0, totalEvents: 0, totalDuration: 0 },
        pc: { visitorCount: 0, signedUpCount: 0, totalPageViews: 0, totalEvents: 0, totalDuration: 0 },
    };

    journeys.forEach((journey) => {
        const device = journey.deviceType;
        deviceMap[device].visitorCount++;
        deviceMap[device].totalPageViews += journey.totalPageViews;
        deviceMap[device].totalEvents += journey.totalEvents;
        deviceMap[device].totalDuration += journey.totalDuration;

        // 이벤트 중 signup이 있으면 회원가입한 것으로 간주
        if (journey.events.some(e => e.name === 'signup')) {
            deviceMap[device].signedUpCount++;
        }
    });

    const deviceOrder: DeviceType[] = ['pc', 'mobile', 'tablet'];

    return deviceOrder
        .map((deviceType) => {
            const stats = deviceMap[deviceType];
            return {
                deviceType,
                visitorCount: stats.visitorCount,
                signedUpCount: stats.signedUpCount,
                signUpRate: stats.visitorCount > 0
                    ? Math.round((stats.signedUpCount / stats.visitorCount) * 1000) / 10
                    : 0,
                avgPageViews: stats.visitorCount > 0
                    ? Math.round((stats.totalPageViews / stats.visitorCount) * 10) / 10
                    : 0,
                avgEvents: stats.visitorCount > 0
                    ? Math.round((stats.totalEvents / stats.visitorCount) * 10) / 10
                    : 0,
                avgDuration: stats.visitorCount > 0
                    ? Math.round(stats.totalDuration / stats.visitorCount)
                    : 0,
            };
        });
}
