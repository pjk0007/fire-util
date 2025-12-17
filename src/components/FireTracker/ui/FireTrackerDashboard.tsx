import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    useSessionsToday,
    useSessionsThisWeek,
    useSessionsThisMonth,
} from '@/components/FireTracker/hooks';
import { FireTrackerSession } from '@/components/FireTracker/settings';
import FireTrackerSessionList from './FireTrackerSessionList';
import FireTrackerEventList from './FireTrackerEventList';
import FireTrackerConversion from './FireTrackerConversion';

function calculateStats(sessions: FireTrackerSession[]) {
    const uniqueVisitors = new Set(sessions.map((s) => s.visitorId)).size;
    const totalPageViews = sessions.reduce((sum, s) => sum + s.pageViews, 0);
    const loggedInSessions = sessions.filter((s) => s.userId).length;

    // 유입 채널별 집계
    const bySource: Record<string, number> = {};
    const bySourceMedium: Record<string, number> = {};

    sessions.forEach((s) => {
        // trafficSource 집계
        const source = s.trafficSource || 'unknown';
        bySource[source] = (bySource[source] || 0) + 1;

        // utm_source + utm_medium 집계
        const utmSource = s.utm?.utm_source || '(direct)';
        const utmMedium = s.utm?.utm_medium || '(none)';
        const key = `${utmSource} / ${utmMedium}`;
        bySourceMedium[key] = (bySourceMedium[key] || 0) + 1;
    });

    return {
        totalSessions: sessions.length,
        uniqueVisitors,
        totalPageViews,
        loggedInSessions,
        bySource,
        bySourceMedium,
    };
}

export default function FireTrackerDashboard() {
    const { data: todaySessions, isLoading: loadingToday } = useSessionsToday();
    const { data: weekSessions, isLoading: loadingWeek } =
        useSessionsThisWeek();
    const { data: monthSessions, isLoading: loadingMonth } =
        useSessionsThisMonth();

    const todayStats = useMemo(
        () => calculateStats(todaySessions || []),
        [todaySessions]
    );
    const weekStats = useMemo(
        () => calculateStats(weekSessions || []),
        [weekSessions]
    );
    const monthStats = useMemo(
        () => calculateStats(monthSessions || []),
        [monthSessions]
    );

    const isLoading = loadingToday || loadingWeek || loadingMonth;

    if (isLoading) {
        return <div className="p-8">로딩 중...</div>;
    }

    return (
        <div className="w-full p-8 space-y-6">
            {/* 요약 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-500">
                            오늘
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {todayStats.totalSessions} 세션
                        </div>
                        <div className="text-sm text-gray-500">
                            {todayStats.uniqueVisitors} 방문자 ·{' '}
                            {todayStats.totalPageViews} 페이지뷰
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-500">
                            이번 주
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {weekStats.totalSessions} 세션
                        </div>
                        <div className="text-sm text-gray-500">
                            {weekStats.uniqueVisitors} 방문자 ·{' '}
                            {weekStats.totalPageViews} 페이지뷰
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-gray-500">
                            이번 달
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {monthStats.totalSessions} 세션
                        </div>
                        <div className="text-sm text-gray-500">
                            {monthStats.uniqueVisitors} 방문자 ·{' '}
                            {monthStats.totalPageViews} 페이지뷰
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 유입 채널 (오늘) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>유입 채널 (오늘)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {Object.entries(todayStats.bySource)
                                .sort(([, a], [, b]) => b - a)
                                .map(([source, count]) => (
                                    <div
                                        key={source}
                                        className="flex justify-between"
                                    >
                                        <span>{source}</span>
                                        <span className="font-medium">
                                            {count}
                                        </span>
                                    </div>
                                ))}
                            {Object.keys(todayStats.bySource).length === 0 && (
                                <div className="text-gray-500">데이터 없음</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>UTM Source / Medium (오늘)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {Object.entries(todayStats.bySourceMedium)
                                .sort(([, a], [, b]) => b - a)
                                .map(([key, count]) => (
                                    <div
                                        key={key}
                                        className="flex justify-between"
                                    >
                                        <span className="text-sm">{key}</span>
                                        <span className="font-medium">
                                            {count}
                                        </span>
                                    </div>
                                ))}
                            {Object.keys(todayStats.bySourceMedium).length ===
                                0 && (
                                <div className="text-gray-500">데이터 없음</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 이번 달 UTM 상세 */}
            <Card>
                <CardHeader>
                    <CardTitle>UTM Source / Medium (이번 달)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {Object.entries(monthStats.bySourceMedium)
                            .sort(([, a], [, b]) => b - a)
                            .map(([key, count]) => {
                                const percentage = monthStats.totalSessions
                                    ? (
                                          (count / monthStats.totalSessions) *
                                          100
                                      ).toFixed(1)
                                    : 0;
                                return (
                                    <div
                                        key={key}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm">
                                                    {key}
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {count} ({percentage}%)
                                                </span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded">
                                                <div
                                                    className="h-2 bg-blue-500 rounded"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        {Object.keys(monthStats.bySourceMedium).length ===
                            0 && (
                            <div className="text-gray-500">데이터 없음</div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 전환율 분석 */}
            <FireTrackerConversion />

            {/* 세션 목록 */}
            <FireTrackerSessionList />

            {/* 이벤트 목록 */}
            <FireTrackerEventList />
        </div>
    );
}
