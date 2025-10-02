import { useFireTask } from '@/components/FireProvider/FireTaskProvider';
import FireTaskClassCard from '@/components/FireTask/FireTaskClass/FireTaskClassCard';
import FireTaskListHeader from '@/components/FireTask/FireTaskClass/FireTaskClassHeader';
import FireScrollArea from '@/components/FireUI/FireScrollArea';
import {
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { FireUser } from '@/lib/FireAuth/settings';
import {
    FireMessage,
    FireMessageImage,
    FireMessageText,
    MESSAGE_CONTENTS_FIELD,
} from '@/lib/FireChat/settings';
import {
    FireTask,
    TASK_ID_FIELD,
    TaskStatus,
    TASK_STATUS_FIELD,
    TASK_STATUS_OPTIONS,
    TASK_STATUS_REQUEST,
    TASK_STATUS_PROCEED,
} from '@/lib/FireTask/settings';
import { Collapsible } from '@radix-ui/react-collapsible';
import { useState } from 'react';

interface FireTaskClassProps {
    status: TaskStatus;
    onlyOpen?: boolean;
}

export default function FireTaskClass({
    onlyOpen,
    status,
}: FireTaskClassProps) {
    const { tasks } = useFireTask();
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
            className="min-w-68 bg-accent/80 rounded-lg py-3  bg-y flex flex-col gap-3"
            open={isOpen || onlyOpen}
            onOpenChange={setIsOpen}
        >
            <FireTaskListHeader
                isOpen={isOpen}
                onlyOpen={onlyOpen}
                filteredTasks={filteredTasks}
                taskStatusOption={taskStatusOption}
            />
            <CollapsibleContent className="h-[calc(100%-36px)]">
                <FireScrollArea className="flex flex-col gap-2 h-full px-2">
                    {filteredTasks.map((task) => (
                        <FireTaskClassCard
                            key={task[TASK_ID_FIELD]}
                            task={task}
                        />
                    ))}
                </FireScrollArea>
            </CollapsibleContent>
        </Collapsible>
    );
}
