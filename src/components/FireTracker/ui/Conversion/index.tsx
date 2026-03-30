import { useMemo, useState } from 'react';
import {
    startOfDay,
    endOfDay,
    subDays,
    startOfWeek,
    startOfMonth,
    format,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Toggle } from '@/components/ui/toggle';
import { useSessions, useEvents } from '@/components/FireTracker/hooks';
import { buildVisitorJourneys } from '../Behavior/utils';
import type { DeviceType } from '../Behavior/types';
import { DEFAULT_FUNNEL_STAGES } from './types';
import { calculateFunnelStats, calculateChannelFunnelStats } from './utils';
import { FunnelChart } from './FunnelChart';
import { ChannelFunnelTable } from './ChannelFunnelTable';

type PresetPeriod = 'today' | 'week' | 'month' | 'custom';

const DEVICE_OPTIONS: {
    value: DeviceType;
    label: string;
    icon: React.ReactNode;
}[] = [
    { value: 'pc', label: 'PC', icon: <Monitor className="h-4 w-4" /> },
    {
        value: 'mobile',
        label: '모바일',
        icon: <Smartphone className="h-4 w-4" />,
    },
    { value: 'tablet', label: '태블릿', icon: <Tablet className="h-4 w-4" /> },
];

export default function ConversionTab() {
    const [preset, setPreset] = useState<PresetPeriod>('month');
    const [customRange, setCustomRange] = useState<{
        from: Date;
        to: Date;
    } | null>(null);
    const [selectedDevices, setSelectedDevices] = useState<Set<DeviceType>>(
        new Set(['pc', 'mobile', 'tablet'])
    );

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
    const allJourneys = useMemo(
        () => buildVisitorJourneys(sessions, events),
        [sessions, events]
    );

    // 디바이스 필터 적용
    const journeys = useMemo(
        () => allJourneys.filter((j) => selectedDevices.has(j.deviceType)),
        [allJourneys, selectedDevices]
    );

    // 퍼널 통계
    const funnelStats = useMemo(
        () => calculateFunnelStats(journeys, DEFAULT_FUNNEL_STAGES),
        [journeys]
    );

    // 채널별 퍼널 통계
    const channelFunnelStats = useMemo(
        () => calculateChannelFunnelStats(journeys, DEFAULT_FUNNEL_STAGES),
        [journeys]
    );

    const handlePresetClick = (p: PresetPeriod) => {
        setPreset(p);
        if (p !== 'custom') {
            setCustomRange(null);
        }
    };

    const handleDeviceToggle = (device: DeviceType) => {
        setSelectedDevices((prev) => {
            const next = new Set(prev);
            if (next.has(device)) {
                // 최소 1개는 선택되어야 함
                if (next.size > 1) {
                    next.delete(device);
                }
            } else {
                next.add(device);
            }
            return next;
        });
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* 필터 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                    전환 분석
                    <span className="ml-2">({journeys.length}명의 방문자)</span>
                </h3>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    {/* 디바이스 필터 */}
                    <div className="flex items-center gap-1 border rounded-md p-1">
                        {DEVICE_OPTIONS.map((option) => (
                            <Toggle
                                key={option.value}
                                size="sm"
                                pressed={selectedDevices.has(option.value)}
                                onPressedChange={() =>
                                    handleDeviceToggle(option.value)
                                }
                                className="gap-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                            >
                                {option.icon}
                                <span className="text-xs">
                                    {option.label}
                                </span>
                            </Toggle>
                        ))}
                    </div>

                    {/* 날짜 필터 */}
                    <div className="flex items-center gap-1">
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
                                        preset === 'custom'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    className="gap-2"
                                >
                                    <CalendarIcon className="h-4 w-4" />
                                    {preset === 'custom' && customRange
                                        ? `${format(
                                              customRange.from,
                                              'MM/dd'
                                          )} - ${format(
                                              customRange.to,
                                              'MM/dd'
                                          )}`
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
            </div>

            {/* 섹션 1: 전환 퍼널 */}
            <section>
                <FunnelChart stats={funnelStats} isLoading={isLoading} />
            </section>

            {/* 섹션 2: 채널별 전환 현황 */}
            <section>
                <ChannelFunnelTable
                    stats={channelFunnelStats}
                    stages={DEFAULT_FUNNEL_STAGES}
                    isLoading={isLoading}
                />
            </section>
        </div>
    );
}
