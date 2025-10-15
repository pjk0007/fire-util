import { Calendar } from '@/components/ui/calendar';
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
import { FireUser } from '@/lib/FireAuth/settings';
import { localeDateString } from '@/lib/FireChat/utils/timeformat';
import updateTaskDueDate from '@/lib/FireTask/api/updateTaskDueDate';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_DUE_DATE_FIELD,
    TASK_ID_FIELD,
    TASK_LOCALE,
} from '@/lib/FireTask/settings';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface FireTaskClassCardSubDueDateProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    task: FT;
}

export default function FireTaskClassCardSubDueDate<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task }: FireTaskClassCardSubDueDateProps<FT, FU>) {
    const [open, setOpen] = useState(false);

    return (
        <Tooltip>
            <TooltipTrigger>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger onClick={(e) => e.stopPropagation()} asChild>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground hover:bg-muted py-0.5 px-1 rounded-sm">
                            <CalendarIcon className="w-3 h-3" />
                            {task[TASK_DUE_DATE_FIELD] ? (
                                <div>
                                    {localeDateString(
                                        task[TASK_DUE_DATE_FIELD]
                                    )}
                                </div>
                            ) : (
                                <div>{TASK_LOCALE.NO_DUE_DATE}</div>
                            )}
                        </div>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                    >
                        <Calendar
                            mode="single"
                            selected={task[TASK_DUE_DATE_FIELD]?.toDate()}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                                updateTaskDueDate(
                                    task[TASK_CHANNEL_ID_FIELD],
                                    task[TASK_ID_FIELD],
                                    date
                                );
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </TooltipTrigger>
            {task[TASK_DUE_DATE_FIELD] && (
                <TooltipContent side="left">
                    {TASK_LOCALE.CARD.DUE_DATE}
                </TooltipContent>
            )}
        </Tooltip>
    );
}
