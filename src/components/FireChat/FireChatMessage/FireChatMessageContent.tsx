import FireChatMessageFile from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageFile';
import FireChatMessageImages from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageImages';
import FireChatMessageText from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageText';
import {
    FireMessage,
    FireMessageContent,
    FireMessageFile,
    FireMessageImage,
    FireMessageText,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_REPLY_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_FILE,
    MESSAGE_TYPE_IMAGE,
    MESSAGE_TYPE_TEXT,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { FireUser } from '@/lib/FireAuth/settings';
import { memo } from 'react';

function FireChatMessageContent<
    M extends FireMessage<T>,
    T extends FireMessageContent,
    U extends FireUser
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
                        message[MESSAGE_CONTENTS_FIELD][0] as FireMessageText
                    }
                    replyingMessage={message[MESSAGE_REPLY_FIELD] ?? null}
                    isMine={isMine}
                />
            );
        case MESSAGE_TYPE_IMAGE:
            return (
                <FireChatMessageImages
                    message={message as FireMessage<FireMessageImage>}
                    participants={participants}
                />
            );
        case MESSAGE_TYPE_FILE:
            return (
                <FireChatMessageFile
                    message={message as FireMessage<FireMessageFile>}
                />
            );
        default:
            return <div></div>;
    }
}

export default memo(FireChatMessageContent);