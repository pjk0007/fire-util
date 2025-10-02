import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import {
    FireUser,
    USER_AVATAR_FALLBACK_URL,
    USER_AVATAR_FIELD,
    USER_NAME_FIELD,
} from '@/lib/FireAuth/settings';
import {
    getDateString,
    localeDateString,
} from '@/lib/FireChat/utils/timeformat';
import {
    FireTask,
    TASK_CHANNEL_USER_FIELD,
    TASK_COMMENTS_FIELD,
    TASK_DUE_DATE_FIELD,
    TASK_FILES_FIELD,
    TASK_IMAGES_FIELD,
    TASK_LOCALE,
    TASK_TITLE_FIELD,
} from '@/lib/FireTask/settings';
import { Calendar, MessageSquare, Paperclip } from 'lucide-react';
import Image from 'next/image';

interface FireTaskClassCardProps<FT extends FireTask<FU>, FU extends FireUser> {
    task: FT;
}

export default function FireTaskClassCard<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task }: FireTaskClassCardProps<FT, FU>) {
    return (
        <Card className="p-3 rounded-lg h-24 flex flex-col justify-between gap-0 hover:shadow-md cursor-pointer">
            <div className="flex justify-between items-center">
                <div className="md:max-w-40 max-w-64 text-sm text-card-foreground font-medium line-clamp-2 wrap-break-word">
                    {task[TASK_TITLE_FIELD]}
                </div>
                <Avatar className="w-6 h-6">
                    <AvatarImage
                        src={
                            (task[TASK_CHANNEL_USER_FIELD] as FU)[
                                USER_AVATAR_FIELD
                            ] || undefined
                        }
                        alt="User Avatar"
                    />
                    <AvatarFallback>
                        <Image
                            src={USER_AVATAR_FALLBACK_URL}
                            alt={task[TASK_CHANNEL_USER_FIELD][USER_NAME_FIELD]}
                            width={24}
                            height={24}
                        />
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {task[TASK_DUE_DATE_FIELD] ? (
                        <div>
                            {getDateString(task[TASK_DUE_DATE_FIELD], {
                                separator: '/',
                                fullYear: false,
                            })}
                        </div>
                    ) : (
                        <div>{TASK_LOCALE.NO_DUE_DATE}</div>
                    )}
                </div>
                <div className="text-xs text-foreground flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <div>{task[TASK_COMMENTS_FIELD].length}</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Paperclip className="w-3.5 h-3.5" />
                        <div>
                            {task[TASK_IMAGES_FIELD].length +
                                task[TASK_FILES_FIELD].length}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
