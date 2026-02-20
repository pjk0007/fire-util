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
import { CalendarIcon, Monitor, Smartphone, Tablet, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Toggle } from '@/components/ui/toggle';
import { useSessions } from '@/components/FireTracker/hooks';
import { TrendCharts } from './TrendCharts';
import { CampaignDetail } from './CampaignDetail';
import { CampaignList } from './CampaignList';
import { MultiVisitDialog } from './MultiVisitDialog';
import { aggregateParamStats, aggregateMultiVisitVisitors, getDeviceType } from './utils';
import type { CampaignGroup, DeviceType } from './types';

type PresetPeriod = 'today' | 'week' | 'month' | 'custom';

const DEVICE_OPTIONS: {
    value: DeviceType;
    label: string;
    icon: React.ReactNode;
}[] = [
    { value: 'pc', label: 'PC', icon: <Monitor className="h-4 w-4" /> },
    { value: 'mobile', label: '모바일', icon: <Smartphone className="h-4 w-4" /> },
    { value: 'tablet', label: '태블릿', icon: <Tablet className="h-4 w-4" /> },
];

export default function FirstVisitTab() {
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [preset, setPreset] = useState<PresetPeriod>('today');
    const [customRange, setCustomRange] = useState<{ from: Date; to: Date } | null>(null);
    const [multiVisitOpen, setMultiVisitOpen] = useState(false);
    const [selectedDevices, setSelectedDevices] = useState<Set<DeviceType>>(
        new Set(['pc', 'mobile', 'tablet'])
    );

    // now를 메모이제이션하여 매 렌더마다 새 Date 객체 생성 방지
    const now = useMemo(() => new Date(), []);

    const getDateRange = () => {
        switch (preset) {
            case 'today':
                return { startDate: startOfDay(now), endDate: endOfDay(now) };
            case 'week':
                return { startDate: startOfWeek(now, { locale: ko }), endDate: endOfDay(now) };
            case 'month':
                return { startDate: startOfMonth(now), endDate: endOfDay(now) };
            case 'custom':
                if (customRange) {
                    return { startDate: startOfDay(customRange.from), endDate: endOfDay(customRange.to) };
                }
                return { startDate: startOfDay(now), endDate: endOfDay(now) };
        }
    };

    const { startDate, endDate } = getDateRange();

    // 전체 세션 (추이 차트용, 최근 3개월) - 첫 방문만
    const { data: allSessions = [], isLoading: isAllLoading } = useSessions({
        startDate: startOfMonth(subMonths(now, 2)),
        endDate: endOfDay(now),
        hasUtm: true,
        isFirstVisit: true,
    });

    // 필터된 세션 (상세 목록용) - 첫 방문만, UTM 있는 것
    const { data: filteredSessions = [], isLoading: isFilteredLoading } = useSessions({
        startDate,
        endDate,
        hasUtm: true,
        isFirstVisit: true,
    });

    // 모든 첫 방문 세션 (organic 필터링용)
    const { data: allFilteredSessions = [], isLoading: isAllFilteredLoading } = useSessions({
        startDate,
        endDate,
        isFirstVisit: true,
    });

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
                if (next.size > 1) {
                    next.delete(device);
                }
            } else {
                next.add(device);
            }
            return next;
        });
    };

    // 디바이스 필터 적용
    const deviceFilteredSessions = useMemo(
        () => filteredSessions.filter((s) => selectedDevices.has(getDeviceType(s))),
        [filteredSessions, selectedDevices]
    );

    const deviceFilteredAllSessions = useMemo(
        () => allFilteredSessions.filter((s) => selectedDevices.has(getDeviceType(s))),
        [allFilteredSessions, selectedDevices]
    );

    // utm_source + utm_medium 묶음별 집계 (organic 포함) - visitorId 기준
    const campaignStats = useMemo(() => {
        const stats: Record<string, CampaignGroup & { visitorIds: Set<string> }> = {};

        // UTM 있는 세션
        deviceFilteredSessions.forEach((s) => {
            if (!s.utm?.utm_source || !s.utm?.utm_medium) return;
            const { utm_source: source, utm_medium: medium } = s.utm;
            const key = `${source}|${medium}`;

            if (!stats[key]) {
                stats[key] = { source, medium, count: 0, sessions: [], visitorIds: new Set() };
            }
            stats[key].sessions.push(s);
            stats[key].visitorIds.add(s.visitorId);
        });

        // Organic 세션 (trafficSource=organic, UTM 없음, customParams 없음)
        deviceFilteredAllSessions.forEach((s) => {
            if (
                s.trafficSource === 'organic' &&
                !s.hasUtm &&
                s.customParams === null &&
                s.referrerDomain
            ) {
                const source = 'organic';
                const medium = s.referrerDomain;
                const key = `${source}|${medium}`;

                if (!stats[key]) {
                    stats[key] = { source, medium, count: 0, sessions: [], visitorIds: new Set() };
                }
                stats[key].sessions.push(s);
                stats[key].visitorIds.add(s.visitorId);
            }
        });

        // visitorId 수를 count로 변환
        return Object.values(stats)
            .map(({ visitorIds, ...rest }) => ({ ...rest, count: visitorIds.size }))
            .sort((a, b) => b.count - a.count);
    }, [deviceFilteredSessions, deviceFilteredAllSessions]);

    // 검색어(utm_term) 집계
    const searchTermStats = useMemo(() => {
        const terms: Record<string, number> = {};

        deviceFilteredSessions.forEach((s) => {
            const term = s.utm?.utm_term;
            if (term) {
                terms[term] = (terms[term] || 0) + 1;
            }
        });

        return Object.entries(terms).sort(([, a], [, b]) => b - a) as [string, number][];
    }, [deviceFilteredSessions]);

    const selectedCampaign = useMemo(
        () => campaignStats.find((c) => `${c.source}|${c.medium}` === selectedKey) || null,
        [selectedKey, campaignStats]
    );

    const selectedStats = useMemo(
        () => (selectedCampaign ? aggregateParamStats(selectedCampaign.sessions) : null),
        [selectedCampaign]
    );

    // 2번 이상 유입된 방문자
    const multiVisitVisitors = useMemo(
        () => aggregateMultiVisitVisitors(deviceFilteredSessions),
        [deviceFilteredSessions]
    );

    // 총 방문자 수 (visitorId 기준)
    const totalVisitorCount = useMemo(() => {
        const visitorIds = new Set<string>();

        // UTM 있는 세션
        deviceFilteredSessions.forEach((s) => {
            if (s.utm?.utm_source && s.utm?.utm_medium) {
                visitorIds.add(s.visitorId);
            }
        });

        // Organic 세션
        deviceFilteredAllSessions.forEach((s) => {
            if (
                s.trafficSource === 'organic' &&
                !s.hasUtm &&
                s.customParams === null &&
                s.referrerDomain
            ) {
                visitorIds.add(s.visitorId);
            }
        });

        return visitorIds.size;
    }, [deviceFilteredSessions, deviceFilteredAllSessions]);

    return (
        <div className="space-y-6 md:space-y-8">
            {/* 상단: 추이 차트 (전체 기간) */}
            <section>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 md:mb-4">
                    유입 추이 (최근 3개월)
                </h3>
                <TrendCharts sessions={allSessions} isLoading={isAllLoading} />
            </section>

            {/* 하단: 상세 날짜별 유입 */}
            <section>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 md:mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        상세 유입
                    </h3>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        {/* 디바이스 필터 */}
                        <div className="flex items-center gap-1 border rounded-md p-1">
                            {DEVICE_OPTIONS.map((option) => (
                                <Toggle
                                    key={option.value}
                                    size="sm"
                                    pressed={selectedDevices.has(option.value)}
                                    onPressedChange={() => handleDeviceToggle(option.value)}
                                    className="gap-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                                >
                                    {option.icon}
                                    <span className="text-xs">{option.label}</span>
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
                                        variant={preset === 'custom' ? 'default' : 'outline'}
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <CalendarIcon className="h-4 w-4" />
                                        {preset === 'custom' && customRange
                                            ? `${format(customRange.from, 'MM/dd')} - ${format(customRange.to, 'MM/dd')}`
                                            : '날짜 선택'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar
                                        mode="range"
                                        selected={customRange ? { from: customRange.from, to: customRange.to } : undefined}
                                        onSelect={(range) => {
                                            if (range?.from && range?.to) {
                                                setCustomRange({ from: range.from, to: range.to });
                                                setPreset('custom');
                                            }
                                        }}
                                        locale={ko}
                                        disabled={(date) => date > now || date < subDays(now, 90)}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                {isFilteredLoading || isAllFilteredLoading ? (
                    <div className="py-8 text-center text-muted-foreground">로딩 중...</div>
                ) : (
                    <>
                        <CampaignList
                            campaigns={campaignStats}
                            total={totalVisitorCount}
                            searchTerms={searchTermStats}
                            onSelect={setSelectedKey}
                        />
                        {multiVisitVisitors.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4 gap-2"
                                onClick={() => setMultiVisitOpen(true)}
                            >
                                <Users className="h-4 w-4" />
                                재유입 방문자 {multiVisitVisitors.length}명
                            </Button>
                        )}
                    </>
                )}
            </section>

            {/* 캠페인 상세 다이얼로그 */}
            <CampaignDetail
                campaign={selectedCampaign}
                stats={selectedStats}
                open={!!selectedKey}
                onOpenChange={(open) => !open && setSelectedKey(null)}
            />

            {/* 재유입 방문자 다이얼로그 */}
            <MultiVisitDialog
                visitors={multiVisitVisitors}
                open={multiVisitOpen}
                onOpenChange={setMultiVisitOpen}
            />
        </div>
    );
}
