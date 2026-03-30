import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DeviceStats, DeviceType } from './types';
import { formatDuration } from './formatDuration';

interface DeviceStatsCardProps {
    stats: DeviceStats[];
    isLoading: boolean;
}

const deviceIcons: Record<DeviceType, React.ReactNode> = {
    pc: <Monitor className="h-5 w-5" />,
    mobile: <Smartphone className="h-5 w-5" />,
    tablet: <Tablet className="h-5 w-5" />,
};

const deviceLabels: Record<DeviceType, string> = {
    pc: 'PC',
    mobile: '모바일',
    tablet: '태블릿',
};

export function DeviceStatsCard({ stats, isLoading }: DeviceStatsCardProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                    <div className="h-[100px] bg-muted rounded animate-pulse" />
                </CardContent>
            </Card>
        );
    }

    const total = stats.reduce((sum, s) => sum + s.visitorCount, 0);

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                    디바이스별 통계
                </CardTitle>
            </CardHeader>
            <CardContent>
                {stats.length === 0 ? (
                    <div className="py-4 text-center text-muted-foreground">
                        데이터가 없습니다
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.deviceType}
                                className="flex flex-col items-center p-4 rounded-lg bg-muted/50"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    {deviceIcons[stat.deviceType]}
                                    <span className="font-medium">
                                        {deviceLabels[stat.deviceType]}
                                    </span>
                                </div>
                                <div className="text-2xl font-bold">
                                    {stat.visitorCount}
                                    <span className="text-sm font-normal text-muted-foreground ml-1">
                                        ({Math.round((stat.visitorCount / total) * 100)}%)
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                                    <div>
                                        회원가입: {stat.signedUpCount} ({stat.signUpRate}%)
                                    </div>
                                    <div>
                                        평균 체류시간: {formatDuration(stat.avgDuration)}
                                    </div>
                                    <div>
                                        평균 페이지뷰: {stat.avgPageViews}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
