import { FireUser } from '@/lib/FireAuth/settings';
import { db, storage } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/components/FireChannel/settings';
import isImageFile from '@/lib/FireUtil/isImageFile';
import {
    TASK_COLLECTION,
    TASK_COMMENT_CONTENT_FIELD,
    TASK_COMMENT_CREATED_AT_FIELD,
    TASK_COMMENT_FILES_FIELD,
    TASK_COMMENT_ID_FIELD,
    TASK_COMMENT_IMAGES_FIELD,
    TASK_COMMENT_UPDATED_AT_FIELD,
    TASK_COMMENT_USER_FIELD,
    TASK_COMMENTS_FIELD,
    TASK_UPDATED_AT_FIELD,
} from '@/lib/FireTask/settings';
import { arrayUnion, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default async function addTaskComment<FU extends FireUser>(
    channelId: string,
    taskId: string,
    user: FU | null | undefined,
    commentContent: string,
    commentImages: File[],
    commentFiles: File[]
) {
    if (!user) {
        return;
    }
    const commentId = `comment-${Date.now()}`;
    const promises = [...commentImages, ...commentFiles].map(async (file) => {
        const type = isImageFile(file) ? 'images' : 'files';
        const storageRef = ref(
            storage,
            `${CHANNEL_COLLECTION}/${channelId}/${TASK_COLLECTION}/${taskId}/${TASK_COMMENTS_FIELD}/${commentId}/${type}/${Date.now()}_${
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
        [TASK_COMMENTS_FIELD]: arrayUnion({
            [TASK_COMMENT_ID_FIELD]: `comment-${Date.now()}`,
            [TASK_COMMENT_CONTENT_FIELD]: commentContent,
            [TASK_COMMENT_IMAGES_FIELD]: images,
            [TASK_COMMENT_FILES_FIELD]: otherFiles,
            [TASK_COMMENT_CREATED_AT_FIELD]: Timestamp.now(),
            [TASK_COMMENT_UPDATED_AT_FIELD]: Timestamp.now(),
            [TASK_COMMENT_USER_FIELD]: user,
        }),
        [TASK_UPDATED_AT_FIELD]: Timestamp.now(),
    });
}
