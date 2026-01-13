import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ExitPageStats } from './types';

interface ExitPageTableProps {
    stats: ExitPageStats[];
    isLoading: boolean;
}

export function ExitPageTable({ stats, isLoading }: ExitPageTableProps) {
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
                    이탈 페이지 TOP 10
                    <span className="text-muted-foreground font-normal ml-2">
                        (마지막 이벤트 발생 페이지)
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {stats.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                        데이터가 없습니다
                    </div>
                ) : (
                    stats.slice(0, 10).map((stat, index) => (
                        <div
                            key={stat.page}
                            className="flex justify-between items-center text-sm py-1"
                        >
                            <span className="flex items-center gap-2 min-w-0">
                                <span
                                    className="w-3 h-3 rounded-[2px] flex-shrink-0"
                                    style={{
                                        backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))`,
                                    }}
                                />
                                <span className="truncate" title={stat.page}>
                                    {stat.page}
                                </span>
                            </span>
                            <span className="font-medium whitespace-nowrap ml-4">
                                {stat.count}명 ({stat.percentage}%)
                            </span>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
