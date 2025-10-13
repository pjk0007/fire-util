import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import {
    TASK_COLLECTION,
    TASK_STATUS_FIELD,
    TaskStatus,
} from '@/lib/FireTask/settings';
import { doc, updateDoc } from 'firebase/firestore';

export default async function updateTaskStatus(
    channelId: string,
    taskId: string,
    newStatus: TaskStatus
) {
    const taskRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        TASK_COLLECTION,
        taskId
    );
    await updateDoc(taskRef, {
        [TASK_STATUS_FIELD]: newStatus,
    });
}
