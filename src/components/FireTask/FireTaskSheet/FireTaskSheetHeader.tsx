import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import FireTaskSheetDate from '@/components/FireTask/FireTaskSheet/FireTaskSheetDate';
import FireTaskStatusDot from '@/components/FireTask/FireTaskStatusDot';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { FireUser, USER_ID_FIELD } from '@/lib/FireAuth/settings';
import useFireChannelInfo from '@/components/FireChannel/hook/useFireChannelInfo';
import { CHANNEL_TASK_NOTIFICATION_FIELD } from '@/components/FireChannel/settings';
import updateTaskStatus from '@/lib/FireTask/api/updateTaskStatus';
import updateTaskTitle from '@/lib/FireTask/api/updateTaskTitle';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_CREATED_AT_FIELD,
    TASK_DUE_DATE_FIELD,
    TASK_ID_FIELD,
    FIRE_TASK_LOCALE,
    TASK_STATUS_FIELD,
    TASK_STATUS_OPTIONS,
    TASK_TITLE_FIELD,
} from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { sendTextMessage } from '@/components/FireChat/api/sendMessage';

interface FireTaskSheetHeaderProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    task: FT;
}

export default function FireTaskSheetHeader<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task }: FireTaskSheetHeaderProps<FT, FU>) {
    const [localTitle, setLocalTitle] = useState(task[TASK_TITLE_FIELD]);
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const isMobile = useIsMobile();
    const { user } = useFireAuth();
    const { channel } = useFireChannelInfo({ channelId: task[TASK_CHANNEL_ID_FIELD] });
    const taskNotificationEnabled = channel?.[CHANNEL_TASK_NOTIFICATION_FIELD] ?? true;
    const initialTitleRef = useRef(task[TASK_TITLE_FIELD]);

    useEffect(() => {
        updateTaskTitle(
            task[TASK_CHANNEL_ID_FIELD],
            task[TASK_ID_FIELD],
            localTitle
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localTitle]);

    const handleTitleBlur = () => {
        if (user && localTitle !== initialTitleRef.current) {
            if (taskNotificationEnabled) {
                const isNewTask = !initialTitleRef.current;
                const message = isNewTask
                    ? `<b>${localTitle}</b>: ${FIRE_TASK_LOCALE.NOTIFICATION.NEW_TASK}`
                    : `<b>${localTitle}</b>: ${FIRE_TASK_LOCALE.NOTIFICATION.TITLE_EDIT}`;
                sendTextMessage(
                    task[TASK_CHANNEL_ID_FIELD],
                    user[USER_ID_FIELD],
                    message
                );
            }
            initialTitleRef.current = localTitle;
        }
    };

    return (
        <SheetHeader className="p-0 gap-4">
            <SheetTitle className="flex justify-between md:items-center items-start md:flex-row flex-col gap-2">
                <input
                    placeholder={FIRE_TASK_LOCALE.NO_TITLE}
                    className="flex-1 text-2xl ring-0 outline-0  md:mr-4"
                    value={localTitle}
                    onChange={(e) => {
                        setLocalTitle(e.target.value);
                    }}
                    onBlur={handleTitleBlur}
                    autoFocus
                />
                <DropdownMenu open={isOpenMenu} onOpenChange={setIsOpenMenu}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <FireTaskStatusDot
                                status={task[TASK_STATUS_FIELD]}
                            />
                            <div className="text-sm">
                                {
                                    FIRE_TASK_LOCALE.STATUS[
                                        task[TASK_STATUS_FIELD]
                                    ]
                                }
                            </div>
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align={isMobile ? 'start' : 'end'}
                        className="w-40"
                    >
                        {TASK_STATUS_OPTIONS.filter(
                            (option) => option.value !== task[TASK_STATUS_FIELD]
                        ).map((option) => (
                            <div
                                key={option.value}
                                className={cn(
                                    'text-sm cursor-pointer px-3 py-2 hover:bg-accent hover:text-accent-foreground flex items-center gap-2',
                                    option.value === task[TASK_STATUS_FIELD]
                                        ? 'bg-accent text-accent-foreground'
                                        : ''
                                )}
                                onClick={() => {
                                    if (!user) return;
                                    updateTaskStatus(user, task, option.value, taskNotificationEnabled);
                                    setIsOpenMenu(false);
                                }}
                            >
                                <FireTaskStatusDot status={option.value} />
                                {option.label}
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SheetTitle>
            <SheetDescription asChild>
                <div className="grid grid-cols-[100px_1fr] items-center gap-1 text-sm">
                    <div className="h-9 flex items-center gap-0.5">
                        <CalendarIcon className="w-3 h-3" />
                        {FIRE_TASK_LOCALE.CARD.CREATED_AT}
                    </div>
                    <FireTaskSheetDate
                        task={task}
                        dateField={TASK_CREATED_AT_FIELD}
                    />
                    <div className="h-9 flex items-center gap-0.5">
                        <CalendarIcon className="w-3 h-3" />
                        {FIRE_TASK_LOCALE.CARD.DUE_DATE}
                    </div>
                    <FireTaskSheetDate
                        task={task}
                        dateField={TASK_DUE_DATE_FIELD}
                    />
                </div>
            </SheetDescription>
        </SheetHeader>
    );
}
