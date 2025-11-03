import { FireUser } from '@/lib/FireAuth/settings';
import { db } from '@/lib/firebase';
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
    TaskStatus,
} from '@/lib/FireTask/settings';
import {
    collectionGroup,
    getDocs,
    query,
    Timestamp,
    where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

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

export default function useFireTaskHistory<U extends FireUser>(
    channelIds: string[],
    options?: {
        after?: string;
        before?: string;
        maxItems?: number;
    }
) {
    const [taskHistory, setTaskHistory] = useState<IFireTaskHistory<U>[]>([]);

    useEffect(() => {
        if (channelIds.length === 0) {
            setTaskHistory([]);
            return;
        }
        const taskHistoryQuery = query(
            collectionGroup(db, TASK_COLLECTION),
            where(TASK_CHANNEL_ID_FIELD, 'in', channelIds)
        );
        const taskHistorySnapshot = getDocs(taskHistoryQuery);

        taskHistorySnapshot.then((snapshot) => {
            const histories: IFireTaskHistory<U>[] = [];

            snapshot.forEach((doc) => {
                const data = doc.data() as FireTask<U>;
                const channelId = data[TASK_CHANNEL_ID_FIELD];
                const taskId = data[TASK_ID_FIELD];
                const title = data[TASK_TITLE_FIELD];

                // Create history entry
                if (timeFilter(data[TASK_CREATED_AT_FIELD], options)) {
                    histories.push({
                        type: 'create',
                        channelId,
                        taskId,
                        title,
                        create: {
                            user: data[TASK_USER_FIELD],
                        },
                        timestamp: data[TASK_CREATED_AT_FIELD],
                    });
                }

                // Comment histories
                if (
                    data[TASK_COMMENTS_FIELD] &&
                    data[TASK_COMMENTS_FIELD].length > 0
                ) {
                    data[TASK_COMMENTS_FIELD].forEach((comment) => {
                        if (
                            timeFilter(
                                comment[TASK_COMMENT_CREATED_AT_FIELD],
                                options
                            )
                        ) {
                            histories.push({
                                type: 'comment',
                                channelId,
                                taskId,
                                title,
                                comment: {
                                    content:
                                        comment[TASK_COMMENT_CONTENT_FIELD],
                                    user: comment[TASK_COMMENT_USER_FIELD],
                                },
                                timestamp:
                                    comment[TASK_COMMENT_CREATED_AT_FIELD],
                            });
                        }
                    });
                }

                // Status change histories
                if (
                    data[TASK_HISTORY_FIELD] &&
                    data[TASK_HISTORY_FIELD].length > 0
                ) {
                    data[TASK_HISTORY_FIELD].forEach((history) => {
                        if (timeFilter(history.updatedAt, options)) {
                            histories.push({
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
            setTaskHistory(
                histories
                    .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
                    .slice(0, options?.maxItems || histories.length)
            );
        });

        // Cleanup function
        return () => {
            setTaskHistory([]);
        };
    }, [channelIds, options?.after, options?.before, options?.maxItems]);

    return taskHistory;
}
