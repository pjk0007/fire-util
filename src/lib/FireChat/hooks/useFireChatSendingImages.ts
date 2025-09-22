import { useAuth } from '@/components/provider/AuthProvider';
import { storage } from '@/lib/firebase';
import sendMessage, { updateLastMessage } from '@/lib/FireChat/api/sendMessage';
import {
    CHANNEL_COLLECTION,
    FcMessage,
    FcMessageImage,
    MESSAGE_COLLECTION,
    MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD,
    MESSAGE_CONTENT_URL_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_IMAGE,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import createThumbnail from '@/lib/FireChat/utils/createThumbnail';
import { Timestamp } from 'firebase/firestore';
import {
    getDownloadURL,
    ref,
    uploadBytesResumable,
    uploadString,
    UploadTask,
} from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';

export default function useFireChatSendingImages({
    id,
    channelId,
    files,
}: {
    id: string;
    channelId: string;
    files: File[];
}) {
    const { user: me } = useAuth();
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [contents, setContents] = useState<FcMessageImage[]>([]);
    const uploadTaskRef = useRef<UploadTask[]>([]);

    useEffect(() => {
        if (isCompleted) return;
        if (!channelId) return;

        setProgress(0);
        setError(null);

        uploadTaskRef.current = [];
        files.forEach(async (file) => {

            const storageRef = ref(
                storage,
                `${CHANNEL_COLLECTION}/${channelId}/${MESSAGE_COLLECTION}/${id}/${file.name}`
            );
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTaskRef.current.push(uploadTask);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const prog = Math.round(
                        (snapshot.bytesTransferred /
                            snapshot.totalBytes /
                            files.length) *
                            100
                    );
                    setProgress((prev) => {
                        return Math.min(prev + prog, 100);
                    });
                },
                (err) => {
                    console.error(err);
                    setError(err.message);
                },
                async () => {
                    try {
                        const thumbnail = await createThumbnail(file);
                        const thumbnailRef = ref(
                            storage,
                            `${CHANNEL_COLLECTION}/${channelId}/${MESSAGE_COLLECTION}/${id}/thumbnail_${file.name}`
                        );
                        await uploadString(thumbnailRef, thumbnail, 'data_url');

                        const thumbnailUrl = await getDownloadURL(thumbnailRef);
                        const url = await getDownloadURL(
                            uploadTask.snapshot.ref
                        );

                        const content: FcMessageImage = {
                            [MESSAGE_TYPE_FIELD]: MESSAGE_TYPE_IMAGE,
                            [MESSAGE_CONTENT_URL_FIELD]: url,
                            [MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD]:
                                thumbnailUrl,
                        };
                        setContents((prev) => [...prev, content]);
                        // 모든 파일이 업로드 완료되었는지 확인
                    } catch (err) {
                        console.error(err);
                        setError((err as Error).message);
                        return;
                    }
                }
            );
        });

        return () => {
            uploadTaskRef.current.forEach((task) => {
                if (task) {
                    task.cancel();
                }
            });
        };
    }, [files, channelId, isCompleted, id]);

    useEffect(() => {
        if (contents.length === files.length && contents.length > 0) {
            (async () => {
                const now = Timestamp.now();
                const msgId = `${MESSAGE_COLLECTION}-${now.seconds}${now.nanoseconds}`;
                const msg: FcMessage<FcMessageImage> = {
                    [MESSAGE_ID_FIELD]: msgId,
                    [MESSAGE_USER_ID_FIELD]: me?.id || '',
                    [MESSAGE_CREATED_AT_FIELD]: Timestamp.now(),
                    [MESSAGE_TYPE_FIELD]: MESSAGE_TYPE_IMAGE,
                    [MESSAGE_CONTENTS_FIELD]: contents,
                };
                await sendMessage(channelId, msg);
                await updateLastMessage(channelId, msg);
                setIsCompleted(true);
            })();
        }
    }, [contents, files.length, channelId, me]);

    function cancelUpload() {
        uploadTaskRef.current.forEach((task) => {
            if (task) {
                task.cancel();
            }
        });
    }

    return { progress, error, isCompleted, cancelUpload };
}
