import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/components/FireChannel/settings';
import {
    FireTask,
    IFireTaskHistory,
    TASK_CHANNEL_ID_FIELD,
    TASK_COLLECTION,
    TASK_COMMENT_CONTENT_FIELD,
    TASK_COMMENT_CREATED_AT_FIELD,
    TASK_COMMENT_USER_FIELD,
    TASK_COMMENTS_FIELD,
    TASK_CREATED_AT_FIELD,
    TASK_HISTORY_FIELD,
    TASK_ID_FIELD,
    TASK_TITLE_FIELD,
    TASK_USER_FIELD,
} from '@/lib/FireTask/settings';
import {
    collection,
    getDocs,
    orderBy,
    query,
    Timestamp,
    where,
} from 'firebase/firestore';

function timeFilter(
    timestamp: Timestamp,
    options?: { after?: string; before?: string }
): boolean {
    if (
        options?.after &&
        timestamp.seconds < new Date(options.after).getTime() / 1000
    ) {
        return false;
    }
    if (
        options?.before &&
        timestamp.seconds > new Date(options.before).getTime() / 1000
    ) {
        return false;
    }
    return true;
}

export default async function getTaskHistory<U>(matchId: string, date: string) {
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);
    const allTasksRef = collection(
        db,
        `${CHANNEL_COLLECTION}/${matchId}/${TASK_COLLECTION}`
    );

    const allTasks = await getDocs(
        query(
            allTasksRef,
            where('updatedAt', '>=', Timestamp.fromDate(dateStart)),
            where('updatedAt', '<=', Timestamp.fromDate(dateEnd)),
            orderBy('updatedAt', 'desc')
        )
    );

    const options = {
        after: dateStart.toISOString(),
        before: dateEnd.toISOString(),
    };

    const taskHistories: IFireTaskHistory<U>[] = [];

    allTasks.forEach((taskDoc) => {
        const taskData = taskDoc.data() as FireTask<U>;
        const channelId = taskData[TASK_CHANNEL_ID_FIELD];
        const taskId = taskData[TASK_ID_FIELD];
        const title = taskData[TASK_TITLE_FIELD];

        // Creation history
        if (timeFilter(taskData[TASK_CREATED_AT_FIELD], options)) {
            taskHistories.push({
                type: 'create',
                channelId,
                taskId,
                title,
                create: {
                    user: taskData[TASK_USER_FIELD],
                },
                timestamp: taskData[TASK_CREATED_AT_FIELD],
            });
        }

        // Comments history
        if (
            taskData[TASK_COMMENTS_FIELD] &&
            taskData[TASK_COMMENTS_FIELD].length > 0
        ) {
            taskData[TASK_COMMENTS_FIELD].forEach((comment) => {
                if (
                    timeFilter(comment[TASK_COMMENT_CREATED_AT_FIELD], options)
                ) {
                    taskHistories.push({
                        type: 'comment',
                        channelId,
                        taskId,
                        title,
                        comment: {
                            content: comment[TASK_COMMENT_CONTENT_FIELD],
                            user: comment[TASK_COMMENT_USER_FIELD],
                        },
                        timestamp: comment[TASK_COMMENT_CREATED_AT_FIELD],
                    });
                }
            });
        }

        // Status change history
        if (
            taskData[TASK_HISTORY_FIELD] &&
            taskData[TASK_HISTORY_FIELD].length > 0
        ) {
            taskData[TASK_HISTORY_FIELD].forEach((history) => {
                if (timeFilter(history.updatedAt, options)) {
                    taskHistories.push({
                        type: 'status',
                        channelId,
                        taskId,
                        title,
                        status: {
                            from: history.before,
                            to: history.after,
                            user: history.user,
                        },
                        timestamp: history.updatedAt,
                    });
                }
            });
        }
    });

    // Sort by timestamp descending
    taskHistories.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

    return taskHistories;
}
