import FireEditor from '@/components/FireEditor/FireEditor';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import FireTaskClassCardSheetComments from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetComments';
import FireTaskClassCardSheetContent from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetContent';
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
    USER_NAME_FIELD,
} from '@/lib/FireAuth/settings';
import updateTaskLastSeen from '@/lib/FireTask/api/updateTaskLastSeen';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_COLLECTION,
    TASK_CONTENT_FIELD,
    TASK_DOC_FIELD,
    TASK_ID_FIELD,
    TASK_LAST_SEEN_FIELD,
    TASK_UPDATED_AT_FIELD,
} from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';
import { Content } from '@tiptap/react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import Tiptap from '@/components/Tiptap/Tiptap';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import useFireChannelInfo from '@/lib/FireChannel/hook/useFireChannelInfo';

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

    function updateDocContent(newContent: Content) {
        updateDoc(
            doc(
                db,
                CHANNEL_COLLECTION,
                task[TASK_CHANNEL_ID_FIELD],
                TASK_COLLECTION,
                task[TASK_ID_FIELD]
            ),
            {
                [TASK_DOC_FIELD]: newContent,
            }
        );
    }

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
                        {/* <FireTaskClassCardSheetContent task={task} /> */}
                        {/* <FireEditor
                            initialDoc={
                                task.doc ?? {
                                    blocks: [],
                                }
                            }
                            minHeight="240px"
                        /> */}
                        {
                            <Tiptap
                                id={task[TASK_ID_FIELD]}
                                defaultContent={task[TASK_CONTENT_FIELD] || {}}
                                onUpdate={updateDocContent}
                                mentionItems={participants.map(
                                    (p) => p[USER_NAME_FIELD]
                                )}
                                className="p-0 min-h-40"
                            />
                        }

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
