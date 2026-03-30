import { FireTrackerSession } from '@/components/FireTracker/settings';

export type DeviceType = 'mobile' | 'tablet' | 'pc';

export interface CampaignGroup {
    source: string;
    medium: string;
    count: number;
    sessions: FireTrackerSession[];
}

export interface ParamStats {
    key: string;
    values: [string, number][];
}

export interface DeviceStats {
    deviceType: DeviceType;
    count: number;
    percentage: number;
}

// 여러 번 유입된 방문자
export interface MultiVisitVisitor {
    visitorId: string;
    sessions: FireTrackerSession[];
    channels: { source: string; medium: string; count: number }[];
}
