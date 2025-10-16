import FireTaskClassCardSheetDate from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetDate';
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
import { FireUser } from '@/lib/FireAuth/settings';
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
import { useEffect, useState } from 'react';

interface FireTaskClassCardSheetHeaderProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    task: FT;
}

export default function FireTaskClassCardSheetHeader<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task }: FireTaskClassCardSheetHeaderProps<FT, FU>) {
    const [localTitle, setLocalTitle] = useState(task[TASK_TITLE_FIELD]);
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        updateTaskTitle(
            task[TASK_CHANNEL_ID_FIELD],
            task[TASK_ID_FIELD],
            localTitle
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps --- IGNORE ---
    }, [localTitle]);

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
                    autoFocus
                />
                <DropdownMenu open={isOpenMenu} onOpenChange={setIsOpenMenu}>
                    <DropdownMenuTrigger>
                        <Button variant="outline">
                            <FireTaskStatusDot
                                status={task[TASK_STATUS_FIELD]}
                            />
                            <div className="text-sm">
                                {FIRE_TASK_LOCALE.STATUS[task[TASK_STATUS_FIELD]]}
                            </div>
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={isMobile ? 'start' : 'end'} className='w-40'>
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
                                    updateTaskStatus(
                                        task[TASK_CHANNEL_ID_FIELD],
                                        task[TASK_ID_FIELD],
                                        option.value
                                    );
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
                    <FireTaskClassCardSheetDate
                        task={task}
                        dateField={TASK_CREATED_AT_FIELD}
                    />
                    <div className="h-9 flex items-center gap-0.5">
                        <CalendarIcon className="w-3 h-3" />
                        {FIRE_TASK_LOCALE.CARD.DUE_DATE}
                    </div>
                    <FireTaskClassCardSheetDate
                        task={task}
                        dateField={TASK_DUE_DATE_FIELD}
                    />
                </div>
            </SheetDescription>
        </SheetHeader>
    );
}
