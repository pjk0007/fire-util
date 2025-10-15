import { FireUser, USER_ID_FIELD } from '@/lib/FireAuth/settings';
import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_USER_FIELD,
    TASK_COLLECTION,
    TASK_ID_FIELD,
    TASK_TITLE_FIELD,
    TASK_IMAGES_FIELD,
    TASK_FILES_FIELD,
    TASK_CONTENT_FIELD,
    TASK_STATUS_FIELD,
    TASK_STATUS_REQUEST,
    TASK_COMMENTS_FIELD,
    TASK_LAST_SEEN_FIELD,
    TASK_DUE_DATE_FIELD,
    TASK_CREATED_AT_FIELD,
    TASK_UPDATED_AT_FIELD,
} from '@/lib/FireTask/settings';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export default async function createTask<FU extends FireUser>(
    channelId: string,
    user: FU
) {
    const taskId = `task-${Date.now()}`;

    const taskRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        TASK_COLLECTION,
        taskId
    );

    const task: FireTask<FU> = {
        [TASK_ID_FIELD]: taskId,
        [TASK_CHANNEL_ID_FIELD]: channelId,
        [TASK_USER_FIELD]: user,
        [TASK_TITLE_FIELD]: '',
        [TASK_IMAGES_FIELD]: [],
        [TASK_FILES_FIELD]: [],
        [TASK_CONTENT_FIELD]: '',
        [TASK_STATUS_FIELD]: TASK_STATUS_REQUEST,
        [TASK_COMMENTS_FIELD]: [],
        [TASK_LAST_SEEN_FIELD]: {
            [user[USER_ID_FIELD]]: Timestamp.now(),
        },
        [TASK_DUE_DATE_FIELD]: null,
        [TASK_CREATED_AT_FIELD]: Timestamp.now(),
        [TASK_UPDATED_AT_FIELD]: Timestamp.now(),
    };

    await setDoc(taskRef, task);
}
