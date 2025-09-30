import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { storage } from '@/lib/firebase';
import sendMessage, { updateLastMessage } from '@/lib/FireChat/api/sendMessage';
import {
    FcMessage,
    FcMessageFile,
    MESSAGE_COLLECTION,
    MESSAGE_CONTENT_FILE_NAME_FIELD,
    MESSAGE_CONTENT_FILE_SIZE_FIELD,
    MESSAGE_CONTENT_URL_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_FILE,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import { Timestamp } from 'firebase/firestore';
import {
    getDownloadURL,
    ref,
    uploadBytesResumable,
    UploadTask,
} from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';

export default function useFireChatSendingFile({
    id,
    channelId,
    file,
}: {
    id: string;
    channelId: string;
    file: File;
}) {
    const { user: me } = useFireAuth();
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const uploadTaskRef = useRef<UploadTask | null>(null);

    useEffect(() => {
        if (isCompleted) return;
        if (!channelId) return;

        setProgress(0);

        const metadata = {
            contentType: file.type,
        };
        const storageRef = ref(
            storage,
            `${CHANNEL_COLLECTION}/${channelId}/${MESSAGE_COLLECTION}/${id}/${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
        uploadTaskRef.current = uploadTask;

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const prog =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(prog);
            },
            (err) => {
                setError(err.message);
                console.log(err);
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                const msg: FcMessage<FcMessageFile> = {
                    [MESSAGE_ID_FIELD]: id,
                    [MESSAGE_USER_ID_FIELD]: me?.id || '',
                    [MESSAGE_CREATED_AT_FIELD]: Timestamp.now(),
                    [MESSAGE_TYPE_FIELD]: MESSAGE_TYPE_FILE,
                    [MESSAGE_CONTENTS_FIELD]: [
                        {
                            [MESSAGE_CONTENT_URL_FIELD]: url,
                            [MESSAGE_TYPE_FIELD]: MESSAGE_TYPE_FILE,
                            [MESSAGE_CONTENT_FILE_NAME_FIELD]: file.name,
                            [MESSAGE_CONTENT_FILE_SIZE_FIELD]: file.size,
                        },
                    ],
                };
                await sendMessage(channelId, msg);
                await updateLastMessage(channelId, msg);
                setIsCompleted(true);
            }
        );

        return () => {
            if (uploadTaskRef.current) {
                uploadTaskRef.current.cancel();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, channelId]);

    function cancelUpload() {
        if (uploadTaskRef.current) {
            uploadTaskRef.current.cancel();
            setIsCompleted(true);
        }
    }

    return { progress, error, isCompleted, cancelUpload };
}
