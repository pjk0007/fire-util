import FireChatMessageFile from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageFile';
import FireChatMessageImages from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageImages';
import FireChatMessageSystem from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageSystem';
import FireChatMessageText from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageText';
import { useFireChat } from '@/components/provider/FireChatProvider';
import {
    FcMessage,
    FcMessageContent,
    FcMessageFile,
    FcMessageImage,
    FcMessageSystem,
    FcMessageText,
    FcUser,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_REPLY_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_FILE,
    MESSAGE_TYPE_IMAGE,
    MESSAGE_TYPE_SYSTEM,
    MESSAGE_TYPE_TEXT,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { memo } from 'react';

function FireChatMessageContent<
    M extends FcMessage<T>,
    T extends FcMessageContent,
    U extends FcUser
>({
    message,
    me,
    participants,
}: {
    message: M;
    me?: U | null;
    participants: U[];
}) {
    if (
        !message[MESSAGE_CONTENTS_FIELD] ||
        message[MESSAGE_CONTENTS_FIELD].length === 0
    ) {
        return <div></div>;
    }
    

    const isMine = message[MESSAGE_USER_ID_FIELD] === me?.id;
    switch (message[MESSAGE_TYPE_FIELD]) {
        case MESSAGE_TYPE_TEXT:
            return (
                <FireChatMessageText
                    participants={participants}
                    content={
                        message[MESSAGE_CONTENTS_FIELD][0] as FcMessageText
                    }
                    replyingMessage={message[MESSAGE_REPLY_FIELD] ?? null}
                    isMine={isMine}
                />
            );
        case MESSAGE_TYPE_IMAGE:
            return (
                <FireChatMessageImages
                    message={message as FcMessage<FcMessageImage>}
                    participants={participants}
                />
            );
        case MESSAGE_TYPE_FILE:
            return (
                <FireChatMessageFile
                    message={message as FcMessage<FcMessageFile>}
                />
            );
        default:
            return <div></div>;
    }
}

export default memo(FireChatMessageContent);