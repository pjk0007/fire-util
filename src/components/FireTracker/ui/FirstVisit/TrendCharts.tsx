import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import { startOfWeek, startOfMonth, startOfDay, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { FireTrackerSession } from '@/components/FireTracker/settings';

interface TrendChartsProps {
    sessions: FireTrackerSession[];
    isLoading: boolean;
}

type TimeUnit = 'month' | 'week' | 'day';

function aggregateByTime(sessions: FireTrackerSession[], unit: TimeUnit) {
    const map: Record<string, number> = {};

    sessions.forEach((s) => {
        const date = s.startedAt.toDate();
        let key: string;

        switch (unit) {
            case 'month':
                key = format(startOfMonth(date), 'yy/MM');
                break;
            case 'week':
                key = format(startOfWeek(date, { locale: ko }), 'MM/dd');
                break;
            case 'day':
                key = format(startOfDay(date), 'MM/dd');
                break;
        }

        map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map)
        .map(([time, count]) => ({ time, count }))
        .sort((a, b) => a.time.localeCompare(b.time));
}

function TrendChart({
    title,
    data,
    tickFormatter,
    color,
}: {
    title: string;
    data: { time: string; count: number }[];
    tickFormatter?: (value: string) => string;
    color?: string;
}) {
    if (data.length === 0) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        데이터가 없습니다
                    </div>
                </CardContent>
            </Card>
        );
    }

    const chartConfig = {
        count: {
            label: '유입수',
            color: color || 'var(--chart-1)',
        },
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="h-[200px] w-full"
                >
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={tickFormatter}
                            fontSize={12}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            width={30}
                            fontSize={12}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                            dataKey="count"
                            fill={color || 'var(--chart-1)'}
                            radius={[4, 4, 0, 0]}
                        >
                            <LabelList
                                dataKey="count"
                                position="top"
                                fontSize={11}
                                fill="var(--foreground)"
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export function TrendCharts({ sessions, isLoading }: TrendChartsProps) {
    const monthlyData = useMemo(
        () => aggregateByTime(sessions, 'month'),
        [sessions]
    );
    const weeklyData = useMemo(
        () => aggregateByTime(sessions, 'week').slice(-5),
        [sessions]
    ); // 최근 5주
    const dailyData = useMemo(
        () => aggregateByTime(sessions, 'day').slice(-14),
        [sessions]
    ); // 최근 14일

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader className="pb-3">
                            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] bg-muted rounded animate-pulse" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
            <TrendChart
                title="월별 유입"
                data={monthlyData}
                color={'var(--chart-1)'}
            />
            <TrendChart
                title="주차별 유입"
                data={weeklyData}
                tickFormatter={(v) => `${v}~`}
                color={'var(--chart-2)'}
            />
            <TrendChart
                title="일별 유입 (최근 14일)"
                data={dailyData}
                color={'var(--chart-3)'}
            />
        </div>
    );
}
