import FireChatMessageFile from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageFile';
import FireChatMessageImages from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageImages';
import FireChatMessageText from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageText';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import {
    FcMessage,
    FcMessageContent,
    FcMessageFile,
    FcMessageImage,
    FcMessageText,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';

export default function FireChatMessageContent<
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ message }: { message: M }) {
    const { user: me } = useFireChat();
    if (
        !message[MESSAGE_CONTENTS_FIELD] ||
        message[MESSAGE_CONTENTS_FIELD].length === 0
    ) {
        return <div></div>;
    }

    const isMine = message[MESSAGE_USER_ID_FIELD] === me?.id;
    switch (message[MESSAGE_TYPE_FIELD]) {
        case 'text':
            return (
                <FireChatMessageText
                    content={
                        message[MESSAGE_CONTENTS_FIELD][0] as FcMessageText
                    }
                    isMine={isMine}
                />
            );
        case 'images':
            return (
                <FireChatMessageImages
                    message={message as FcMessage<FcMessageImage>}
                />
            );
        case 'file':
            return (
                <FireChatMessageFile
                    message={message as FcMessage<FcMessageFile>}
                />
            );
        default:
            return <div></div>;
    }
}
