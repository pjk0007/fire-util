import FireImageViewDialog from '@/components/FireUI/FireImageViewDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    FireUser,
    USER_AVATAR_FALLBACK_URL,
    USER_AVATAR_FIELD,
    USER_NAME_FIELD,
} from '@/lib/FireAuth/settings';
import {
    formatRelativeTime,
    localeDateString,
} from '@/lib/FireChat/utils/timeformat';
import updateTaskImagesAndFiles from '@/lib/FireTask/api/updateTaskImages';
import {
    FireTask,
    TASK_CHANNEL_USER_FIELD,
    TASK_COMMENT_CONTENT_FIELD,
    TASK_COMMENT_CREATED_AT_FIELD,
    TASK_COMMENT_IMAGES_FIELD,
    TASK_COMMENT_USER_FIELD,
    TASK_COMMENTS_FIELD,
    TASK_LOCALE,
    TASK_TITLE_FIELD,
} from '@/lib/FireTask/settings';
import { X } from 'lucide-react';
import Image from 'next/image';

interface FireTaskClassCardSheetCommentsProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    task: FT;
}

export default function FireTaskClassCardSheetComments<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task }: FireTaskClassCardSheetCommentsProps<FT, FU>) {
    return (
        <div className="flex flex-col">
            <div className="text-sm font-medium flex gap-1 mb-3">
                <span>{TASK_LOCALE.SHEET.COMMENTS}</span>
                <span className="text-muted-foreground">
                    {task[TASK_COMMENTS_FIELD].length}
                </span>
            </div>
            {task[TASK_COMMENTS_FIELD].map((comment, index) => (
                <div
                    key={index}
                    className="text-sm text-foreground p-2 flex flex-col hover:bg-accent rounded-sm"
                >
                    <div className="flex gap-3 items-center mb-1">
                        <Avatar className="w-6 h-6">
                            <AvatarImage
                                src={
                                    (comment[TASK_COMMENT_USER_FIELD] as FU)[
                                        USER_AVATAR_FIELD
                                    ] || undefined
                                }
                                alt="User Avatar"
                            />
                            <AvatarFallback>
                                <Image
                                    src={USER_AVATAR_FALLBACK_URL}
                                    alt={
                                        comment[TASK_COMMENT_USER_FIELD][
                                            USER_NAME_FIELD
                                        ]
                                    }
                                    width={24}
                                    height={24}
                                />
                            </AvatarFallback>
                        </Avatar>
                        <div className="font-semibold">
                            {
                                (comment[TASK_COMMENT_USER_FIELD] as FU)[
                                    USER_NAME_FIELD
                                ]
                            }
                        </div>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="text-xs text-muted-foreground">
                                    {formatRelativeTime(
                                        comment[TASK_COMMENT_CREATED_AT_FIELD]
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                {localeDateString(
                                    comment[TASK_COMMENT_CREATED_AT_FIELD]
                                )}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="pl-6 border-l ml-3">
                        {comment[TASK_COMMENT_CONTENT_FIELD]}
                    </div>
                    <div className="flex flex-wrap gap-2 pl-6 border-l ml-3 py-1">
                        {comment[TASK_COMMENT_IMAGES_FIELD]?.map(
                            (image, imgIndex) => (
                                <FireImageViewDialog
                                    defaultIdx={index}
                                    images={comment[TASK_COMMENT_IMAGES_FIELD]}
                                    key={index}
                                    dialogTitle={task[TASK_TITLE_FIELD]}
                                >
                                    <div className="w-20 h-20 rounded-sm relative">
                                        <img
                                            src={image}
                                            alt={`Image ${index + 1}`}
                                            className="cursor-pointer object-cover w-full h-full rounded-sm"
                                        />
                                    </div>
                                </FireImageViewDialog>
                            )
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
