import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import FireTaskClassCardSheetComments from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetComments';
import FireTaskClassCardSheetExpandButton from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetExpandButton';
import FireTaskClassCardSheetFiles from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetFiles';
import FireTaskClassCardSheetHeader from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetHeader';
import FireScrollArea from '@/components/FireUI/FireScrollArea';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    FireUser,
    USER_ID_FIELD,
} from '@/lib/FireAuth/settings';
import updateTaskLastSeen from '@/lib/FireTask/api/updateTaskLastSeen';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_ID_FIELD,
    TASK_LAST_SEEN_FIELD,
    TASK_UPDATED_AT_FIELD,
} from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';
import useFireChannelInfo from '@/lib/FireChannel/hook/useFireChannelInfo';
import FireTaskClassCardSheetContent from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetContent';

interface FireTaskClassCardSheetProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    task: FT;
    children?: ReactNode;
}

export default function FireTaskClassCardSheet<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task, children }: FireTaskClassCardSheetProps<FT, FU>) {
    const { participants } = useFireChannelInfo({
        channelId: task[TASK_CHANNEL_ID_FIELD],
    });
    const [isExpanded, setIsExpanded] = useState(false);
    const isMobile = useIsMobile();
    const { user } = useFireAuth();

    const updatedAt = task[TASK_UPDATED_AT_FIELD]?.toDate();
    const lastSeen =
        task[TASK_LAST_SEEN_FIELD]?.[user?.[USER_ID_FIELD] || '']?.toDate();

    // If updatedAt or lastSeen is undefined, show as not seen
    const isUnseen = !lastSeen || updatedAt > lastSeen;

    return (
        <Sheet
            onOpenChange={(open) => {
                if (!open) {
                    setIsExpanded(false);
                    if (isUnseen) {
                        setTimeout(() => {
                            updateTaskLastSeen(
                                task[TASK_CHANNEL_ID_FIELD],
                                task[TASK_ID_FIELD],
                                user?.[USER_ID_FIELD]
                            );
                        }, 1000);
                    }
                }
            }}
        >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent
                className={cn('w-full transition-all', {
                    'sm:max-w-full pt-10': isExpanded && !isMobile,
                    'max-w-full': isMobile,
                    'sm:max-w-[960px]': !isExpanded,
                })}
            >
                <FireScrollArea
                    className={cn(' h-full', {
                        flex: isExpanded && !isMobile,
                        'py-5 md:py-10 px-7 md:px-14': !isExpanded || isMobile,
                    })}
                    disabled={isExpanded}
                >
                    <FireScrollArea
                        disabled={!isExpanded || isMobile}
                        className={cn({
                            'py-2 px-8 flex-3': isExpanded && !isMobile,
                        })}
                    >
                        <FireTaskClassCardSheetExpandButton
                            isExpanded={isExpanded}
                            setIsExpanded={setIsExpanded}
                        />
                        <FireTaskClassCardSheetHeader task={task} />

                        <Separator className="my-4" />
                        <FireTaskClassCardSheetContent
                            task={task}
                            participants={participants}
                        />

                        <Separator className="my-4" />
                        <FireTaskClassCardSheetFiles task={task} />
                    </FireScrollArea>

                    <Separator
                        className={cn({
                            'mr-4': isExpanded && !isMobile,
                            'my-4': !isExpanded || isMobile,
                        })}
                        orientation={
                            isExpanded && !isMobile ? 'vertical' : 'horizontal'
                        }
                    />

                    <FireScrollArea
                        disabled={!isExpanded}
                        className={cn({
                            'py-2 px-4 flex-2': isExpanded && !isMobile,
                        })}
                    >
                        <FireTaskClassCardSheetComments task={task} />
                    </FireScrollArea>
                </FireScrollArea>
            </SheetContent>
        </Sheet>
    );
}
