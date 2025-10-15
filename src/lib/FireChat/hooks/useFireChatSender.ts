import createSendingFiles from '@/lib/FireChat/utils/createSendingFiles';
import {
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

export default function useFireChatSender(channelId?: string) {
    const [sendingFiles, setSendingFiles] = useState<SendingFile[]>([]);

    function onSendingFiles(files: File[]) {
        if (!channelId) return;
        if (files.length === 0) return;

        const sendingFiles = createSendingFiles(channelId, files);
        setSendingFiles((prev) => [...prev, ...sendingFiles]);
    }

    return {
        onSendingFiles,
        sendingFiles,
        setSendingFiles,
    };
}
