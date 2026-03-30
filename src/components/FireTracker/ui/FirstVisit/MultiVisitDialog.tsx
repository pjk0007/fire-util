import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Users, ArrowRight } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { MultiVisitVisitor } from './types';

interface MultiVisitDialogProps {
    visitors: MultiVisitVisitor[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MultiVisitDialog({ visitors, open, onOpenChange }: MultiVisitDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        재유입 방문자
                        <Badge variant="secondary">{visitors.length}명</Badge>
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-4">
                        {visitors.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                2번 이상 유입된 방문자가 없습니다
                            </div>
                        ) : (
                            visitors.map((visitor) => (
                                <div
                                    key={visitor.visitorId}
                                    className="border rounded-lg p-4 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-mono text-muted-foreground">
                                            {visitor.visitorId.slice(0, 8)}...
                                        </span>
                                        <Badge>{visitor.sessions.length}회 유입</Badge>
                                    </div>

                                    {/* 유입 경로 요약 */}
                                    <div className="flex flex-wrap gap-2">
                                        {visitor.channels.map((ch, i) => (
                                            <Badge key={i} variant="outline">
                                                {ch.source}/{ch.medium}
                                                {ch.count > 1 && ` (${ch.count})`}
                                            </Badge>
                                        ))}
                                    </div>

                                    {/* 유입 타임라인 */}
                                    <div className="space-y-2">
                                        {visitor.sessions.map((session, i) => (
                                            <div
                                                key={session.id}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <span className="text-muted-foreground w-6">
                                                    {i + 1}.
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {format(session.startedAt.toDate(), 'MM/dd HH:mm', { locale: ko })}
                                                </span>
                                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                                <span className="font-medium">
                                                    {session.utm?.utm_source || 'direct'}/{session.utm?.utm_medium || 'none'}
                                                </span>
                                                {session.utm?.utm_campaign && (
                                                    <span className="text-muted-foreground">
                                                        ({session.utm.utm_campaign})
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
