import FireTaskSheetCommentsComment from '@/components/FireTask/FireTaskSheet/FireTaskSheetComments/FireTaskSheetCommentsComment';
import FireTaskSheetCommentsTextarea from '@/components/FireTask/FireTaskSheet/FireTaskSheetComments/FireTaskSheetCommentsTextarea';
import {
    FireUser,
} from '@/lib/FireAuth/settings';
import {
    FireTask,
    TASK_COMMENTS_FIELD,
    FIRE_TASK_LOCALE,
    TASK_TITLE_FIELD,
} from '@/lib/FireTask/settings';

interface FireTaskSheetCommentsProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    task: FT;
}

export default function FireTaskSheetComments<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task }: FireTaskSheetCommentsProps<FT, FU>) {
    return (
        <div className="flex flex-col">
            <div className="text-sm font-medium flex gap-1 mb-3">
                <span>{FIRE_TASK_LOCALE.SHEET.COMMENTS}</span>
                <span className="text-muted-foreground">
                    {task[TASK_COMMENTS_FIELD].length}
                </span>
            </div>
            {task[TASK_COMMENTS_FIELD].map((comment, index) => (
                <FireTaskSheetCommentsComment
                    key={index}
                    taskTitle={task[TASK_TITLE_FIELD]}
                    comment={comment}
                />
            ))}
            <FireTaskSheetCommentsTextarea task={task} />
        </div>
    );
}
