import { FireUser } from '@/lib/FireAuth/settings';
import { FireTask, TASK_COMMENT_CONTENT_FIELD, TASK_COMMENTS_FIELD } from '@/lib/FireTask/settings';

interface FireTaskClassCardSheetCommentsProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    task: FT;
}

export default function FireTaskClassCardSheetComments<
    FT extends FireTask<FU>,
    FU extends FireUser
>({
    task,
}: FireTaskClassCardSheetCommentsProps<FT, FU>) {
    return (
        <div className='flex flex-col'>
            <div className="text-sm font-medium flex gap-1">
                <span>댓글</span>
                <span className="text-muted-foreground">
                    {task[TASK_COMMENTS_FIELD].length}
                </span>
            </div>
            {task[TASK_COMMENTS_FIELD].map((comment, index) => (
                <div key={index} className="text-sm text-foreground mt-1">
                    {comment[TASK_COMMENT_CONTENT_FIELD]}
                </div>
            ))}
        </div>
    );
}
