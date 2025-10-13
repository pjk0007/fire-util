import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import {
    TASK_COLLECTION,
    TASK_CONTENT_FIELD,
    TASK_TITLE_FIELD,
} from '@/lib/FireTask/settings';
import { doc, updateDoc } from 'firebase/firestore';

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
    });
}
