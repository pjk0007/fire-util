import { useFireTask } from '@/components/FireProvider/FireTaskProvider';
import FireTaskClassCardMain from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardMain';
import FireTaskClassCardMenu from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardMenu';
import FireTaskClassCardSheet from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet';
import FireTaskClassCardSub from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSub';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { FireUser } from '@/lib/FireAuth/settings';
import { localeDateString } from '@/lib/FireChat/utils/timeformat';
import updateTaskDueDate from '@/lib/FireTask/api/updateTaskDueDate';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_CREATED_AT_FIELD,
    TASK_DUE_DATE_FIELD,
    TASK_ID_FIELD,
    TASK_LOCALE,
    TASK_STATUS_FIELD,
    TASK_TITLE_FIELD,
    TaskStatus,
} from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import { CalendarIcon, Ellipsis, MoveDiagonal2, PenLine } from 'lucide-react';
import { useState } from 'react';

interface FireTaskClassCardProps<FT extends FireTask<FU>, FU extends FireUser> {
    task: FT;
    status: TaskStatus;
}

export default function FireTaskClassCard<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task, status }: FireTaskClassCardProps<FT, FU>) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    return (
        <FireTaskClassCardSheet task={task}>
            <Card
                className={cn(
                    'relative p-3 rounded-lg h-24 flex flex-col justify-between gap-0 hover:shadow-sm cursor-pointer group shadow-none',
                    {
                        hidden: task[TASK_STATUS_FIELD] !== status,
                    }
                )}
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('id', task[TASK_ID_FIELD]);
                    e.dataTransfer.setData('title', task[TASK_TITLE_FIELD]);
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
            >
                <FireTaskClassCardMain
                    task={task}
                    isEditingTitle={isEditingTitle}
                    setIsEditingTitle={setIsEditingTitle}
                />
                <FireTaskClassCardSub task={task} />
                <FireTaskClassCardMenu
                    isEditingTitle={isEditingTitle}
                    setIsEditingTitle={setIsEditingTitle}
                />
            </Card>
        </FireTaskClassCardSheet>
    );
}
