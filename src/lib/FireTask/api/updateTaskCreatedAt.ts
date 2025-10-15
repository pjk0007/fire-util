import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import { TASK_COLLECTION, TASK_CREATED_AT_FIELD } from '@/lib/FireTask/settings';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';

export default async function updateTaskCreatedAt(
    channelId: string,
    taskId: string,
    newCreatedAt?: Date
) {
    const taskRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        TASK_COLLECTION,
        taskId
    );
    await updateDoc(taskRef, {
        [TASK_CREATED_AT_FIELD]: newCreatedAt
            ? Timestamp.fromDate(newCreatedAt)
            : null,
    });
}
