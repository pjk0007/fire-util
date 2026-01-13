import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ExitPageStats, EventStats } from './types';

interface ChannelExitDialogProps {
    source: string;
    medium: string;
    exitPages: ExitPageStats[];
    eventStats: EventStats[];
    visitorCount: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ChannelExitDialog({
    source,
    medium,
    exitPages,
    eventStats,
    visitorCount,
    open,
    onOpenChange,
}: ChannelExitDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>{source}</span>
                        <span className="text-muted-foreground font-normal">/</span>
                        <span>{medium}</span>
                        <span className="text-muted-foreground font-normal ml-2">
                            ({visitorCount}명)
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-6">
                    {/* 이벤트 통계 */}
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">
                            이벤트
                        </h4>

                        {eventStats.length === 0 ? (
                            <div className="py-4 text-center text-muted-foreground text-sm">
                                이벤트 데이터가 없습니다
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {eventStats.map((stat, index) => (
                                    <div
                                        key={stat.name}
                                        className="flex justify-between items-center text-sm py-1"
                                    >
                                        <span className="flex items-center gap-2 min-w-0">
                                            <span
                                                className="w-3 h-3 rounded-[2px] flex-shrink-0"
                                                style={{
                                                    backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))`,
                                                }}
                                            />
                                            <span className="truncate" title={stat.name}>
                                                {stat.name}
                                            </span>
                                        </span>
                                        <span className="font-medium whitespace-nowrap ml-4">
                                            {stat.count}회 ({stat.percentage}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 이탈 페이지 */}
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">
                            이탈 페이지
                        </h4>

                        {exitPages.length === 0 ? (
                            <div className="py-4 text-center text-muted-foreground text-sm">
                                이탈 페이지 데이터가 없습니다
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {exitPages.map((stat, index) => (
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
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
