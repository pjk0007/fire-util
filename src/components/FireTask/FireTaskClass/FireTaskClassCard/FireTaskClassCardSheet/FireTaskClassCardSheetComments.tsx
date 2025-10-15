import FireTaskClassCardSheetCommentsComment from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetComments/FireTaskClassCardSheetCommentsComment';
import FireTaskClassCardSheetCommentsTextarea from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetComments/FireTaskClassCardSheetCommentsTextarea';
import FireImageViewDialog from '@/components/FireUI/FireImageViewDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import downloadFileFromUrl from '@/lib/FireChat/utils/downloadFileFromUrl';
import { formatSizeString } from '@/lib/FireChat/utils/sizeformat';
import {
    formatRelativeTime,
    localeDateString,
} from '@/lib/FireChat/utils/timeformat';
import updateTaskImagesAndFiles from '@/lib/FireTask/api/updateTaskImages';
import {
    FireTask,
    TASK_USER_FIELD,
    TASK_COMMENT_CONTENT_FIELD,
    TASK_COMMENT_CREATED_AT_FIELD,
    TASK_COMMENT_FILES_FIELD,
    TASK_COMMENT_IMAGES_FIELD,
    TASK_COMMENT_USER_FIELD,
    TASK_COMMENTS_FIELD,
    TASK_FILES_FIELD,
    TASK_LOCALE,
    TASK_TITLE_FIELD,
} from '@/lib/FireTask/settings';
import { ArrowUp, Clipboard, Link, Paperclip, X } from 'lucide-react';
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
                <FireTaskClassCardSheetCommentsComment
                    key={index}
                    taskTitle={task[TASK_TITLE_FIELD]}
                    comment={comment}
                />
            ))}
            <FireTaskClassCardSheetCommentsTextarea task={task} />
        </div>
    );
}
