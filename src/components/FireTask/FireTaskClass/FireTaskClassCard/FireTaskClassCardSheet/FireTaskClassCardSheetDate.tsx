import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { FireUser } from '@/lib/FireAuth/settings';
import { localeDateString } from '@/lib/FireChat/utils/timeformat';
import updateTaskCreatedAt from '@/lib/FireTask/api/updateTaskCreatedAt';
import updateTaskDueDate from '@/lib/FireTask/api/updateTaskDueDate';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_CREATED_AT_FIELD,
    TASK_DUE_DATE_FIELD,
    TASK_ID_FIELD,
    TASK_LOCALE,
} from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function FireTaskClassCardSheetDate<
    FT extends FireTask<FU>,
    FU extends FireUser
>({
    task,
    dateField,
}: {
    task: FT;
    dateField: typeof TASK_DUE_DATE_FIELD | typeof TASK_CREATED_AT_FIELD;
}) {
    const [open, setOpen] = useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger onClick={(e) => e.stopPropagation()}>
                <div className={
                    cn("h-9 flex items-center gap-1 hover:bg-muted py-0.5 px-1 rounded-sm",{
                        'text-foreground': task[dateField],
                        'text-muted-foreground': !task[dateField],
                    })
                }>
                    {task[dateField]
                        ? localeDateString(task[dateField])
                        : TASK_LOCALE.EMPTY}
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
            >
                <Calendar
                    mode="single"
                    selected={task[dateField]?.toDate()}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                        if (dateField === TASK_DUE_DATE_FIELD) {
                            updateTaskDueDate(
                                task[TASK_CHANNEL_ID_FIELD],
                                task[TASK_ID_FIELD],
                                date
                            );
                        } else if (dateField === TASK_CREATED_AT_FIELD) {
                            updateTaskCreatedAt(
                                task[TASK_CHANNEL_ID_FIELD],
                                task[TASK_ID_FIELD],
                                date
                            );
                        }
                        setOpen(false);
                    }}
                />
                {dateField === TASK_DUE_DATE_FIELD && (
                    <>
                        <Separator />
                        <div
                            className="text-sm text-center hover:bg-accent cursor-pointer py-2"
                            onClick={() => {
                                updateTaskDueDate(
                                    task[TASK_CHANNEL_ID_FIELD],
                                    task[TASK_ID_FIELD],
                                    undefined
                                );
                                setOpen(false);
                            }}
                        >
                            삭제
                        </div>
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
}
