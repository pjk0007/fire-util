import FireChatMessageOrigin from '@/components/FireChat/ui/FireChatMessage/FireChatMessage';
import { memo, Fragment } from 'react';
import FireChatMessageSystem from '@/components/FireChat/ui/FireChatMessage/FireChatMessageContents/FireChatMessageSystem';
import FireChatSending from '@/components/FireChat/ui/FireChatMessage/FireChatSending';
import {
    FireMessage,
    FireMessageContent,
    FireMessageSystem,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_SYSTEM,
    MESSAGE_USER_ID_FIELD,
} from '@/components/FireChat/settings';
import { FireUser } from '@/lib/FireAuth/settings';
import { localeDateString } from '@/lib/FireUtil/timeformat';
import { SendingFile } from '@/components/FireChat/hooks/useFireChatSender';

const FireChatMessage = memo(FireChatMessageOrigin);

type FireChatChannelRoomBodyMessageListProps<
    M extends FireMessage<T>,
    T extends FireMessageContent,
    U extends FireUser
> = {
    beforeMessages: M[];
    messages: M[];
    // newMessages: M[];
    participants: U[];
    me?: U | null;
    setReplyingMessage?: (message?: FireMessage<FireMessageContent>) => void;
    channelId: string;
    sendingFiles: SendingFile[];
    getUnreadCountForMessage: (messageId: string) => number;
};

function renderMessages<
    M extends FireMessage<T>,
    T extends FireMessageContent,
    U extends FireUser
>(
    channelId: string,
    messages: M[],
    participants: U[],
    me: U | null | undefined,
    setReplyingMessage:
        | ((message?: FireMessage<FireMessageContent>) => void)
        | undefined,
    getUnreadCountForMessage: (messageId: string) => number
) {
    return messages.map((msg, index) => {
        const prevDate =
            index > 0
                ? messages[index - 1]?.[MESSAGE_CREATED_AT_FIELD]
                : null;
        const currentDate = msg?.[MESSAGE_CREATED_AT_FIELD];
        const key = `${msg[MESSAGE_ID_FIELD]}-${index}`;

        if (
            prevDate &&
            currentDate &&
            prevDate.toDate().toDateString() !==
                currentDate.toDate().toDateString()
        ) {
            return (
                <Fragment key={key}>
                    <FireChatMessageSystem
                        key={`date-separator-${msg[MESSAGE_ID_FIELD]}`}
                        message={
                            {
                                [MESSAGE_ID_FIELD]: `date-separator-${msg[MESSAGE_ID_FIELD]}`,
                                [MESSAGE_CREATED_AT_FIELD]: currentDate,
                                [MESSAGE_TYPE_FIELD]: MESSAGE_TYPE_SYSTEM,
                                [MESSAGE_USER_ID_FIELD]: 'system',
                                [MESSAGE_CONTENTS_FIELD]: [
                                    {
                                        [MESSAGE_CONTENT_TEXT_FIELD]:
                                            localeDateString(currentDate),
                                        [MESSAGE_TYPE_FIELD]:
                                            MESSAGE_TYPE_SYSTEM,
                                    },
                                ],
                            } as FireMessage<FireMessageSystem>
                        }
                    />
                    <FireChatMessage
                        channelId={channelId}
                        key={msg[MESSAGE_ID_FIELD] + index}
                        message={msg}
                        beforeMessage={
                            index > 0 ? messages[index - 1] : undefined
                        }
                        afterMessage={
                            index < messages.length - 1
                                ? messages[index + 1]
                                : undefined
                        }
                        participants={participants}
                        me={me}
                        setReplyingMessage={setReplyingMessage}
                        unreadCount={getUnreadCountForMessage(msg[MESSAGE_ID_FIELD])}
                    />
                </Fragment>
            );
        }
        return (
            <FireChatMessage
                channelId={channelId}
                key={msg[MESSAGE_ID_FIELD] + index}
                message={msg}
                afterMessage={
                    index < messages.length - 1
                        ? messages[index + 1]
                        : undefined
                }
                beforeMessage={index > 0 ? messages[index - 1] : undefined}
                participants={participants}
                me={me}
                setReplyingMessage={setReplyingMessage}
                unreadCount={getUnreadCountForMessage(msg[MESSAGE_ID_FIELD])}
            />
        );
    });
}

function FireChatChannelRoomBodyMessageList<
    M extends FireMessage<T>,
    T extends FireMessageContent,
    U extends FireUser
>({
    beforeMessages,
    messages,
    // newMessages,
    participants,
    me,
    setReplyingMessage,
    channelId,
    sendingFiles,
    getUnreadCountForMessage,
}: FireChatChannelRoomBodyMessageListProps<M, T, U>) {
    return (
        <>
            {renderMessages(
                channelId,
                beforeMessages,
                participants,
                me,
                setReplyingMessage,
                getUnreadCountForMessage
            )}
            {renderMessages(
                channelId,
                messages,
                participants,
                me,
                setReplyingMessage,
                getUnreadCountForMessage
            )}
            {/* {renderMessages(newMessages, participants, me, setReplyingMessage)} */}
            {sendingFiles
                .filter((sf) => sf.channelId === channelId)
                .map((sf, idx) => (
                    <FireChatSending key={`sending-${idx}`} sendingFile={sf} />
                ))}
        </>
    );
}

export default memo(FireChatChannelRoomBodyMessageList);
