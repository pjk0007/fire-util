import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { useFireTask } from '@/components/FireProvider/FireTaskProvider';
import FireTaskClassCardMain from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardMain';
import FireTaskClassCardMenu from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardMenu';
import FireTaskClassCardSub from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSub';
import { Card } from '@/components/ui/card';
import { FireUser, USER_ID_FIELD } from '@/lib/FireAuth/settings';
import {
    FireTask,
    TASK_CREATED_AT_FIELD,
    TASK_ID_FIELD,
    TASK_LAST_SEEN_FIELD,
    TASK_STATUS_FIELD,
    TASK_TITLE_FIELD,
    TASK_UPDATED_AT_FIELD,
    TaskStatus,
} from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface FireTaskClassCardProps<FT extends FireTask<FU>, FU extends FireUser> {
    task: FT;
    status: TaskStatus;
}

export default function FireTaskClassCard<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task, status }: FireTaskClassCardProps<FT, FU>) {
    const { user } = useFireAuth();
    const { setSelectedTaskId } = useFireTask();
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    const updatedAt = task[TASK_UPDATED_AT_FIELD]?.toDate();
    const lastSeen =
        task[TASK_LAST_SEEN_FIELD]?.[user?.[USER_ID_FIELD] || '']?.toDate();

    // If updatedAt or lastSeen is undefined, show as not seen
    const isUnseen = !lastSeen || updatedAt > lastSeen;

    // On mount, if the task is newly created (createdAt == updatedAt) and has no title, set to editing mode
    useEffect(() => {
        if (
            task[TASK_UPDATED_AT_FIELD].seconds ===
                task[TASK_CREATED_AT_FIELD].seconds &&
            task[TASK_UPDATED_AT_FIELD].nanoseconds ===
                task[TASK_CREATED_AT_FIELD].nanoseconds &&
            !task[TASK_TITLE_FIELD]
        ) {
            setIsEditingTitle(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
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
            onClick={() => {
                setSelectedTaskId(task[TASK_ID_FIELD]);
            }}
        >
            {isUnseen && (
                <span className="absolute flex size-3 left-1 top-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex size-3 rounded-full bg-destructive"></span>
                </span>
            )}
            <FireTaskClassCardMain
                task={task}
                isEditingTitle={isEditingTitle}
                setIsEditingTitle={setIsEditingTitle}
            />
            <FireTaskClassCardSub task={task} />
            <FireTaskClassCardMenu
                task={task}
                isEditingTitle={isEditingTitle}
                setIsEditingTitle={setIsEditingTitle}
            />
        </Card>
    );
}
