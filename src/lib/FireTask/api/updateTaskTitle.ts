import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/components/FireChannel/settings';
import { TASK_COLLECTION, TASK_TITLE_FIELD } from '@/lib/FireTask/settings';
import { doc, updateDoc } from 'firebase/firestore';

export default async function updateTaskTitle(
    channelId: string,
    taskId: string,
    newTitle: string
) {
    const taskRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        TASK_COLLECTION,
        taskId
    );
    await updateDoc(taskRef, {
        [TASK_TITLE_FIELD]: newTitle,
    });
}
