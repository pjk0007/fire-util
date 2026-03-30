import type { FireTrackerEvent } from '@/components/FireTracker/settings';
import type {
    FunnelStage,
    VisitorFunnelStatus,
    FunnelStats,
    ChannelFunnelStats,
    DEFAULT_FUNNEL_STAGES,
} from './types';
import type { VisitorJourney } from '../Behavior/types';

/**
 * 방문자의 최고 도달 단계를 계산
 */
export function getVisitorMaxStage(
    events: FireTrackerEvent[],
    stages: FunnelStage[]
): number {
    let maxStage = 0;

    for (const stage of stages) {
        if (stage.matcher(events)) {
            maxStage = Math.max(maxStage, stage.id);
        }
    }

    return maxStage;
}

/**
 * 여정 목록에서 각 방문자의 퍼널 상태를 계산
 */
export function calculateVisitorFunnelStatuses(
    journeys: VisitorJourney[],
    stages: FunnelStage[]
): VisitorFunnelStatus[] {
    return journeys.map((journey) => ({
        visitorId: journey.visitorId,
        stage: getVisitorMaxStage(journey.events, stages),
        events: journey.events,
    }));
}

/**
 * 퍼널 통계 계산 (각 단계별 방문자 수, 비율, 전환율)
 */
export function calculateFunnelStats(
    journeys: VisitorJourney[],
    stages: FunnelStage[]
): FunnelStats[] {
    const totalVisitors = journeys.length;
    if (totalVisitors === 0) {
        return stages.map((stage) => ({
            stageId: stage.id,
            stageName: stage.name,
            stageDescription: stage.description,
            visitorCount: 0,
            percentage: 0,
            conversionRate: 0,
        }));
    }

    // 각 단계에 도달한 방문자 수 계산 (해당 단계 이상에 도달한 방문자)
    const stageCounts: number[] = stages.map(() => 0);

    journeys.forEach((journey) => {
        const maxStage = getVisitorMaxStage(journey.events, stages);
        // 해당 단계까지의 모든 단계에 카운트
        for (let i = 0; i <= maxStage; i++) {
            stageCounts[i]++;
        }
    });

    return stages.map((stage, index) => {
        const visitorCount = stageCounts[index];
        const percentage =
            totalVisitors > 0 ? (visitorCount / totalVisitors) * 100 : 0;
        const prevCount = index > 0 ? stageCounts[index - 1] : totalVisitors;
        const conversionRate =
            prevCount > 0 ? (visitorCount / prevCount) * 100 : 0;

        return {
            stageId: stage.id,
            stageName: stage.name,
            stageDescription: stage.description,
            visitorCount,
            percentage,
            conversionRate,
        };
    });
}

/**
 * 채널별 퍼널 통계 계산
 */
export function calculateChannelFunnelStats(
    journeys: VisitorJourney[],
    stages: FunnelStage[]
): ChannelFunnelStats[] {
    // 채널별로 그룹화
    const channelMap = new Map<
        string,
        { source: string; medium: string; journeys: VisitorJourney[] }
    >();

    journeys.forEach((journey) => {
        const key = `${journey.source}|${journey.medium}`;
        if (!channelMap.has(key)) {
            channelMap.set(key, {
                source: journey.source,
                medium: journey.medium,
                journeys: [],
            });
        }
        channelMap.get(key)!.journeys.push(journey);
    });

    // 각 채널별 퍼널 통계 계산
    const result: ChannelFunnelStats[] = [];

    channelMap.forEach(({ source, medium, journeys: channelJourneys }) => {
        const visitorCount = channelJourneys.length;

        // 각 단계별 카운트
        const stageCounts: number[] = stages.map(() => 0);

        channelJourneys.forEach((journey) => {
            const maxStage = getVisitorMaxStage(journey.events, stages);
            for (let i = 0; i <= maxStage; i++) {
                stageCounts[i]++;
            }
        });

        const stageStats = stages.map((stage, index) => ({
            stageId: stage.id,
            count: stageCounts[index],
            percentage:
                visitorCount > 0
                    ? (stageCounts[index] / visitorCount) * 100
                    : 0,
        }));

        result.push({
            source,
            medium,
            visitorCount,
            stageStats,
        });
    });

    // 방문자 수 기준 정렬
    return result.sort((a, b) => b.visitorCount - a.visitorCount);
}
