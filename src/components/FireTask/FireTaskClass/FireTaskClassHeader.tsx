import { FireUser } from '@/lib/FireAuth/settings';
import { FireTask, TaskStatus } from '@/lib/FireTask/settings';
import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface FireTaskListHeaderProps<
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

export default function FireTaskListHeader<
    FT extends FireTask<FU>,
    FU extends FireUser
>({
    isOpen,
    onlyOpen,
    filteredTasks,
    taskStatusOption,
}: FireTaskListHeaderProps<FT, FU>) {
    return (
        <CollapsibleTrigger className="w-full flex justify-between px-2">
            <div className="flex gap-1 items-center">
                <div className="w-4 h-4 flex items-center justify-center">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: taskStatusOption?.color || 'gray',
                        }}
                    />
                </div>
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
