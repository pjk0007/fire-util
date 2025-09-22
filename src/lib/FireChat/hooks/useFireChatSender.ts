import createSendingFiles from '@/lib/FireChat/utils/createSendingFiles';
import sendMessage, { updateLastMessage } from '@/lib/FireChat/api/sendMessage';
import {
    CHANNEL_ID_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
    FcMessageText,
    FcUser,
    MESSAGE_COLLECTION,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_REPLY_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_FILE,
    MESSAGE_TYPE_IMAGE,
    MESSAGE_USER_ID_FIELD,
    USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { Timestamp } from 'firebase/firestore';

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
>({ channel, user }: { channel: C | null; user?: U | null }) {
    const [files, setFiles] = useState<File[]>([]);
    const [sendingFiles, setSendingFiles] = useState<SendingFile[]>([]);

    // async function sendTextMessage<M extends FcMessage<FcMessageText>>(
    //     message: string,
    //     replyingMessage?: M
    // ) {
    //     if (!message.trim() || !channel) return;

    //     const now = Timestamp.now();
    //     const msg = {
    //         [MESSAGE_ID_FIELD]: `${MESSAGE_COLLECTION}-${now.seconds}${now.nanoseconds}`,
    //         [MESSAGE_USER_ID_FIELD]: user?.[USER_ID_FIELD] || '',
    //         [MESSAGE_CREATED_AT_FIELD]: now,
    //         [MESSAGE_TYPE_FIELD]: 'text',
    //         [MESSAGE_CONTENTS_FIELD]: [
    //             {
    //                 [MESSAGE_TYPE_FIELD]: 'text',
    //                 [MESSAGE_CONTENT_TEXT_FIELD]: message,
    //             },
    //         ],
    //         [MESSAGE_REPLY_FIELD]: replyingMessage ?? null,
    //     } as M;
    //     if (channel) {
    //         await sendMessage(channel[CHANNEL_ID_FIELD], msg);
    //         await updateLastMessage(channel[CHANNEL_ID_FIELD], msg);
    //     }
    // }

    function onSendingFiles(files: File[]) {
        if (!channel) return;
        if (files.length === 0) return;

        const sendingFiles = createSendingFiles(
            channel?.[CHANNEL_ID_FIELD],
            files
        );
        setSendingFiles((prev) => [...prev, ...sendingFiles]);
    }

    return {
        files,
        setFiles,
        // sendTextMessage,
        onSendingFiles,
        sendingFiles,
        setSendingFiles,
    };
}
