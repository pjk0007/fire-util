import FireChatMessageAvatar from '@/components/FireChat/FireChatMessage/FireChatMessageAvatar';
import FireChatMessageContent from '@/components/FireChat/FireChatMessage/FireChatMessageContent';
import FireChatMessageSystem from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageSystem';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
    FcMessage,
    FcMessageContent,
    FcMessageSystem,
    FcUser,
    LOCALE,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_IMAGE,
    MESSAGE_TYPE_SYSTEM,
    MESSAGE_USER_ID_FIELD,
    USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { formatTimeString } from '@/lib/FireChat/utils/timeformat';
import { cn } from '@/lib/utils';
import { CornerDownRight } from 'lucide-react';
import { ReactNode } from 'react';

export default function FireChatMessage<
    M extends FcMessage<T>,
    T extends FcMessageContent,
    U extends FcUser
>({
    message,
    beforeMessage,
    participants,
    me,
    selectReplyingMessage,
}: {
    message: M;
    beforeMessage?: M;
    participants: U[];
    me?: U | null;
    selectReplyingMessage?: (messageId: string) => void;
}) {
    // const participants = selectedChannel?.participants || [];
    const messageUser = participants.find(
        (p) => p[USER_ID_FIELD] === message[MESSAGE_USER_ID_FIELD]
    );

    if (message[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_SYSTEM) {
        return (
            <FireChatMessageSystem
                message={message as FcMessage<FcMessageSystem>}
            />
        );
    }

    const isMine = message[MESSAGE_USER_ID_FIELD] === me?.[USER_ID_FIELD];

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
                    onClick={() =>
                        selectReplyingMessage?.(message[MESSAGE_ID_FIELD])
                    }
                />
            </div>
        );
    }

    function MessageContextMenu({ children }: { children: ReactNode }) {
        return (
            <ContextMenu>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem
                        onSelect={() =>
                            selectReplyingMessage?.(message[MESSAGE_ID_FIELD])
                        }
                    >
                        {LOCALE.REPLY}
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        );
    }

    return (
        <MessageContextMenu>
            <div
                data-seconds={message[MESSAGE_CREATED_AT_FIELD].seconds}
                id={`message-${message[MESSAGE_ID_FIELD]}`}
                className={cn('flex group w-full gap-4', {
                    'justify-end': isMine,
                    'justify-start': !isMine,
                    'mt-3':
                        !isSameUserAndSameMinAsBefore ||
                        message[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_IMAGE,
                })}
            >
                {!isMine &&
                    isSameUserAndSameMinAsBefore &&
                    message[MESSAGE_TYPE_FIELD] !== MESSAGE_TYPE_IMAGE && (
                        <div className="w-8" />
                    )}
                {!isMine &&
                    (!isSameUserAndSameMinAsBefore ||
                        message[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_IMAGE) && (
                        <FireChatMessageAvatar
                            message={message}
                            participants={participants}
                        />
                    )}
                <div
                    className={cn('flex flex-col max-w-[78%] gap-2', {
                        'items-end': isMine,
                        'items-start': !isMine,
                    })}
                >
                    {(!isSameUserAndSameMinAsBefore ||
                        message[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_IMAGE) && (
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
                                {formatTimeString(
                                    message[MESSAGE_CREATED_AT_FIELD]
                                )}
                            </p>
                        </div>
                    )}
                    <div className="relative">
                        <FireChatMessageContent
                            message={message}
                            me={me}
                            participants={participants}
                        />

                        <ActionButtons />
                    </div>
                </div>
            </div>
        </MessageContextMenu>
    );
}
