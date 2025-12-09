import { db, storage } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import isImageFile from '@/lib/FireUtil/isImageFile';
import {
    TASK_COLLECTION,
    TASK_FILES_FIELD,
    TASK_IMAGES_FIELD,
    TASK_UPDATED_AT_FIELD,
} from '@/lib/FireTask/settings';
import { arrayUnion, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default async function uploadFilesToTask(
    channelId: string,
    taskId: string,
    files: File[]
) {
    const promises = files.map(async (file) => {
        const type = isImageFile(file) ? 'images' : 'files';
        const storageRef = ref(
            storage,
            `${CHANNEL_COLLECTION}/${channelId}/${TASK_COLLECTION}/${taskId}/${type}/${Date.now()}_${
                file.name
            }`
        );
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return { url, name: file.name, size: file.size, type };
    });

    const results = await Promise.all(promises);
    const images = results
        .filter((res) => res.type === 'images')
        .map((res) => res.url);
    const otherFiles = results
        .filter((res) => res.type === 'files')
        .map((res) => ({ name: res.name, url: res.url, size: res.size }));

    const taskRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        TASK_COLLECTION,
        taskId
    );
    await updateDoc(taskRef, {
        [TASK_IMAGES_FIELD]: arrayUnion(...images),
        [TASK_FILES_FIELD]: arrayUnion(...otherFiles),
        [TASK_UPDATED_AT_FIELD]: Timestamp.now(),
    });
}
