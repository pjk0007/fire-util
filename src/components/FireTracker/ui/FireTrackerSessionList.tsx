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
    useSessionsToday,
    useSessionsThisWeek,
    useSessionsThisMonth,
} from '@/components/FireTracker/hooks';
import { FireTrackerSession } from '@/components/FireTracker/settings';

type Period = 'today' | 'week' | 'month';

function formatDate(timestamp: { toDate: () => Date }) {
    return format(timestamp.toDate(), 'MM/dd HH:mm', { locale: ko });
}

function getSourceBadgeColor(source: string) {
    switch (source) {
        case 'direct':
            return 'bg-gray-100 text-gray-800';
        case 'organic':
            return 'bg-green-100 text-green-800';
        case 'paid':
            return 'bg-blue-100 text-blue-800';
        case 'social':
            return 'bg-pink-100 text-pink-800';
        case 'referral':
            return 'bg-purple-100 text-purple-800';
        case 'email':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function SessionRow({ session }: { session: FireTrackerSession }) {
    const [expanded, setExpanded] = useState(false);

    const utmSource = session.utm?.utm_source || '-';
    const utmMedium = session.utm?.utm_medium || '-';
    const utmCampaign = session.utm?.utm_campaign || '-';

    return (
        <>
            <TableRow
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(!expanded)}
            >
                <TableCell className="font-mono text-xs">
                    {formatDate(session.startedAt)}
                </TableCell>
                <TableCell>
                    <Badge className={getSourceBadgeColor(session.trafficSource)}>
                        {session.trafficSource}
                    </Badge>
                </TableCell>
                <TableCell className="text-sm">
                    {utmSource} / {utmMedium}
                </TableCell>
                <TableCell className="text-center">{session.pageViews}</TableCell>
                <TableCell className="text-center">
                    {session.userId ? (
                        <Badge variant="outline" className="text-green-600">
                            로그인
                        </Badge>
                    ) : (
                        <span className="text-gray-400">-</span>
                    )}
                </TableCell>
                <TableCell className="text-xs text-gray-500">
                    {session.device.isMobile ? '모바일' : '데스크톱'}
                </TableCell>
            </TableRow>
            {expanded && (
                <TableRow>
                    <TableCell colSpan={6} className="bg-gray-50 p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Session ID</p>
                                <p className="font-mono text-xs">{session.id}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Visitor ID</p>
                                <p className="font-mono text-xs">{session.visitorId}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">User ID</p>
                                <p className="font-mono text-xs">{session.userId || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Landing Page</p>
                                <p className="font-mono text-xs">{session.landingPage}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">UTM Campaign</p>
                                <p>{utmCampaign}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Referrer</p>
                                <p className="font-mono text-xs truncate">
                                    {session.referrer || '(direct)'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Device</p>
                                <p className="text-xs">
                                    {session.device.platform} · {session.device.screenWidth}x
                                    {session.device.screenHeight}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Events</p>
                                <p>{session.events}</p>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

export default function FireTrackerSessionList() {
    const [period, setPeriod] = useState<Period>('today');

    const { data: todaySessions, isLoading: loadingToday } = useSessionsToday();
    const { data: weekSessions, isLoading: loadingWeek } = useSessionsThisWeek();
    const { data: monthSessions, isLoading: loadingMonth } = useSessionsThisMonth();

    const sessions =
        period === 'today'
            ? todaySessions
            : period === 'week'
              ? weekSessions
              : monthSessions;

    const isLoading =
        period === 'today'
            ? loadingToday
            : period === 'week'
              ? loadingWeek
              : loadingMonth;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>세션 목록</CardTitle>
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
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="py-8 text-center text-gray-500">로딩 중...</div>
                ) : !sessions?.length ? (
                    <div className="py-8 text-center text-gray-500">
                        세션 데이터가 없습니다
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-32">시간</TableHead>
                                <TableHead className="w-24">채널</TableHead>
                                <TableHead>Source / Medium</TableHead>
                                <TableHead className="w-20 text-center">페이지뷰</TableHead>
                                <TableHead className="w-20 text-center">로그인</TableHead>
                                <TableHead className="w-24">디바이스</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessions.map((session) => (
                                <SessionRow key={session.id} session={session} />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
