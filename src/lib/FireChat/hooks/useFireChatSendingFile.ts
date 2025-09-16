import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { storage } from '@/lib/firebase';
import sendMessage from '@/lib/FireChat/api/sendMessage';
import updateLastMessage from '@/lib/FireChat/api/updateLastMessage';
import { SendingFile } from '@/lib/FireChat/hooks/useFireChatSender';
import {
    CHANNEL_COLLECTION,
    CHANNEL_ID_FIELD,
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
import { Timestamp } from 'firebase/firestore';
import {
    getDownloadURL,
    ref,
    uploadBytesResumable,
    UploadTask,
} from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';

export default function useFireChatSendingFile({
    channelId,
    file,
}: {
    channelId: string;
    file: File;
}) {
    const { user: me } = useFireChat();
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const uploadTaskRef = useRef<UploadTask | null>(null);

    useEffect(() => {
        if (isCompleted) return;
        if (!channelId) return;

        setProgress(0);

        const now = Timestamp.now();
        const msgId = `${MESSAGE_COLLECTION}-${now.seconds}${now.nanoseconds}`;
        const metadata = {
            contentType: file.type,
        };
        const storageRef = ref(
            storage,
            `${CHANNEL_COLLECTION}/${channelId}/${MESSAGE_COLLECTION}/${msgId}/${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
        uploadTaskRef.current = uploadTask;

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const prog = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                setProgress(prog);
            },
            (err) => {
                console.log(file.name);

                console.log(err);
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                const msg: FcMessage<FcMessageFile> = {
                    [MESSAGE_ID_FIELD]: msgId,
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
    }, [file, channelId]);

    function cancelUpload() {
        if (uploadTaskRef.current) {
            uploadTaskRef.current.cancel();
            setIsCompleted(true);
        }
    }

    return { progress, error, isCompleted, cancelUpload };
}
