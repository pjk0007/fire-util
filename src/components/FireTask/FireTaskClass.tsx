import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import { useFireTask } from '@/components/FireProvider/FireTaskProvider';
import FireTaskClassCard from '@/components/FireTask/FireTaskClass/FireTaskClassCard';
import FireTaskClassHeader from '@/components/FireTask/FireTaskClass/FireTaskClassHeader';
import FireScrollArea from '@/components/FireUI/FireScrollArea';
import { Card } from '@/components/ui/card';
import {
    CollapsibleContent,
} from '@/components/ui/collapsible';
import createTask from '@/lib/FireTask/api/createTask';
import updateTaskStatus from '@/lib/FireTask/api/updateTaskStatus';
import {
    TASK_ID_FIELD,
    TaskStatus,
    TASK_STATUS_FIELD,
    TASK_STATUS_OPTIONS,
    TASK_STATUS_REQUEST,
    TASK_STATUS_PROCEED,
    TASK_LOCALE,
    TASK_CHANNEL_ID_FIELD,
    TASK_UPDATED_AT_FIELD,
} from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import { Collapsible } from '@radix-ui/react-collapsible';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface FireTaskClassProps {
    status: TaskStatus;
    onlyOpen?: boolean;
}

export default function FireTaskClass({
    onlyOpen,
    status,
}: FireTaskClassProps) {
    const { selectedChannelId } = useFireChannel();
    const { tasks } = useFireTask();
    const { user } = useFireAuth();
    const [isDragOver, setIsDragOver] = useState(false);
    const [isOpen, setIsOpen] = useState(
        status === TASK_STATUS_REQUEST || status === TASK_STATUS_PROCEED
    );

    const taskStatusOption = TASK_STATUS_OPTIONS.find(
        (option) => option.value === status
    );

    const filteredTasks = tasks.filter(
        (task) => task[TASK_STATUS_FIELD] === status
    );

    return (
        <Collapsible
            className={cn(
                'min-w-68 bg-accent/80 rounded-lg py-3 flex flex-col gap-3',
                {
                    'ring-2 ring-primary': isDragOver,
                    'ring-0': !isDragOver,
                }
            )}
            open={isOpen || onlyOpen}
            onOpenChange={setIsOpen}
            onDragEnter={(e) => {
                e.preventDefault();
                setIsDragOver(true);
            }}
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
            }}
            onDragLeave={() => {
                setIsDragOver(false);
            }}
            onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);

                const draggedTaskId = e.dataTransfer.getData('id') as string;
                if (!draggedTaskId) return;
                if (
                    filteredTasks.some(
                        (task) => task[TASK_ID_FIELD] === draggedTaskId
                    )
                )
                    return;
                // 여기서 draggedTaskId를 사용하여 상태 업데이트 로직을 구현
                updateTaskStatus(
                    filteredTasks[0]?.[TASK_CHANNEL_ID_FIELD],
                    draggedTaskId,
                    status
                );
            }}
        >
            <FireTaskClassHeader
                isOpen={isOpen}
                onlyOpen={onlyOpen}
                filteredTasks={filteredTasks}
                taskStatusOption={taskStatusOption}
            />
            <CollapsibleContent className="h-[calc(100%-36px)]">
                <FireScrollArea className="flex flex-col gap-2 h-full px-2">
                    {status === TASK_STATUS_REQUEST && (
                        <Card
                            className="rounded-lg w-full h-11 gap-1 hover:shadow-sm items-center justify-center cursor-pointer shadow-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                // Create a new task
                                if (selectedChannelId && user) {
                                    createTask(selectedChannelId, user);
                                }
                            }}
                        >
                            <p className="text-sm flex font-medium items-center gap-2">
                                {TASK_LOCALE.ADD_TASK}
                                <Plus
                                    size={16}
                                    className="text-muted-foreground"
                                />
                            </p>
                        </Card>
                    )}
                    {tasks
                        .sort(
                            (a, b) =>
                                b[TASK_UPDATED_AT_FIELD].seconds -
                                a[TASK_UPDATED_AT_FIELD].seconds
                        )
                        .map((task) => (
                            <FireTaskClassCard
                                key={task[TASK_ID_FIELD]}
                                task={task}
                                status={status}
                            />
                        ))}
                    {filteredTasks.length === 0 && (
                        <div className="text-sm text-muted-foreground text-center">
                            {TASK_LOCALE.NO_TASKS}
                        </div>
                    )}
                </FireScrollArea>
            </CollapsibleContent>
        </Collapsible>
    );
}
