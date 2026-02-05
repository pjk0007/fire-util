import { FireUser, USER_ID_FIELD } from '@/lib/FireAuth/settings';
import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/components/FireChannel/settings';
import {
    FireTask,
    FIRE_TASK_LOCALE,
    TASK_CHANNEL_ID_FIELD,
    TASK_COLLECTION,
    TASK_HISTORY_FIELD,
    TASK_ID_FIELD,
    TASK_STATUS_FIELD,
    TASK_TITLE_FIELD,
    TASK_UPDATED_AT_FIELD,
    TaskStatus,
} from '@/lib/FireTask/settings';
import { arrayUnion, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { sendTextMessage } from '@/components/FireChat/api/sendMessage';

export default async function updateTaskStatus<U extends FireUser>(
    user: U,
    task: FireTask<U>,
    newStatus: TaskStatus
) {
    const taskRef = doc(
        db,
        CHANNEL_COLLECTION,
        task[TASK_CHANNEL_ID_FIELD],
        TASK_COLLECTION,
        task[TASK_ID_FIELD]
    );
    await updateDoc(taskRef, {
        [TASK_STATUS_FIELD]: newStatus,
        [TASK_UPDATED_AT_FIELD]: Timestamp.now(),
        [TASK_HISTORY_FIELD]: task[TASK_HISTORY_FIELD]
            ? arrayUnion({
                  user,
                  before: task[TASK_STATUS_FIELD],
                  after: newStatus,
                  updatedAt: Timestamp.now(),
              })
            : [
                  {
                      user,
                      before: task[TASK_STATUS_FIELD],
                      after: newStatus,
                      updatedAt: Timestamp.now(),
                  },
              ],
    });

    const taskTitle = task[TASK_TITLE_FIELD] || FIRE_TASK_LOCALE.NOTIFICATION.NO_TITLE;
    const statusLabel = FIRE_TASK_LOCALE.STATUS[newStatus];
    sendTextMessage(
        task[TASK_CHANNEL_ID_FIELD],
        user[USER_ID_FIELD],
        `<b>${taskTitle}</b>: ${FIRE_TASK_LOCALE.NOTIFICATION.STATUS_CHANGE(statusLabel)}`
    );
}
