import FireChatMessageOrigin from '@/components/FireChat/FireChatMessage/FireChatMessage';
import { memo, Fragment } from 'react';
import FireChatMessageSystem from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageSystem';
import FireChatSending from '@/components/FireChat/FireChatMessage/FireChatSending';
import {
    CHANNEL_ID_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
    FcMessageSystem,
    FcUser,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_SYSTEM,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { formatDateString } from '@/lib/FireChat/utils/timeformat';
import { SendingFile } from '@/lib/FireChat/hooks/useFireChatSender';

const FireChatMessage = memo(FireChatMessageOrigin);

type FireChatChannelRoomBodyMessageListProps<
    C extends FcChannel<M, T>,
    M extends FcMessage<T>,
    T extends FcMessageContent,
    U extends FcUser
> = {
    beforeMessages: M[];
    messages: M[];
    // newMessages: M[];
    participants: U[];
    me?: U | null;
    setReplyingMessage?: (message?: FcMessage<FcMessageContent>) => void;
    channelId: string;
    sendingFiles: SendingFile[];
};

function renderMessages<
    M extends FcMessage<T>,
    T extends FcMessageContent,
    U extends FcUser
>(
    channelId: string,
    messages: M[],
    participants: U[],
    me: U | null | undefined,
    setReplyingMessage:
        | ((message?: FcMessage<FcMessageContent>) => void)
        | undefined
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
                                            formatDateString(currentDate),
                                        [MESSAGE_TYPE_FIELD]:
                                            MESSAGE_TYPE_SYSTEM,
                                    },
                                ],
                            } as FcMessage<FcMessageSystem>
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
            />
        );
    });
}

function FireChatChannelRoomBodyMessageList<
    C extends FcChannel<M, T>,
    M extends FcMessage<T>,
    T extends FcMessageContent,
    U extends FcUser
>({
    beforeMessages,
    messages,
    // newMessages,
    participants,
    me,
    setReplyingMessage,
    channelId,
    sendingFiles,
}: FireChatChannelRoomBodyMessageListProps<C, M, T, U>) {
    return (
        <>
            {renderMessages(
                channelId,
                beforeMessages,
                participants,
                me,
                setReplyingMessage
            )}
            {renderMessages(
                channelId,
                messages,
                participants,
                me,
                setReplyingMessage
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
