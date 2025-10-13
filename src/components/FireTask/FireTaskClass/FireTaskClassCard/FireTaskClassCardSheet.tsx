import FireTaskClassCardSheetExpandButton from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetExpandButton';
import FireTaskClassCardSheetHeader from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetHeader';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { FireUser } from '@/lib/FireAuth/settings';
import updateTaskContent from '@/lib/FireTask/api/updateTaskContent';
import updateTaskTitle from '@/lib/FireTask/api/updateTaskTitle';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_CONTENT_FIELD,
    TASK_ID_FIELD,
    TASK_TITLE_FIELD,
} from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useState } from 'react';

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
    const [localContent, setLocalContent] = useState(task[TASK_CONTENT_FIELD]);

    useEffect(() => {
        updateTaskContent(
            task[TASK_CHANNEL_ID_FIELD],
            task[TASK_ID_FIELD],
            localContent
        );
    }, [localContent]);

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent
                className={cn(
                    'py-5 px-7 md:py-10 md:px-14 w-full transition-all',
                    {
                        'sm:max-w-full': isExpanded,
                        'sm:max-w-1/2': !isExpanded,
                    }
                )}
            >
                <FireTaskClassCardSheetExpandButton
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                />
                <FireTaskClassCardSheetHeader task={task} />
                <textarea
                    className="text-sm resize-none min-h-[314px] h-fit py-2 px-0.5 text-sm outline-none"
                    placeholder="Description (coming soon)"
                    value={localContent}
                    onChange={(e) => setLocalContent(e.target.value)}
                />
                <Separator />
            </SheetContent>
        </Sheet>
    );
}
