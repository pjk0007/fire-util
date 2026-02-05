import {
    FireUser,
    USER_ID_FIELD,
    USER_NAME_FIELD,
} from '@/lib/FireAuth/settings';
import {
    FireTask,
    FIRE_TASK_LOCALE,
    TASK_CHANNEL_ID_FIELD,
    TASK_COLLECTION,
    TASK_CONTENT_FIELD,
    TASK_FILES_FIELD,
    TASK_ID_FIELD,
    TASK_IMAGES_FIELD,
    TASK_TITLE_FIELD,
} from '@/lib/FireTask/settings';
import { Content } from '@tiptap/react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/components/FireChannel/settings';
import Tiptap from '@/components/Tiptap/Tiptap';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import updateTaskImagesAndFiles from '@/lib/FireTask/api/updateTaskImages';
import { formatSizeString } from '@/lib/FireUtil/sizeformat';
import isImageFile from '@/lib/FireUtil/isImageFile';
import { useRef } from 'react';
import { sendTextMessage } from '@/components/FireChat/api/sendMessage';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';

interface FireTaskSheetContentProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    task: FT;
    participants: FU[];
}

export default function FireTaskSheetContent<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task, participants }: FireTaskSheetContentProps<FT, FU>) {
    const { user } = useFireAuth();
    const initialContentRef = useRef(JSON.stringify(task[TASK_CONTENT_FIELD] || {}));
    const notificationSentRef = useRef(false);

    function updateDocContent(newContent: Content) {
        updateDoc(
            doc(
                db,
                CHANNEL_COLLECTION,
                task[TASK_CHANNEL_ID_FIELD],
                TASK_COLLECTION,
                task[TASK_ID_FIELD]
            ),
            {
                [TASK_CONTENT_FIELD]: newContent,
            }
        );

        const newContentStr = JSON.stringify(newContent);
        if (user && newContentStr !== initialContentRef.current && !notificationSentRef.current) {
            notificationSentRef.current = true;
            const taskTitle = task[TASK_TITLE_FIELD] || FIRE_TASK_LOCALE.NOTIFICATION.NO_TITLE;
            sendTextMessage(
                task[TASK_CHANNEL_ID_FIELD],
                user[USER_ID_FIELD],
                `<b>${taskTitle}</b>: ${FIRE_TASK_LOCALE.NOTIFICATION.CONTENT_EDIT}`
            );
        }
    }

    async function uploadFile(
        file: File,
        onProgress?: (event: { progress: number }) => void
    ): Promise<{
        fileName: string;
        fileSize: string;
        src: string;
    }> {
        const storageRef = ref(
            storage,
            `${CHANNEL_COLLECTION}/${task[TASK_CHANNEL_ID_FIELD]}/tasks/${task[TASK_ID_FIELD]}/files/${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    if (onProgress) {
                        onProgress({
                            progress: progress,
                        });
                    }
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(storageRef);
                    if (isImageFile(file)) {
                        updateTaskImagesAndFiles(
                            task[TASK_CHANNEL_ID_FIELD],
                            task[TASK_ID_FIELD],
                            [...(task[TASK_IMAGES_FIELD] || []), downloadURL],
                            task[TASK_FILES_FIELD] || []
                        );
                    } else {
                        updateTaskImagesAndFiles(
                            task[TASK_CHANNEL_ID_FIELD],
                            task[TASK_ID_FIELD],
                            task[TASK_IMAGES_FIELD] || [],
                            [
                                ...(task[TASK_FILES_FIELD] || []),
                                {
                                    name: file.name,
                                    url: downloadURL,
                                    size: file.size,
                                },
                            ]
                        );
                    }

                    resolve({
                        fileName: file.name,
                        fileSize: formatSizeString(file.size),
                        src: downloadURL,
                    });
                }
            );
        });
    }

    return (
        <Tiptap
            id={task[TASK_ID_FIELD]}
            defaultContent={task[TASK_CONTENT_FIELD] || {}}
            onBlur={updateDocContent}
            mentionItems={participants.map((p) => p[USER_NAME_FIELD])}
            className="p-0 min-h-40"
            uploadFile={uploadFile}
        />
    );
}
