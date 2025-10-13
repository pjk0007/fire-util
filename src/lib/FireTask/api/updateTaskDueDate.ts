import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import { TASK_COLLECTION, TASK_DUE_DATE_FIELD } from '@/lib/FireTask/settings';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';

export default async function updateTaskDueDate(
    channelId: string,
    taskId: string,
    newDueDate?: Date
) {
    const taskRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        TASK_COLLECTION,
        taskId
    );
    await updateDoc(taskRef, {
        [TASK_DUE_DATE_FIELD]: newDueDate
            ? Timestamp.fromDate(newDueDate)
            : null,
    });
}
