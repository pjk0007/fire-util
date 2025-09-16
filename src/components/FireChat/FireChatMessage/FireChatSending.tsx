import FireChatSendingFile from '@/components/FireChat/FireChatMessage/FireChatSending/FireChatSendingFile';
import { SendingFile } from '@/lib/FireChat/hooks/useFireChatSender';
import { MESSAGE_TYPE_FILE } from '@/lib/FireChat/settings';

interface FireChatSendingProps {
    sendingFile: SendingFile;
}

export default function FireChatSending({ sendingFile }: FireChatSendingProps) {
    if (!sendingFile) return null;
    if (sendingFile.type === MESSAGE_TYPE_FILE) {
        return <FireChatSendingFile sendingFile={sendingFile} />;
    }
    return null;
}
