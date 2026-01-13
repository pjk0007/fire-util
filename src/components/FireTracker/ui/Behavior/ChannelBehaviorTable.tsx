import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { ChannelBehaviorStats } from './types';
import { formatDuration } from './formatDuration';

interface ChannelBehaviorTableProps {
    stats: ChannelBehaviorStats[];
    isLoading: boolean;
    onSelect: (key: string) => void;
}

export function ChannelBehaviorTable({ stats, isLoading, onSelect }: ChannelBehaviorTableProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] bg-muted rounded animate-pulse" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                    채널별 행동 비교
                </CardTitle>
            </CardHeader>
            <CardContent>
                {stats.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                        데이터가 없습니다
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Source / Medium</TableHead>
                                    <TableHead className="text-right">방문자</TableHead>
                                    <TableHead className="text-right">회원가입</TableHead>
                                    <TableHead className="text-right">평균 체류시간</TableHead>
                                    <TableHead className="text-right">평균 페이지뷰</TableHead>
                                    <TableHead className="text-right">평균 이벤트</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.map((stat) => {
                                    const key = `${stat.source}|${stat.medium}`;
                                    return (
                                        <TableRow
                                            key={key}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => onSelect(key)}
                                        >
                                            <TableCell>
                                                <span className="font-medium">{stat.source}</span>
                                                <span className="text-muted-foreground mx-1">/</span>
                                                <span>{stat.medium}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {stat.visitorCount}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span>{stat.signedUpCount}</span>
                                                <span className="text-muted-foreground ml-1">
                                                    ({stat.signUpRate}%)
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatDuration(stat.avgDuration)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {stat.avgPageViews}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {stat.avgEvents}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
