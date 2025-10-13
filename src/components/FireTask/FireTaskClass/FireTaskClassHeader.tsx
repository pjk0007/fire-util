import FireTaskStatusDot from '@/components/FireTask/FireTaskStatusDot';
import { FireUser } from '@/lib/FireAuth/settings';
import {
    FireTask,
    TASK_STATUS_REQUEST,
    TaskStatus,
} from '@/lib/FireTask/settings';
import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface FireTaskClassHeaderProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    isOpen: boolean;
    onlyOpen?: boolean;
    filteredTasks: FT[];
    taskStatusOption?:
        | {
              value: TaskStatus;
              label: string;
              color: string;
          }
        | undefined;
}

export default function FireTaskClassHeader<
    FT extends FireTask<FU>,
    FU extends FireUser
>({
    isOpen,
    onlyOpen,
    filteredTasks,
    taskStatusOption,
}: FireTaskClassHeaderProps<FT, FU>) {
    return (
        <CollapsibleTrigger className="w-full flex justify-between px-2">
            <div className="flex gap-1 items-center">
                <FireTaskStatusDot
                    status={taskStatusOption?.value ?? TASK_STATUS_REQUEST}
                />
                <div className="text-sm text-foreground font-medium">
                    {taskStatusOption?.label}
                </div>
                <div className="text-sm text-muted-foreground">
                    {filteredTasks.length}
                </div>
            </div>

            {!onlyOpen ? (
                isOpen ? (
                    <ChevronUpIcon
                        className="text-muted-foreground"
                        size={20}
                    />
                ) : (
                    <ChevronDownIcon
                        className="text-muted-foreground"
                        size={20}
                    />
                )
            ) : null}
        </CollapsibleTrigger>
    );
}
