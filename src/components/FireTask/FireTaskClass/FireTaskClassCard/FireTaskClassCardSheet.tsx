import FireTaskClassCardSheetComments from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetComments';
import FireTaskClassCardSheetExpandButton from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetExpandButton';
import FireTaskClassCardSheetHeader from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetHeader';
import FireEditor from '@/components/FireUI/FireEditor';
import FireScrollArea from '@/components/FireUI/FireScrollArea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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

    const [tempHTML, setTempHTML] = useState('');

    // useEffect(() => {
    //     updateTaskContent(
    //         task[TASK_CHANNEL_ID_FIELD],
    //         task[TASK_ID_FIELD],
    //         localContent
    //     );
    // }, [localContent]);

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent
                className={cn('w-full transition-all', {
                    'sm:max-w-full': isExpanded,
                    'sm:max-w-1/2': !isExpanded,
                })}
            >
                <FireScrollArea className="py-5 px-7 md:py-10 md:px-14 h-full">
                    <FireTaskClassCardSheetExpandButton
                        isExpanded={isExpanded}
                        setIsExpanded={setIsExpanded}
                    />
                    <FireTaskClassCardSheetHeader task={task} />

                    <Separator className="my-4" />
                    <textarea
                        className="w-full resize-none min-h-40 h-max py-2 px-0.5 text-sm outline-none"
                        placeholder={TASK_LOCALE.CARD.CONTENT_PLACEHOLDER}
                        value={localContent}
                        onChange={(e) => setLocalContent(e.target.value)}
                    />

                    {/* <FireEditor
                        defaultHTML={tempHTML}
                        onChange={(html) => {
                            console.log(html);
                            setTempHTML(html);
                        }}
                    /> */}
                    <Separator className="mt-8 mb-4" />
                    <FireTaskClassCardSheetComments task={task} />
                </FireScrollArea>
            </SheetContent>
        </Sheet>
    );
}
