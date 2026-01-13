import { FireTrackerSession } from '@/components/FireTracker/settings';
import type { ParamStats, DeviceStats, DeviceType, MultiVisitVisitor } from './types';

export function getDeviceType(session: FireTrackerSession): DeviceType {
    if (session.device.isMobile) return 'mobile';
    if (session.device.isTablet) return 'tablet';
    return 'pc';
}

export function aggregateDeviceStats(sessions: FireTrackerSession[]): DeviceStats[] {
    const deviceMap: Record<DeviceType, number> = {
        pc: 0,
        mobile: 0,
        tablet: 0,
    };

    sessions.forEach((s) => {
        const deviceType = getDeviceType(s);
        deviceMap[deviceType]++;
    });

    const total = sessions.length;
    const deviceOrder: DeviceType[] = ['pc', 'mobile', 'tablet'];

    return deviceOrder
        .map((deviceType) => ({
            deviceType,
            count: deviceMap[deviceType],
            percentage: total > 0 ? Math.round((deviceMap[deviceType] / total) * 1000) / 10 : 0,
        }))
        .filter((s) => s.count > 0);
}

export function aggregateParamStats(sessions: FireTrackerSession[]) {
    const utmDetails: Record<string, Record<string, number>> = {};
    const customParams: Record<string, Record<string, number>> = {};

    sessions.forEach((s) => {
        if (s.utm) {
            (['utm_campaign', 'utm_content', 'utm_term'] as const).forEach((key) => {
                const value = s.utm[key];
                if (value) {
                    utmDetails[key] = utmDetails[key] || {};
                    utmDetails[key][value] = (utmDetails[key][value] || 0) + 1;
                }
            });
        }

        if (s.customParams) {
            Object.entries(s.customParams).forEach(([key, value]) => {
                customParams[key] = customParams[key] || {};
                customParams[key][value] = (customParams[key][value] || 0) + 1;
            });
        }
    });

    const format = (obj: Record<string, Record<string, number>>): ParamStats[] =>
        Object.entries(obj).map(([key, values]) => ({
            key,
            values: Object.entries(values).sort(([, a], [, b]) => b - a),
        }));

    return { utmDetails: format(utmDetails), customParams: format(customParams) };
}

// 2번 이상 유입된 방문자 집계
export function aggregateMultiVisitVisitors(sessions: FireTrackerSession[]): MultiVisitVisitor[] {
    const visitorMap: Record<string, FireTrackerSession[]> = {};

    sessions.forEach((s) => {
        if (!visitorMap[s.visitorId]) {
            visitorMap[s.visitorId] = [];
        }
        visitorMap[s.visitorId].push(s);
    });

    return Object.entries(visitorMap)
        .filter(([, sessions]) => sessions.length >= 2)
        .map(([visitorId, sessions]) => {
            // 채널별 집계
            const channelMap: Record<string, number> = {};
            sessions.forEach((s) => {
                const source = s.utm?.utm_source || 'direct';
                const medium = s.utm?.utm_medium || 'none';
                const key = `${source}|${medium}`;
                channelMap[key] = (channelMap[key] || 0) + 1;
            });

            const channels = Object.entries(channelMap)
                .map(([key, count]) => {
                    const [source, medium] = key.split('|');
                    return { source, medium, count };
                })
                .sort((a, b) => b.count - a.count);

            // 시간순 정렬
            const sortedSessions = sessions.sort(
                (a, b) => a.startedAt.toMillis() - b.startedAt.toMillis()
            );

            return { visitorId, sessions: sortedSessions, channels };
        })
        .sort((a, b) => b.sessions.length - a.sessions.length);
}
