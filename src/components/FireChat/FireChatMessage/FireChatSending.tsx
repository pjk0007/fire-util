import FireChatSendingFile from '@/components/FireChat/FireChatMessage/FireChatSending/FireChatSendingFile';
import FireChatSendingImages from '@/components/FireChat/FireChatMessage/FireChatSending/FireChatSendingImages';
import { SendingFile } from '@/lib/FireChat/hooks/useFireChatSender';
import { MESSAGE_TYPE_FILE, MESSAGE_TYPE_IMAGE } from '@/lib/FireChat/settings';

interface FireChatSendingProps {
    sendingFile: SendingFile;
}

export default function FireChatSending({ sendingFile }: FireChatSendingProps) {
    if (!sendingFile) return null;
    if (sendingFile.type === MESSAGE_TYPE_FILE) {
        return <FireChatSendingFile sendingFile={sendingFile} />;
    } else if (sendingFile.type === MESSAGE_TYPE_IMAGE) {
        return <FireChatSendingImages sendingFile={sendingFile} />;
    }
    return null;
}
