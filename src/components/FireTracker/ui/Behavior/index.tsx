import { useMemo, useState } from 'react';
import {
    startOfDay,
    endOfDay,
    subDays,
    subMonths,
    startOfWeek,
    startOfMonth,
    format,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useSessions, useEvents } from '@/components/FireTracker/hooks';
import { ChannelBehaviorTable } from './ChannelBehaviorTable';
import { ChannelExitDialog } from './ChannelExitDialog';
import { DeviceStatsCard } from './DeviceStatsCard';
import { ExitPageTable } from './ExitPageTable';
import { VisitorTimelineDialog } from './VisitorTimelineDialog';
import {
    buildVisitorJourneys,
    calculateChannelStats,
    calculateChannelExitPages,
    calculateChannelEventStats,
    calculateDeviceStats,
    calculateExitPageStats,
} from './utils';

type PresetPeriod = 'today' | 'week' | 'month' | 'custom';

export default function BehaviorTab() {
    const [preset, setPreset] = useState<PresetPeriod>('month');
    const [customRange, setCustomRange] = useState<{
        from: Date;
        to: Date;
    } | null>(null);
    const [selectedChannelKey, setSelectedChannelKey] = useState<string | null>(
        null
    );
    const [visitorIdInput, setVisitorIdInput] = useState('');
    const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);

    const now = useMemo(() => new Date(), []);

    const getDateRange = () => {
        switch (preset) {
            case 'today':
                return { startDate: startOfDay(now), endDate: endOfDay(now) };
            case 'week':
                return {
                    startDate: startOfWeek(now, { locale: ko }),
                    endDate: endOfDay(now),
                };
            case 'month':
                return { startDate: startOfMonth(now), endDate: endOfDay(now) };
            case 'custom':
                if (customRange) {
                    return {
                        startDate: startOfDay(customRange.from),
                        endDate: endOfDay(customRange.to),
                    };
                }
                return { startDate: startOfDay(now), endDate: endOfDay(now) };
        }
    };

    const { startDate, endDate } = getDateRange();

    // UTM이 있는 첫 방문 세션 조회
    const { data: utmSessions = [], isLoading: isUtmSessionsLoading } =
        useSessions({
            startDate,
            endDate,
            hasUtm: true,
            isFirstVisit: true,
        });

    // 모든 첫 방문 세션 (organic 필터링용)
    const { data: allSessions = [], isLoading: isAllSessionsLoading } =
        useSessions({
            startDate,
            endDate,
            isFirstVisit: true,
        });

    // Organic 세션 필터링
    const organicSessions = useMemo(
        () =>
            allSessions.filter(
                (s) =>
                    s.trafficSource === 'organic' &&
                    !s.hasUtm &&
                    s.customParams === null &&
                    s.referrerDomain
            ),
        [allSessions]
    );

    // UTM 세션 + Organic 세션 합치기
    const sessions = useMemo(
        () => [...utmSessions, ...organicSessions],
        [utmSessions, organicSessions]
    );

    const isSessionsLoading = isUtmSessionsLoading || isAllSessionsLoading;

    // 세션의 visitorId 목록
    const visitorIds = useMemo(
        () => [...new Set(sessions.map((s) => s.visitorId))],
        [sessions]
    );

    // 해당 visitorId들의 이벤트 조회
    const { data: events = [], isLoading: isEventsLoading } = useEvents({
        startDate,
        endDate,
        visitorIds,
        enabled: visitorIds.length > 0,
    });

    const isLoading = isSessionsLoading || isEventsLoading;

    // visitorId 기반 여정 구축
    const journeys = useMemo(
        () => buildVisitorJourneys(sessions, events),
        [sessions, events]
    );

    // 채널별 행동 통계
    const channelStats = useMemo(
        () => calculateChannelStats(journeys),
        [journeys]
    );

    // 이탈 페이지 통계
    const exitPageStats = useMemo(
        () => calculateExitPageStats(journeys),
        [journeys]
    );

    // 디바이스별 통계
    const deviceStats = useMemo(
        () => calculateDeviceStats(journeys),
        [journeys]
    );

    const handlePresetClick = (p: PresetPeriod) => {
        setPreset(p);
        if (p !== 'custom') {
            setCustomRange(null);
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* 날짜 필터 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                    행동 분석
                    <span className="ml-2">({journeys.length}명의 방문자)</span>
                </h3>
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <Button
                        variant={preset === 'today' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePresetClick('today')}
                    >
                        오늘
                    </Button>
                    <Button
                        variant={preset === 'week' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePresetClick('week')}
                    >
                        이번 주
                    </Button>
                    <Button
                        variant={preset === 'month' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePresetClick('month')}
                    >
                        이번 달
                    </Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={
                                    preset === 'custom' ? 'default' : 'outline'
                                }
                                size="sm"
                                className="gap-2"
                            >
                                <CalendarIcon className="h-4 w-4" />
                                {preset === 'custom' && customRange
                                    ? `${format(
                                          customRange.from,
                                          'MM/dd'
                                      )} - ${format(customRange.to, 'MM/dd')}`
                                    : '날짜 선택'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="range"
                                selected={
                                    customRange
                                        ? {
                                              from: customRange.from,
                                              to: customRange.to,
                                          }
                                        : undefined
                                }
                                onSelect={(range) => {
                                    if (range?.from && range?.to) {
                                        setCustomRange({
                                            from: range.from,
                                            to: range.to,
                                        });
                                        setPreset('custom');
                                    }
                                }}
                                locale={ko}
                                disabled={(date) =>
                                    date > now || date < subDays(now, 90)
                                }
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* 섹션 1: 디바이스별 통계 */}
            <section>
                <DeviceStatsCard stats={deviceStats} isLoading={isLoading} />
            </section>

            {/* 섹션 2: 채널별 행동 비교 */}
            <section>
                <ChannelBehaviorTable
                    stats={channelStats}
                    isLoading={isLoading}
                    onSelect={setSelectedChannelKey}
                />
            </section>

            {/* 섹션 3: 이탈 페이지 분석 */}
            <section>
                <ExitPageTable stats={exitPageStats} isLoading={isLoading} />
            </section>

            {/* 섹션 4: 방문자 검색 */}
            <section className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="visitorId로 검색..."
                        value={visitorIdInput}
                        onChange={(e) => setVisitorIdInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && visitorIdInput.trim()) {
                                setSelectedVisitorId(visitorIdInput.trim());
                            }
                        }}
                        className="pl-9"
                    />
                </div>
                <Button
                    size="sm"
                    onClick={() => {
                        if (visitorIdInput.trim()) {
                            setSelectedVisitorId(visitorIdInput.trim());
                        }
                    }}
                    disabled={!visitorIdInput.trim()}
                >
                    검색
                </Button>
            </section>

            {/* 채널별 이탈 페이지 및 이벤트 다이얼로그 */}
            {selectedChannelKey &&
                (() => {
                    const [source, medium] = selectedChannelKey.split('|');
                    const channelExitPages = calculateChannelExitPages(
                        journeys,
                        source,
                        medium
                    );
                    const channelEventStats = calculateChannelEventStats(
                        journeys,
                        source,
                        medium
                    );
                    const channelStat = channelStats.find(
                        (s) => s.source === source && s.medium === medium
                    );

                    return (
                        <ChannelExitDialog
                            source={source}
                            medium={medium}
                            exitPages={channelExitPages}
                            eventStats={channelEventStats}
                            visitorCount={channelStat?.visitorCount || 0}
                            open={!!selectedChannelKey}
                            onOpenChange={(open) =>
                                !open && setSelectedChannelKey(null)
                            }
                        />
                    );
                })()}

            {/* 방문자 타임라인 다이얼로그 */}
            {selectedVisitorId && (
                <VisitorTimelineDialog
                    visitorId={selectedVisitorId}
                    open={!!selectedVisitorId}
                    onOpenChange={(open) => !open && setSelectedVisitorId(null)}
                />
            )}
        </div>
    );
}
