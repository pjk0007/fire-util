import FireTaskClassCardSubDueDate from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSub/FireTaskClassCardSubDueDate';
import { FireUser } from '@/lib/FireAuth/settings';
import { localeDateString } from '@/lib/FireChat/utils/timeformat';
import {
    FireTask,
    TASK_COMMENTS_FIELD,
    TASK_DUE_DATE_FIELD,
    TASK_FILES_FIELD,
    TASK_IMAGES_FIELD,
    TASK_LOCALE,
} from '@/lib/FireTask/settings';
import { Calendar, MessageSquare, Paperclip } from 'lucide-react';

interface FireTaskClassCardSubProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    task: FT;
}

export default function FireTaskClassCardSub<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task }: FireTaskClassCardSubProps<FT, FU>) {
    return (
        <div className="w-full flex justify-between items-center">
            <FireTaskClassCardSubDueDate task={task} />
            <div className="text-xs text-foreground flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <div>{task[TASK_COMMENTS_FIELD].length}</div>
                </div>
                <div className="flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5" />
                    <div>
                        {task[TASK_IMAGES_FIELD].length +
                            task[TASK_FILES_FIELD].length}
                    </div>
                </div>
            </div>
        </div>
    );
}
