import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { ChannelFunnelStats, FunnelStage } from './types';

interface ChannelFunnelTableProps {
    stats: ChannelFunnelStats[];
    stages: FunnelStage[];
    isLoading?: boolean;
}

export function ChannelFunnelTable({
    stats,
    stages,
    isLoading,
}: ChannelFunnelTableProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">채널별 전환 현황</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-32 flex items-center justify-center text-muted-foreground">
                        로딩 중...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (stats.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">채널별 전환 현황</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-32 flex items-center justify-center text-muted-foreground">
                        데이터가 없습니다
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">채널별 전환 현황</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[100px]">
                                    채널
                                </TableHead>
                                <TableHead className="text-right min-w-[60px]">
                                    방문자
                                </TableHead>
                                {stages.map((stage) => (
                                    <TableHead
                                        key={stage.id}
                                        className="text-right min-w-[80px]"
                                    >
                                        {stage.name}
                                    </TableHead>
                                ))}
                                <TableHead className="text-right min-w-[80px]">
                                    최종전환율
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.map((stat) => {
                                const lastStage =
                                    stat.stageStats[stat.stageStats.length - 1];
                                const finalConversionRate =
                                    stat.visitorCount > 0 && lastStage
                                        ? (lastStage.count / stat.visitorCount) *
                                          100
                                        : 0;

                                return (
                                    <TableRow key={`${stat.source}|${stat.medium}`}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">
                                                    {stat.source}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {stat.medium}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {stat.visitorCount}
                                        </TableCell>
                                        {stat.stageStats.map((stageStat) => (
                                            <TableCell
                                                key={stageStat.stageId}
                                                className="text-right"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-sm">
                                                        {stageStat.count}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {stageStat.percentage.toFixed(
                                                            1
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-right">
                                            <span
                                                className={`font-semibold ${
                                                    finalConversionRate > 0
                                                        ? 'text-green-600'
                                                        : 'text-muted-foreground'
                                                }`}
                                            >
                                                {finalConversionRate.toFixed(1)}%
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
