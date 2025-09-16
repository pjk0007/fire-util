import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { db, storage } from '@/lib/firebase';
import sendMessage from '@/lib/FireChat/api/sendMessage';
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
    MESSAGE_COLLECTION,
    MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CONTENT_URL_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_TYPE_FIELD,
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
    uploadBytesResumable,
    uploadString,
} from 'firebase/storage';
import { useState } from 'react';

export default function useFireChatSender<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({
    selectedChannel,
    messages,
    user,
}: {
    selectedChannel?: FcChannelParticipants<C, U, M, T>;
    messages: FcMessage<FcMessageContent>[];
    user?: { [USER_ID_FIELD]: string; [key: string]: any } | null;
}) {
    async function updateLastMessage<
        M extends FcMessage<T>,
        T extends FcMessageContent
    >(msg: M) {
        if (!selectedChannel || messages.length === 0) return;
        await updateDoc(
            doc(
                db,
                CHANNEL_COLLECTION,
                selectedChannel.channel[CHANNEL_ID_FIELD]
            ),
            {
                [CHANNEL_LAST_MESSAGE_FIELD]: msg,
            }
        );
        // Update the last message in the channel document if needed
        // This part is optional and depends on your requirements
    }

    async function sendTextMessage<M extends FcMessage<FcMessageText>>(
        message: string
    ) {
        if (!message.trim() || !selectedChannel) return;

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
        } as M;
        if (selectedChannel) {
            await sendMessage(selectedChannel.channel[CHANNEL_ID_FIELD], msg);
            await updateLastMessage(msg);
        }
    }

    function createImagesSender() {}

    async function sendImagesMessage(files: File[]) {
        const imageFiles = files.filter((file) =>
            file.type.startsWith('image/')
        );
        if (imageFiles.length === 0 || !selectedChannel) return;

        const now = Timestamp.now();
        const msgId = `${MESSAGE_COLLECTION}-${now.seconds}${now.nanoseconds}`;
        // Implement the logic to upload images and send image messages
        // After sending, clear the files state
        const contentsPromise = imageFiles.map(async (file) => {
            const thumbnail = await createThumbnail(file);
            // upload thumbnail and get URL
            const msgPath = `${CHANNEL_COLLECTION}/${selectedChannel.channel[CHANNEL_ID_FIELD]}/${MESSAGE_COLLECTION}/${msgId}`;
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
        await sendMessage(selectedChannel.channel[CHANNEL_ID_FIELD], msg);
        await updateLastMessage(msg);
    }

    return {
        sendTextMessage,
    };
}
