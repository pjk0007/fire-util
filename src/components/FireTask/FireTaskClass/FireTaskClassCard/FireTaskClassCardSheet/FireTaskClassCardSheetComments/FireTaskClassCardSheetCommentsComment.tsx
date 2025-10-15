import { FireTaskComment } from '@/lib/FireTask/settings';
import FireImageViewDialog from '@/components/FireUI/FireImageViewDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { formatSizeString } from '@/lib/FireUtil/sizeformat';
import {
    formatRelativeTime,
    localeDateString,
} from '@/lib/FireUtil/timeformat';
import {
    TASK_COMMENT_CONTENT_FIELD,
    TASK_COMMENT_CREATED_AT_FIELD,
    TASK_COMMENT_FILES_FIELD,
    TASK_COMMENT_IMAGES_FIELD,
    TASK_COMMENT_USER_FIELD,
    TASK_TITLE_FIELD,
} from '@/lib/FireTask/settings';
import { Link } from 'lucide-react';
import Image from 'next/image';
import truncateFilenameMiddle from '@/lib/FireUtil/truncateFilenameMiddle';
import { useIsMobile } from '@/hooks/use-mobile';

interface FireTaskClassCardSheetCommentsCommentProps<
    FC extends FireTaskComment<FU>,
    FU extends FireUser
> {
    taskTitle: string;
    comment: FC;
}

export default function FireTaskClassCardSheetCommentsComment<
    FC extends FireTaskComment<FU>,
    FU extends FireUser
>({ taskTitle, comment }: FireTaskClassCardSheetCommentsCommentProps<FC, FU>) {
    const isMobile = useIsMobile();
    return (
        <div className="text-sm text-foreground py-2 flex flex-col rounded-sm">
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
                    {(comment[TASK_COMMENT_USER_FIELD] as FU)[USER_NAME_FIELD]}
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
            <div className="pl-6 border-l ml-3 whitespace-pre-line">
                {comment[TASK_COMMENT_CONTENT_FIELD]}
            </div>
            <div className="flex flex-wrap gap-2 pl-6 border-l ml-3 py-1">
                {comment[TASK_COMMENT_IMAGES_FIELD]?.map((image, imgIndex) => (
                    <FireImageViewDialog
                        defaultIdx={imgIndex}
                        images={comment[TASK_COMMENT_IMAGES_FIELD]}
                        key={imgIndex}
                        dialogTitle={taskTitle}
                    >
                        <div className="w-20 h-20 rounded-sm relative border">
                            <img
                                src={image}
                                alt={`Image ${imgIndex + 1}`}
                                className="cursor-pointer object-cover w-full h-full rounded-sm"
                            />
                        </div>
                    </FireImageViewDialog>
                ))}
            </div>
            <div className="flex flex-col gap-1 pl-6 border-l ml-3 py-1">
                {comment[TASK_COMMENT_FILES_FIELD].map((file, index) => (
                    <div
                        key={index}
                        className="cursor-pointer p-2 group flex items-center justify-between text-xs bg-accent md:bg-transparent md:hover:bg-accent rounded-sm border"
                        onClick={() => {
                            downloadFileFromUrl(file.url, file.name);
                        }}
                    >
                        <div className="flex gap-3 items-center">
                            <Link size={16} />
                            <div className="text-sm flex gap-2 items-center">
                                <div className="font-semibold text-card-foreground">
                                    {truncateFilenameMiddle(
                                        file.name,
                                        isMobile ? 28 : 36
                                    )}
                                </div>
                                <div className="text-muted-foreground md:block hidden">
                                    {file.size
                                        ? formatSizeString(file.size)
                                        : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
