import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import {
    TASK_COLLECTION,
    TASK_FILES_FIELD,
    TASK_IMAGES_FIELD,
} from '@/lib/FireTask/settings';
import { doc, updateDoc } from 'firebase/firestore';

export default async function updateTaskImagesAndFiles(
    channelId: string,
    taskId: string,
    images: string[],
    files: { name: string; url: string; size: number }[]
) {
    const taskRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        TASK_COLLECTION,
        taskId
    );

    await updateDoc(taskRef, {
        [TASK_IMAGES_FIELD]: images,
        [TASK_FILES_FIELD]: files,
    });
}
