import type { FireTrackerEvent } from '@/components/FireTracker/settings';

// 전환 단계 정의
export interface FunnelStage {
    id: number;
    name: string;
    description: string;
    // 이 단계에 해당하는지 판단하는 함수
    matcher: (events: FireTrackerEvent[]) => boolean;
}

// 기본 전환 단계 정의
export const DEFAULT_FUNNEL_STAGES: FunnelStage[] = [
    {
        id: 0,
        name: '방문',
        description: '사이트 방문',
        matcher: () => true, // 모든 방문자
    },
    {
        id: 1,
        name: '로그인 페이지 / 도입 상담 팝업',
        description:
            '로그인/회원가입 페이지 방문 또는 도입 상담 신청 팝업 열기',
        matcher: (events) =>
            events.some(
                (e) =>
                    e.type === 'page_view' &&
                    (e.page === '/login/' ||
                        e.page === '/signup/' ||
                        e.name === 'open_consultation_dialog')
            ),
    },
    {
        id: 2,
        name: '회원가입 완료 / 도입 상담 완료',
        description: '회원가입 완료 또는 도입 상담 완료',
        matcher: (events) =>
            events.some(
                (e) =>
                    e.name === 'signup' || e.name === 'consultation_form_submit'
            ),
    },
    {
        id: 3,
        name: '구독신청 작성중',
        description: '구독신청 폼 작성 중',
        matcher: (events) => events.some((e) => e.name === 'request_form_next'),
    },
    {
        id: 4,
        name: '구독신청 완료',
        description: '구독신청 제출 완료',
        matcher: (events) => events.some((e) => e.name === 'request_form'),
    },
];

// 방문자의 전환 단계 (가장 높은 단계)
export interface VisitorFunnelStatus {
    visitorId: string;
    stage: number; // 도달한 최고 단계
    events: FireTrackerEvent[];
}

// 퍼널 통계
export interface FunnelStats {
    stageId: number;
    stageName: string;
    stageDescription: string;
    visitorCount: number;
    percentage: number; // 전체 대비 비율
    conversionRate: number; // 이전 단계 대비 전환율
}

// 채널별 퍼널 통계
export interface ChannelFunnelStats {
    source: string;
    medium: string;
    visitorCount: number;
    stageStats: {
        stageId: number;
        count: number;
        percentage: number;
    }[];
}
