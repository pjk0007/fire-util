import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/components/FireChannel/settings';
import {
    TASK_COLLECTION,
    TASK_CONTENT_FIELD,
    TASK_UPDATED_AT_FIELD,
} from '@/lib/FireTask/settings';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';

export default async function updateTaskContent(
    channelId: string,
    taskId: string,
    newContent: string
) {
    const taskRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        TASK_COLLECTION,
        taskId
    );
    await updateDoc(taskRef, {
        [TASK_CONTENT_FIELD]: newContent,
        [TASK_UPDATED_AT_FIELD]: Timestamp.now(),
    });
}
