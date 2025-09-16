import FireChatMessageAvatar from '@/components/FireChat/FireChatMessage/FireChatMessageAvatar';
import FireChatMessageContent from '@/components/FireChat/FireChatMessage/FireChatMessageContent';
import FireChatMessageSystem from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageSystem';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import {
    FcMessage,
    FcMessageContent,
    FcMessageSystem,
    LOCALE,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_IMAGE,
    MESSAGE_TYPE_SYSTEM,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { formatTimeString } from '@/lib/FireChat/utils/timeformat';
import { cn } from '@/lib/utils';

export default function FireChatMessage<
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ message, beforeMessage }: { message: M; beforeMessage?: M }) {
    const { selectedChannel, user: me } = useFireChat();
    const participants = selectedChannel?.participants || [];
    const messageUser = participants.find((p) => p.id === message['userId']);

    if (message[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_SYSTEM) {
        return (
            <FireChatMessageSystem
                message={message as FcMessage<FcMessageSystem>}
            />
        );
    }

    const isSameUserAndSameMinAsBefore =
        beforeMessage?.[MESSAGE_USER_ID_FIELD] ===
            message[MESSAGE_USER_ID_FIELD] &&
        Math.floor(beforeMessage?.[MESSAGE_CREATED_AT_FIELD].seconds / 60) ===
            Math.floor(message[MESSAGE_CREATED_AT_FIELD].seconds / 60);

    if (
        isSameUserAndSameMinAsBefore &&
        message[MESSAGE_TYPE_FIELD] !== MESSAGE_TYPE_IMAGE
    ) {
        return (
            <div
                data-seconds={message[MESSAGE_CREATED_AT_FIELD].seconds}
                id={`message-${message[MESSAGE_ID_FIELD]}`}
                className={cn('flex w-full gap-4', {
                    'justify-end': message['userId'] === me?.id,
                    'justify-start': message['userId'] !== me?.id,
                })}
            >
                {message['userId'] !== me?.id && <div className="w-8" />}
                <div
                    className={cn('flex flex-col max-w-[78%] gap-2', {
                        'items-end': message['userId'] === me?.id,
                        'items-start': message['userId'] !== me?.id,
                    })}
                >
                    <FireChatMessageContent message={message} />
                </div>
            </div>
        );
    }
    return (
        <div
            data-seconds={message[MESSAGE_CREATED_AT_FIELD].seconds}
            id={`message-${message[MESSAGE_ID_FIELD]}`}
            className={cn('flex w-full gap-4 mt-3', {
                'justify-end': message['userId'] === me?.id,
                'justify-start': message['userId'] !== me?.id,
            })}
        >
            {message['userId'] !== me?.id && (
                <FireChatMessageAvatar message={message} />
            )}
            <div
                className={cn('flex flex-col max-w-[78%] gap-2', {
                    'items-end': message['userId'] === me?.id,
                    'items-start': message['userId'] !== me?.id,
                })}
            >
                <div
                    className={cn('flex items-center gap-2', {
                        'flex-row-reverse': message['userId'] === me?.id,
                        'flex-row': message['userId'] !== me?.id,
                    })}
                >
                    <p className="text-base text-foreground/80 font-bold">
                        {messageUser?.name || LOCALE.UNKNOWN}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatTimeString(message[MESSAGE_CREATED_AT_FIELD])}
                    </p>
                </div>
                <FireChatMessageContent message={message} />
            </div>
        </div>
    );
}
