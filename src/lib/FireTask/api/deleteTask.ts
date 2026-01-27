import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/components/FireChannel/settings';
import { TASK_COLLECTION } from '@/lib/FireTask/settings';
import { deleteDoc, doc } from 'firebase/firestore';

export default async function deleteTask(channelId: string, taskId: string) {
    const taskRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        TASK_COLLECTION,
        taskId
    );

    await deleteDoc(taskRef);
}
