import { FireTrackerSession, FireTrackerEvent } from '@/components/FireTracker/settings';

export type DeviceType = 'mobile' | 'tablet' | 'pc';

// visitorId 기반으로 세션들과 이벤트들을 묶은 구조
export interface VisitorJourney {
    visitorId: string;
    sessions: FireTrackerSession[];
    events: FireTrackerEvent[];
    // 첫 세션의 UTM 정보
    source: string;
    medium: string;
    // 디바이스 타입 (첫 세션 기준)
    deviceType: DeviceType;
    // 집계
    totalPageViews: number;
    totalEvents: number;
    totalDuration: number; // 총 세션 시간 (초)
    // 마지막 이벤트 페이지 (이탈 위치)
    lastEventPage: string | null;
}

// 채널별 행동 통계
export interface ChannelBehaviorStats {
    source: string;
    medium: string;
    visitorCount: number;
    signedUpCount: number;
    signUpRate: number; // 회원가입 전환율 (%)
    avgPageViews: number;
    avgEvents: number;
    avgDuration: number; // 평균 세션 시간 (초)
}

// 이탈 페이지 통계
export interface ExitPageStats {
    page: string;
    count: number;
    percentage: number;
}

// 이벤트 통계
export interface EventStats {
    name: string;
    count: number;
    percentage: number;
}

// 디바이스별 통계
export interface DeviceStats {
    deviceType: DeviceType;
    visitorCount: number;
    signedUpCount: number;
    signUpRate: number;
    avgPageViews: number;
    avgEvents: number;
    avgDuration: number; // 평균 세션 시간 (초)
}
