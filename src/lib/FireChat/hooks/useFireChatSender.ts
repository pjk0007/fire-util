import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { db, storage } from '@/lib/firebase';
import createSendingFiles from '@/lib/FireChat/utils/createSendingFiles';
import sendMessage from '@/lib/FireChat/api/sendMessage';
import updateLastMessage from '@/lib/FireChat/api/updateLastMessage';
import {
    CHANNEL_COLLECTION,
    CHANNEL_ID_FIELD,
    CHANNEL_LAST_MESSAGE_FIELD,
    FcChannel,
    FcChannelParticipants,
    FcMessage,
    FcMessageContent,
    FcMessageImage,
    FcMessageSystem,
    FcMessageText,
    FcUser,
    LARGE_FILE_SIZE,
    MESSAGE_COLLECTION,
    MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CONTENT_URL_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_REPLY_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_FILE,
    MESSAGE_TYPE_IMAGE,
    MESSAGE_TYPE_SYSTEM,
    MESSAGE_USER_ID_FIELD,
    USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import createThumbnail from '@/lib/FireChat/utils/createThumbnail';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import {
    getDownloadURL,
    ref,
    uploadBytes,
    uploadString,
} from 'firebase/storage';
import { useState } from 'react';

export interface SendingFile {
    id: string;
    channelId: string;
    files: File[];
    type: typeof MESSAGE_TYPE_IMAGE | typeof MESSAGE_TYPE_FILE;
}

export default function useFireChatSender<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ channel, user }: { channel?: C; user?: U }) {
    console.log('rerender');

    const [files, setFiles] = useState<File[]>([]);
    const [sendingFiles, setSendingFiles] = useState<SendingFile[]>([]);

    async function sendTextMessage<M extends FcMessage<FcMessageText>>(
        message: string,
        replyingMessage?: M
    ) {
        if (!message.trim() || !channel) return;

        const now = Timestamp.now();
        const msg = {
            [MESSAGE_ID_FIELD]: `${MESSAGE_COLLECTION}-${now.seconds}${now.nanoseconds}`,
            [MESSAGE_USER_ID_FIELD]: user?.[USER_ID_FIELD] || '',
            [MESSAGE_CREATED_AT_FIELD]: now,
            [MESSAGE_TYPE_FIELD]: 'text',
            [MESSAGE_CONTENTS_FIELD]: [
                {
                    [MESSAGE_TYPE_FIELD]: 'text',
                    [MESSAGE_CONTENT_TEXT_FIELD]: message,
                },
            ],
            [MESSAGE_REPLY_FIELD]: replyingMessage ?? null,
        } as M;
        if (channel) {
            await sendMessage(channel[CHANNEL_ID_FIELD], msg);
            await updateLastMessage(channel[CHANNEL_ID_FIELD], msg);
        }
    }

    function onSendingFiles(files: File[]) {
        if (!channel) return;
        if (files.length === 0) return;

        const sendingFiles = createSendingFiles(
            channel?.[CHANNEL_ID_FIELD],
            files
        );
        setSendingFiles((prev) => [...prev, ...sendingFiles]);
    }

    async function sendImagesMessage(files: File[]) {
        const imageFiles = files.filter((file) =>
            file.type.startsWith('image/')
        );
        if (imageFiles.length === 0 || !channel) return;

        const now = Timestamp.now();
        const msgId = `${MESSAGE_COLLECTION}-${now.seconds}${now.nanoseconds}`;
        // Implement the logic to upload images and send image messages
        // After sending, clear the files state
        const contentsPromise = imageFiles.map(async (file) => {
            const thumbnail = await createThumbnail(file);
            // upload thumbnail and get URL
            const msgPath = `${CHANNEL_COLLECTION}/${channel[CHANNEL_ID_FIELD]}/${MESSAGE_COLLECTION}/${msgId}`;
            const thumbnailRef = ref(
                storage,
                `${msgPath}/thumbnail_${file.name}`
            );
            const fileRef = ref(storage, `${msgPath}/${file.name}`);
            await uploadString(thumbnailRef, thumbnail);
            const thumbnailUrl = await getDownloadURL(thumbnailRef);

            // upload original image and get URL
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            return {
                [MESSAGE_TYPE_FIELD]: MESSAGE_TYPE_IMAGE,
                [MESSAGE_CONTENT_URL_FIELD]: url,
                [MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD]: thumbnailUrl,
            } as FcMessageImage;
        });
        const contents = await Promise.all(contentsPromise);
        const msg = {
            [MESSAGE_ID_FIELD]: msgId,
            [MESSAGE_USER_ID_FIELD]: user?.[USER_ID_FIELD] || '',
            [MESSAGE_CREATED_AT_FIELD]: now,
            [MESSAGE_TYPE_FIELD]: MESSAGE_TYPE_IMAGE,
            [MESSAGE_CONTENTS_FIELD]: contents,
        } as FcMessage<FcMessageImage>;
        await sendMessage(channel[CHANNEL_ID_FIELD], msg);
        await updateLastMessage(channel[CHANNEL_ID_FIELD], msg);
    }

    return {
        files,
        setFiles,
        sendTextMessage,
        onSendingFiles,
        sendingFiles,
        setSendingFiles,
    };
}
