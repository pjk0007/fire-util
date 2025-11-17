import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import FireTaskSheetComments from '@/components/FireTask/FireTaskSheet/FireTaskSheetComments';
import FireTaskSheetExpandButton from '@/components/FireTask/FireTaskSheet/FireTaskSheetExpandButton';
import FireTaskSheetFiles from '@/components/FireTask/FireTaskSheet/FireTaskSheetFiles';
import FireTaskSheetHeader from '@/components/FireTask/FireTaskSheet/FireTaskSheetHeader';
import FireScrollArea from '@/components/FireUI/FireScrollArea';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { FireUser, USER_ID_FIELD } from '@/lib/FireAuth/settings';
import updateTaskLastSeen from '@/lib/FireTask/api/updateTaskLastSeen';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_ID_FIELD,
} from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import FireTaskSheetContent from '@/components/FireTask/FireTaskSheet/FireTaskSheetContent';
import { useFireTask } from '@/components/FireProvider/FireTaskProvider';
import { useRouter } from 'next/router';

interface FireTaskSheetProps<FT extends FireTask<FU>, FU extends FireUser> {
    task?: FT;
    participants?: FU[];
}

export default function FireTaskSheet<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task, participants }: FireTaskSheetProps<FT, FU>) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isMobile = useIsMobile();
    const { user } = useFireAuth();
    const { setSelectedTaskId } = useFireTask();
    const router = useRouter();

    if (!user) {
        return null;
    }

    return (
        <Sheet
            open={!!task}
            onOpenChange={(open) => {
                if (!open) {
                    setIsExpanded(false);
                    setSelectedTaskId(undefined);
                    if (router.query.taskId) {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { taskId: _, ...rest } = router.query;
                        router.replace(
                            {
                                pathname: router.pathname,
                                query: rest,
                            },
                            undefined,
                            { shallow: true }
                        );
                    }

                    if (task && user) {
                        setTimeout(() => {
                            updateTaskLastSeen(
                                task[TASK_CHANNEL_ID_FIELD],
                                task[TASK_ID_FIELD],
                                user[USER_ID_FIELD]
                            );
                        }, 1000);
                    }
                }
            }}
        >
            <SheetContent
                className={cn('w-full transition-all', {
                    'sm:max-w-full pt-10': isExpanded && !isMobile,
                    'max-w-full': isMobile,
                    'sm:max-w-[960px]': !isExpanded,
                })}
            >
                {task && participants && (
                    <FireScrollArea
                        className={cn(' h-full', {
                            flex: isExpanded && !isMobile,
                            'py-5 md:py-10 px-7 md:px-14':
                                !isExpanded || isMobile,
                        })}
                        disabled={isExpanded}
                    >
                        <FireScrollArea
                            disabled={!isExpanded || isMobile}
                            className={cn({
                                'py-2 px-8 flex-3': isExpanded && !isMobile,
                            })}
                        >
                            <FireTaskSheetExpandButton
                                isExpanded={isExpanded}
                                setIsExpanded={setIsExpanded}
                            />
                            <FireTaskSheetHeader task={task} />

                            <Separator className="my-4" />
                            <FireTaskSheetContent
                                task={task}
                                participants={participants}
                            />

                            <Separator className="my-4" />
                            <FireTaskSheetFiles task={task} />
                        </FireScrollArea>

                        <Separator
                            className={cn({
                                'mr-4': isExpanded && !isMobile,
                                'my-4': !isExpanded || isMobile,
                            })}
                            orientation={
                                isExpanded && !isMobile
                                    ? 'vertical'
                                    : 'horizontal'
                            }
                        />

                        <FireScrollArea
                            disabled={!isExpanded}
                            className={cn({
                                'py-2 px-4 flex-2': isExpanded && !isMobile,
                            })}
                        >
                            <FireTaskSheetComments task={task} />
                        </FireScrollArea>
                    </FireScrollArea>
                )}
            </SheetContent>
        </Sheet>
    );
}
