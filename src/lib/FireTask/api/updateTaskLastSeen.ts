import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/components/FireChannel/settings';
import { TASK_COLLECTION, TASK_LAST_SEEN_FIELD } from '@/lib/FireTask/settings';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';

export default function updateTaskLastSeen(
    channelId: string,
    taskId: string,
    userId?: string
) {
    if (!userId) return;

    const taskRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        TASK_COLLECTION,
        taskId
    );
    return updateDoc(taskRef, {
        [`${TASK_LAST_SEEN_FIELD}.${userId}`]: Timestamp.now(),
    });
}
