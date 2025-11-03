import FireTaskHistoryItem from '@/components/FireTask/FireTaskHistory/FireTaskHistoryItem';
import FireScrollArea from '@/components/FireUI/FireScrollArea';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import useFireTaskHistory from '@/lib/FireTask/hook/useFireTaskHistory';

import { FIRE_TASK_LOCALE } from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import { ReactNode, useCallback } from 'react';

interface FireTaskHistoryProps {
    dateString?: string;
    title: ReactNode;
    description: ReactNode;
    channelIds: string[];
    className?: string;
    maxItems?: number;
    taskHrefBuilder?: (channelId: string, taskId: string) => string;
}

export default function FireTaskHistory({
    dateString,
    title,
    description,
    channelIds,
    className,
    maxItems,
    taskHrefBuilder,
}: FireTaskHistoryProps) {
    const taskHistory = useFireTaskHistory(channelIds, {
        after: dateString
            ? new Date(dateString).toISOString().split('T')[0]
            : undefined,
        before: dateString
            ? new Date(new Date(dateString).getTime() + 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0]
            : undefined,
        maxItems,
    });
    return (
        <Card className={cn('pl-6 py-6 flex flex-col gap-4', className)}>
            <div className="flex flex-col gap-1.5 h-[42px]">
                <CardTitle className="line-clamp-1">{title}</CardTitle>
                <CardDescription className="line-clamp-1">
                    {description}
                </CardDescription>
            </div>
            {taskHistory.length === 0 || !taskHrefBuilder ? (
                <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                    {FIRE_TASK_LOCALE.HISTORY_ITEM.NO_HISTORY}
                </div>
            ) : (
                <FireScrollArea className="flex-1">
                    <div className="flex flex-col gap-1 pr-2">
                        {taskHistory.map((task, index) => (
                            <FireTaskHistoryItem
                                key={index}
                                historyItem={task}
                                href={
                                    taskHrefBuilder
                                        ? taskHrefBuilder(
                                              task.channelId,
                                              task.taskId
                                          )
                                        : '#'
                                }
                            />
                        ))}
                    </div>
                </FireScrollArea>
            )}
        </Card>
    );
}
