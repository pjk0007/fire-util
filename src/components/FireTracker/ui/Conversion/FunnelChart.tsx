import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FunnelStats } from './types';
import { cn } from '@/lib/utils';

interface FunnelChartProps {
    stats: FunnelStats[];
    isLoading?: boolean;
}

export function FunnelChart({ stats, isLoading }: FunnelChartProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">전환 퍼널</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                        로딩 중...
                    </div>
                </CardContent>
            </Card>
        );
    }

    const maxCount = stats.length > 0 ? stats[0].visitorCount : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">전환 퍼널</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {stats.map((stat, index) => {
                        const widthPercent =
                            (stat.visitorCount / maxCount) * 100 || 0;

                        return (
                            <div key={stat.stageId} className="space-y-1">
                                {/* 단계 헤더 */}
                                <div className="flex items-center justify-between text-sm flex-col md:flex-row w-full">
                                    <div className="flex items-center gap-2 w-full">
                                        <span className="font-medium text-muted-foreground w-6">
                                            {stat.stageId}
                                        </span>
                                        <span className="font-medium">
                                            {stat.stageName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground w-full md:w-80 flex-wrap justify-between">
                                        <span>{stat.visitorCount}명</span>
                                        <span className="w-16 text-right">
                                            {stat.percentage.toFixed(1)}%
                                        </span>
                                        {index > 0 && (
                                            <span className="w-24 text-right text-xs">
                                                (전환율{' '}
                                                {stat.conversionRate.toFixed(1)}
                                                %)
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* 바 */}
                                <div className="relative h-8 bg-muted rounded overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-primary/80 rounded transition-all duration-300"
                                        style={{ width: `${widthPercent}%` }}
                                    />
                                  
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 전체 전환율 요약 */}
                {stats.length > 1 && stats[0].visitorCount > 0 && (
                    <div className="mt-6 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                전체 전환율 (방문 →{' '}
                                {stats[stats.length - 1].stageName})
                            </span>
                            <span className="font-semibold text-primary">
                                {(
                                    (stats[stats.length - 1].visitorCount /
                                        stats[0].visitorCount) *
                                    100
                                ).toFixed(2)}
                                %
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
