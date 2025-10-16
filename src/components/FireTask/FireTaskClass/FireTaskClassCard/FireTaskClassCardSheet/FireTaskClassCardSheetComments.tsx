import FireTaskClassCardSheetCommentsComment from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetComments/FireTaskClassCardSheetCommentsComment';
import FireTaskClassCardSheetCommentsTextarea from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSheet/FireTaskClassCardSheetComments/FireTaskClassCardSheetCommentsTextarea';
import {
    FireUser,
} from '@/lib/FireAuth/settings';
import {
    FireTask,
    TASK_COMMENTS_FIELD,
    FIRE_TASK_LOCALE,
    TASK_TITLE_FIELD,
} from '@/lib/FireTask/settings';

interface FireTaskClassCardSheetCommentsProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    task: FT;
}

export default function FireTaskClassCardSheetComments<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task }: FireTaskClassCardSheetCommentsProps<FT, FU>) {
    return (
        <div className="flex flex-col">
            <div className="text-sm font-medium flex gap-1 mb-3">
                <span>{FIRE_TASK_LOCALE.SHEET.COMMENTS}</span>
                <span className="text-muted-foreground">
                    {task[TASK_COMMENTS_FIELD].length}
                </span>
            </div>
            {task[TASK_COMMENTS_FIELD].map((comment, index) => (
                <FireTaskClassCardSheetCommentsComment
                    key={index}
                    taskTitle={task[TASK_TITLE_FIELD]}
                    comment={comment}
                />
            ))}
            <FireTaskClassCardSheetCommentsTextarea task={task} />
        </div>
    );
}
