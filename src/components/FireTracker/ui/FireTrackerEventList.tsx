import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    useEventsToday,
    useEventsThisWeek,
    useEventsThisMonth,
} from '@/components/FireTracker/hooks';
import { FireTrackerEvent } from '@/components/FireTracker/settings';

type Period = 'today' | 'week' | 'month';

function formatDate(timestamp: { toDate: () => Date }) {
    return format(timestamp.toDate(), 'MM/dd HH:mm:ss', { locale: ko });
}

function getEventBadgeColor(type: string) {
    switch (type) {
        case 'page_view':
            return 'bg-gray-100 text-gray-800';
        case 'session_start':
            return 'bg-green-100 text-green-800';
        case 'session_end':
            return 'bg-red-100 text-red-800';
        case 'click':
            return 'bg-blue-100 text-blue-800';
        case 'form_submit':
            return 'bg-purple-100 text-purple-800';
        case 'purchase':
            return 'bg-yellow-100 text-yellow-800';
        case 'custom':
            return 'bg-pink-100 text-pink-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function EventRow({ event }: { event: FireTrackerEvent }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <TableRow
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(!expanded)}
            >
                <TableCell className="font-mono text-xs">
                    {formatDate(event.timestamp)}
                </TableCell>
                <TableCell>
                    <Badge className={getEventBadgeColor(event.type)}>
                        {event.type}
                    </Badge>
                </TableCell>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell className="text-sm text-gray-600">{event.page}</TableCell>
                <TableCell className="text-center">
                    {event.userId ? (
                        <Badge variant="outline" className="text-green-600">
                            로그인
                        </Badge>
                    ) : (
                        <span className="text-gray-400">-</span>
                    )}
                </TableCell>
            </TableRow>
            {expanded && (
                <TableRow>
                    <TableCell colSpan={5} className="bg-gray-50 p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Event ID</p>
                                <p className="font-mono text-xs">{event.id}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Session ID</p>
                                <p className="font-mono text-xs">{event.sessionId}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Visitor ID</p>
                                <p className="font-mono text-xs">{event.visitorId}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">User ID</p>
                                <p className="font-mono text-xs">{event.userId || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Page Title</p>
                                <p className="text-xs">{event.pageTitle}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Properties</p>
                                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                                    {event.properties
                                        ? JSON.stringify(event.properties, null, 2)
                                        : '-'}
                                </pre>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

export default function FireTrackerEventList() {
    const [period, setPeriod] = useState<Period>('today');
    const [filterType, setFilterType] = useState<string | null>(null);

    const { data: todayEvents, isLoading: loadingToday } = useEventsToday();
    const { data: weekEvents, isLoading: loadingWeek } = useEventsThisWeek();
    const { data: monthEvents, isLoading: loadingMonth } = useEventsThisMonth();

    const allEvents =
        period === 'today'
            ? todayEvents
            : period === 'week'
              ? weekEvents
              : monthEvents;

    // page_view, session_start 제외 옵션
    const events = filterType
        ? allEvents?.filter((e) => e.type === filterType)
        : allEvents?.filter((e) => e.type !== 'page_view' && e.type !== 'session_start');

    const isLoading =
        period === 'today'
            ? loadingToday
            : period === 'week'
              ? loadingWeek
              : loadingMonth;

    // 이벤트 타입별 개수
    const eventCounts = allEvents?.reduce(
        (acc, e) => {
            acc[e.type] = (acc[e.type] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>이벤트 목록</CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant={period === 'today' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('today')}
                        >
                            오늘
                        </Button>
                        <Button
                            variant={period === 'week' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('week')}
                        >
                            이번 주
                        </Button>
                        <Button
                            variant={period === 'month' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('month')}
                        >
                            이번 달
                        </Button>
                    </div>
                </div>
                {/* 이벤트 타입 필터 */}
                <div className="flex gap-2 mt-4 flex-wrap">
                    <Button
                        variant={filterType === null ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setFilterType(null)}
                    >
                        주요 이벤트
                    </Button>
                    {eventCounts &&
                        Object.entries(eventCounts)
                            .sort(([, a], [, b]) => b - a)
                            .map(([type, count]) => (
                                <Button
                                    key={type}
                                    variant={filterType === type ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setFilterType(type)}
                                >
                                    <Badge className={`${getEventBadgeColor(type)} mr-2`}>
                                        {type}
                                    </Badge>
                                    {count}
                                </Button>
                            ))}
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="py-8 text-center text-gray-500">로딩 중...</div>
                ) : !events?.length ? (
                    <div className="py-8 text-center text-gray-500">
                        이벤트 데이터가 없습니다
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-36">시간</TableHead>
                                <TableHead className="w-28">타입</TableHead>
                                <TableHead>이름</TableHead>
                                <TableHead>페이지</TableHead>
                                <TableHead className="w-20 text-center">로그인</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => (
                                <EventRow key={event.id} event={event} />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
