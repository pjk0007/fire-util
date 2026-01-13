import { useMemo } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useSessions, useEvents } from '@/components/FireTracker/hooks';
import type { FireTrackerSession, FireTrackerEvent } from '@/components/FireTracker/settings';
import { formatDuration } from './formatDuration';

interface VisitorTimelineDialogProps {
    visitorId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type TimelineItem = {
    type: 'session_start' | 'session_end' | 'event';
    timestamp: Date;
    data: FireTrackerSession | FireTrackerEvent;
};

export function VisitorTimelineDialog({
    visitorId,
    open,
    onOpenChange,
}: VisitorTimelineDialogProps) {
    // visitorId로 모든 세션 조회 (isFirstVisit 필터 없이)
    const { data: sessions = [], isLoading: isSessionsLoading } = useSessions({
        visitorId,
        enabled: open && !!visitorId,
    });

    // visitorId로 모든 이벤트 조회
    const { data: events = [], isLoading: isEventsLoading } = useEvents({
        visitorIds: [visitorId],
        enabled: open && !!visitorId,
    });

    const isLoading = isSessionsLoading || isEventsLoading;

    // 세션과 이벤트를 시간순으로 정렬하여 타임라인 생성
    const timeline = useMemo(() => {
        const items: TimelineItem[] = [];

        // 세션 시작/종료 추가
        sessions.forEach((session) => {
            items.push({
                type: 'session_start',
                timestamp: session.startedAt.toDate(),
                data: session,
            });
            items.push({
                type: 'session_end',
                timestamp: session.lastActivityAt.toDate(),
                data: session,
            });
        });

        // 이벤트 추가
        events.forEach((event) => {
            items.push({
                type: 'event',
                timestamp: event.timestamp.toDate(),
                data: event,
            });
        });

        // 시간순 정렬
        return items.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }, [sessions, events]);

    // 총 체류시간 계산
    const totalDuration = useMemo(() => {
        return sessions.reduce((sum, session) => {
            const start = session.startedAt.toMillis();
            const end = session.lastActivityAt.toMillis();
            return sum + Math.max(0, Math.floor((end - start) / 1000));
        }, 0);
    }, [sessions]);

    // 첫 세션 정보
    const firstSession = sessions.length > 0
        ? sessions.reduce((oldest, s) =>
            s.startedAt.toMillis() < oldest.startedAt.toMillis() ? s : oldest
        )
        : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>방문자 타임라인</span>
                        <Badge variant="secondary" className="font-mono text-xs">
                            {visitorId.slice(0, 8)}...
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-8 text-center text-muted-foreground">
                        로딩 중...
                    </div>
                ) : (
                    <div className="mt-4 space-y-4">
                        {/* 요약 정보 */}
                        <div className="grid grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg text-sm">
                            <div>
                                <div className="text-muted-foreground">세션 수</div>
                                <div className="font-medium">{sessions.length}회</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground">이벤트 수</div>
                                <div className="font-medium">{events.length}회</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground">총 체류시간</div>
                                <div className="font-medium">{formatDuration(totalDuration)}</div>
                            </div>
                        </div>

                        {/* 유입 정보 */}
                        {firstSession && (
                            <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-2">
                                <div className="text-muted-foreground font-medium">유입 정보</div>
                                {/* UTM */}
                                {firstSession.hasUtm && firstSession.utm && (
                                    <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">UTM</div>
                                        <div className="flex flex-wrap gap-1">
                                            {firstSession.utm.utm_source && (
                                                <Badge variant="secondary" className="text-xs">
                                                    source: {firstSession.utm.utm_source}
                                                </Badge>
                                            )}
                                            {firstSession.utm.utm_medium && (
                                                <Badge variant="secondary" className="text-xs">
                                                    medium: {firstSession.utm.utm_medium}
                                                </Badge>
                                            )}
                                            {firstSession.utm.utm_campaign && (
                                                <Badge variant="secondary" className="text-xs">
                                                    campaign: {firstSession.utm.utm_campaign}
                                                </Badge>
                                            )}
                                            {firstSession.utm.utm_term && (
                                                <Badge variant="secondary" className="text-xs">
                                                    term: {firstSession.utm.utm_term}
                                                </Badge>
                                            )}
                                            {firstSession.utm.utm_content && (
                                                <Badge variant="secondary" className="text-xs">
                                                    content: {firstSession.utm.utm_content}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {/* Custom Params */}
                                {firstSession.customParams && Object.keys(firstSession.customParams).length > 0 && (
                                    <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">Custom Params</div>
                                        <div className="flex flex-wrap gap-1">
                                            {Object.entries(firstSession.customParams).map(([key, value]) => (
                                                <Badge key={key} variant="outline" className="text-xs">
                                                    {key}: {value}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Referrer */}
                                {firstSession.referrerDomain && (
                                    <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">Referrer</div>
                                        <div className="font-medium">{firstSession.referrerDomain}</div>
                                        {firstSession.referrer && firstSession.referrer !== firstSession.referrerDomain && (
                                            <div className="text-xs text-muted-foreground truncate" title={firstSession.referrer}>
                                                {firstSession.referrer}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* Direct (no referrer, no utm, no custom params) */}
                                {!firstSession.hasUtm && !firstSession.customParams && !firstSession.referrerDomain && (
                                    <div className="text-muted-foreground">직접 유입 (Direct)</div>
                                )}
                            </div>
                        )}

                        {/* 타임라인 */}
                        {timeline.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                타임라인 데이터가 없습니다
                            </div>
                        ) : (
                            <div className="relative pl-6 space-y-0">
                                {/* 세로선 */}
                                <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />

                                {timeline.map((item, index) => (
                                    <div key={index} className="relative pb-4">
                                        {/* 점 */}
                                        <div
                                            className={`absolute -left-4 w-3 h-3 rounded-full border-2 bg-background ${
                                                item.type === 'session_start'
                                                    ? 'border-green-500'
                                                    : item.type === 'session_end'
                                                    ? 'border-red-500'
                                                    : 'border-blue-500'
                                            }`}
                                        />

                                        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                                            {/* 시간 */}
                                            <div className="text-xs text-muted-foreground whitespace-nowrap min-w-[120px]">
                                                {format(item.timestamp, 'MM/dd HH:mm:ss', { locale: ko })}
                                            </div>

                                            {/* 내용 */}
                                            <div className="flex-1">
                                                {item.type === 'session_start' && (
                                                    <div className="text-sm">
                                                        <Badge variant="outline" className="text-green-600 border-green-300">
                                                            세션 시작
                                                        </Badge>
                                                        <span className="ml-2 text-muted-foreground">
                                                            {(item.data as FireTrackerSession).landingPage}
                                                        </span>
                                                    </div>
                                                )}
                                                {item.type === 'session_end' && (
                                                    <div className="text-sm">
                                                        <Badge variant="outline" className="text-red-600 border-red-300">
                                                            세션 종료
                                                        </Badge>
                                                        <span className="ml-2 text-muted-foreground">
                                                            페이지뷰: {(item.data as FireTrackerSession).pageViews}
                                                        </span>
                                                    </div>
                                                )}
                                                {item.type === 'event' && (
                                                    <div className="text-sm">
                                                        <Badge variant="outline" className="text-blue-600 border-blue-300">
                                                            {(item.data as FireTrackerEvent).name}
                                                        </Badge>
                                                        <span className="ml-2 text-muted-foreground">
                                                            {(item.data as FireTrackerEvent).page}
                                                        </span>
                                                        {(item.data as FireTrackerEvent).properties && (
                                                            <div className="mt-1 text-xs text-muted-foreground bg-muted p-2 rounded">
                                                                {JSON.stringify((item.data as FireTrackerEvent).properties, null, 2)}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
