import FireTaskClassCardSheetComments from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetComments';
import FireTaskClassCardSheetContent from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetContent';
import FireTaskClassCardSheetExpandButton from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetExpandButton';
import FireTaskClassCardSheetFiles from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetFiles';
import FireTaskClassCardSheetHeader from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetHeader';
import FireEditor from '@/components/FireUI/FireEditor';
import FireScrollArea from '@/components/FireUI/FireScrollArea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { FireUser } from '@/lib/FireAuth/settings';
import updateTaskContent from '@/lib/FireTask/api/updateTaskContent';
import updateTaskTitle from '@/lib/FireTask/api/updateTaskTitle';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_COMMENTS_FIELD,
    TASK_CONTENT_FIELD,
    TASK_ID_FIELD,
    TASK_LOCALE,
    TASK_TITLE_FIELD,
} from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useRef, useState } from 'react';

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
    const [isExpanded, setIsExpanded] = useState(false);
    const isMobile = useIsMobile();

    return (
        <Sheet
            onOpenChange={(open) => {
                if (!open) {
                    setIsExpanded(false);
                }
            }}
        >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent
                className={cn('w-full transition-all', {
                    'sm:max-w-full pt-10': isExpanded && !isMobile,
                    'sm:max-w-1/2': !isExpanded || isMobile,
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
                        <FireTaskClassCardSheetContent task={task} />

                        <Separator className="my-4" />
                        <FireTaskClassCardSheetFiles task={task} />
                    </FireScrollArea>
                    {
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
                    }
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
