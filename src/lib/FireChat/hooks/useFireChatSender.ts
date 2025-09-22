import createSendingFiles from '@/lib/FireChat/utils/createSendingFiles';
import {
    CHANNEL_ID_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
    MESSAGE_TYPE_FILE,
    MESSAGE_TYPE_IMAGE,
} from '@/lib/FireChat/settings';

import { useState } from 'react';

export interface SendingFile {
    id: string;
    channelId: string;
    files: File[];
    type: typeof MESSAGE_TYPE_IMAGE | typeof MESSAGE_TYPE_FILE;
}

export default function useFireChatSender<
    C extends FcChannel<M, T>,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ channel }: { channel?: C }) {
    const [sendingFiles, setSendingFiles] = useState<SendingFile[]>([]);

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
        onSendingFiles,
        sendingFiles,
        setSendingFiles,
    };
}
