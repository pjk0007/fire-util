import { Timestamp } from 'firebase/firestore';
import {
    UTM_PARAMS,
    EVENT_TYPES,
    TRAFFIC_SOURCES,
} from '@/components/FireTracker/settings/constants';

// UTM Parameters
export type UTMParam = (typeof UTM_PARAMS)[number];
export type UTMData = Partial<Record<UTMParam, string>>;

// Event & Traffic Types
export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];
export type TrafficSource =
    (typeof TRAFFIC_SOURCES)[keyof typeof TRAFFIC_SOURCES];

// Device Information
export interface DeviceInfo {
    userAgent: string;
    language: string;
    platform: string;
    screenWidth: number;
    screenHeight: number;
    isMobile: boolean;
    isTablet: boolean;
}

// Session
export interface FireTrackerSession {
    id: string;
    visitorId: string;
    userId: string | null; // 로그인 후 연결
    startedAt: Timestamp;
    endedAt?: Timestamp;
    lastActivityAt: Timestamp;

    // 유입 정보
    utm: UTMData;
    hasUtm: boolean; // UTM 파라미터 존재 여부 (Firestore 쿼리용)
    customParams: Record<string, string> | null; // UTM 외 커스텀 파라미터
    referrer: string | null;
    referrerDomain: string | null;
    trafficSource: TrafficSource;
    landingPage: string;
    isFirstVisit: boolean; // 해당 visitorId의 첫 세션 여부

    // 디바이스 정보
    device: DeviceInfo;

    // 세션 통계
    pageViews: number;
    events: number;
}

// Event
export interface FireTrackerEvent {
    id: string;
    sessionId: string;
    visitorId: string;
    userId: string | null;
    type: EventType;
    name: string;
    timestamp: Timestamp;

    // 페이지 정보
    page: string;
    pageTitle: string;

    // 커스텀 데이터
    properties: Record<string, unknown> | null;
}

// Visitor (장기 추적용)
export interface FireTrackerVisitor {
    id: string;
    firstSeenAt: Timestamp;
    lastSeenAt: Timestamp;
    userId?: string;
    totalSessions: number;
    totalPageViews: number;
    totalEvents: number;
}
