import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import { TASK_COLLECTION } from '@/lib/FireTask/settings';
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
        title: newTitle,
    });
}
