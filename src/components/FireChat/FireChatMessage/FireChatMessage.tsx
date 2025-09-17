import FireChatMessageAvatar from '@/components/FireChat/FireChatMessage/FireChatMessageAvatar';
import FireChatMessageContent from '@/components/FireChat/FireChatMessage/FireChatMessageContent';
import FireChatMessageSystem from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageSystem';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
import { CornerDownRight, MoreHorizontal, Reply } from 'lucide-react';

export default function FireChatMessage<
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ message, beforeMessage }: { message: M; beforeMessage?: M }) {
    const { selectedChannel, user: me, selectReplyingMessage } = useFireChat();
    const participants = selectedChannel?.participants || [];
    const messageUser = participants.find((p) => p.id === message['userId']);

    if (message[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_SYSTEM) {
        return (
            <FireChatMessageSystem
                message={message as FcMessage<FcMessageSystem>}
            />
        );
    }

    const isMine = message[MESSAGE_USER_ID_FIELD] === me?.id;

    const isSameUserAndSameMinAsBefore =
        beforeMessage?.[MESSAGE_USER_ID_FIELD] ===
            message[MESSAGE_USER_ID_FIELD] &&
        Math.floor(beforeMessage?.[MESSAGE_CREATED_AT_FIELD].seconds / 60) ===
            Math.floor(message[MESSAGE_CREATED_AT_FIELD].seconds / 60);

    function ActionButtons() {
        return (
            <div
                className={cn(
                    'h-7 group-hover:visible invisible absolute md:flex md:items-center hidden bottom-0 bg-white/40 rounded-sm transition-all',
                    {
                        'left-[calc(100%+8px)]': !isMine,
                        'right-[calc(100%+8px)]': isMine,
                    }
                )}
            >
                <CornerDownRight
                    className="w-8 px-2 rounded-lg text-foreground/60 hover:text-foreground"
                    onClick={() => selectReplyingMessage?.(message.id)}
                />
                <Separator
                    orientation="vertical"
                    className="bg-foreground/20 w-1"
                />
                <MoreHorizontal className="w-8 px-2 rounded-lg text-foreground/60 hover:text-foreground" />
            </div>
        );
    }

    if (
        isSameUserAndSameMinAsBefore &&
        message[MESSAGE_TYPE_FIELD] !== MESSAGE_TYPE_IMAGE
    ) {
        return (
            <div
                data-seconds={message[MESSAGE_CREATED_AT_FIELD].seconds}
                id={`message-${message[MESSAGE_ID_FIELD]}`}
                className={cn('flex group w-full gap-4', {
                    'justify-end': isMine,
                    'justify-start': !isMine,
                })}
            >
                {!isMine && <div className="w-8" />}
                <div
                    className={cn('flex flex-col max-w-[78%] gap-2', {
                        'items-end': isMine,
                        'items-start': !isMine,
                    })}
                >
                    <div className="relative">
                        <FireChatMessageContent message={message} />
                        <ActionButtons />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div
            data-seconds={message[MESSAGE_CREATED_AT_FIELD].seconds}
            id={`message-${message[MESSAGE_ID_FIELD]}`}
            className={cn('flex group w-full gap-4 mt-3', {
                'justify-end': isMine,
                'justify-start': !isMine,
            })}
        >
            {!isMine && <FireChatMessageAvatar message={message} />}
            <div
                className={cn('flex flex-col max-w-[78%] gap-2', {
                    'items-end': isMine,
                    'items-start': !isMine,
                })}
            >
                <div
                    className={cn('flex items-center gap-2', {
                        'flex-row-reverse': isMine,
                        'flex-row': !isMine,
                    })}
                >
                    <p className="text-base text-foreground/80 font-bold">
                        {messageUser?.name || LOCALE.UNKNOWN}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatTimeString(message[MESSAGE_CREATED_AT_FIELD])}
                    </p>
                </div>
                <div className="relative">
                    <FireChatMessageContent message={message} />
                    <ActionButtons />
                </div>
            </div>
        </div>
    );
}
