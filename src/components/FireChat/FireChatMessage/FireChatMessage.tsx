import FireChatMessageActionButtons from '@/components/FireChat/FireChatMessage/FireChatMessageActionButtons';
import FireChatMessageAvatar from '@/components/FireChat/FireChatMessage/FireChatMessageAvatar';
import FireChatMessageContent from '@/components/FireChat/FireChatMessage/FireChatMessageContent';
import FireChatMessageSystem from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageSystem';
import FireChatMessageContextMenu from '@/components/FireChat/FireChatMessage/FireChatMessageContextMenu';
import { Button } from '@/components/ui/button';
import handleEmojiReactionClick from '@/lib/FireChat/api/handleEmojiReactionClick';
import {
    FcMessage,
    FcMessageContent,
    FcMessageSystem,
    FcUser,
    LOCALE,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_REACTIONS_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_SYSTEM,
    MESSAGE_USER_ID_FIELD,
    USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { formatTimeString } from '@/lib/FireChat/utils/timeformat';
import { cn } from '@/lib/utils';

export default function FireChatMessage<
    M extends FcMessage<T>,
    T extends FcMessageContent,
    U extends FcUser
>({
    channelId,
    message,
    beforeMessage,
    afterMessage,
    participants,
    me,
    setReplyingMessage,
    onLoad,
}: {
    channelId: string;
    message: M;
    beforeMessage?: M;
    afterMessage?: M;
    participants: U[];
    me?: U | null;
    setReplyingMessage?: (message: M) => void;
    onLoad?: () => void;
}) {
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
        beforeMessage?.[MESSAGE_CREATED_AT_FIELD] &&
        Math.floor(beforeMessage?.[MESSAGE_CREATED_AT_FIELD].seconds / 60) ===
            Math.floor(message[MESSAGE_CREATED_AT_FIELD].seconds / 60);

    const isSameMinAsAfter =
        afterMessage?.[MESSAGE_CREATED_AT_FIELD] &&
        Math.floor(afterMessage?.[MESSAGE_CREATED_AT_FIELD].seconds / 60) ===
            Math.floor(message[MESSAGE_CREATED_AT_FIELD].seconds / 60);

    return (
        <FireChatMessageContextMenu
            message={message}
            me={me}
            channelId={channelId}
            setReplyingMessage={setReplyingMessage}
        >
            <div
                onLoad={onLoad}
                data-seconds={message[MESSAGE_CREATED_AT_FIELD].seconds}
                id={`message-${message[MESSAGE_ID_FIELD]}`}
                className={cn('flex group w-full gap-3', {
                    'justify-end': isMine,
                    'justify-start': !isMine,
                    'mt-3': !isSameUserAndSameMinAsBefore,
                })}
            >
                {isMine ? null : isSameUserAndSameMinAsBefore ? (
                    <div className="w-8" />
                ) : (
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
                    {!isSameUserAndSameMinAsBefore && !isMine && (
                        <p className="text-sm text-foreground font-medium">
                            {messageUser?.name || LOCALE.UNKNOWN}
                        </p>
                    )}
                    <div className="flex flex-col relative">
                        <FireChatMessageContent
                            message={message}
                            me={me}
                            participants={participants}
                        />
                        {isSameMinAsAfter ? null : (
                            <div
                                className={cn(
                                    'text-nowrap text-xs text-muted-foreground visible group-hover:invisible absolute md:items-center bottom-1',
                                    {
                                        'left-[calc(100%+8px)]': !isMine,
                                        'right-[calc(100%+8px)]': isMine,
                                    }
                                )}
                            >
                                {formatTimeString(
                                    message[MESSAGE_CREATED_AT_FIELD]
                                )}
                            </div>
                        )}

                        <FireChatMessageActionButtons
                            channelId={channelId}
                            isMine={isMine}
                            message={message}
                            me={me}
                            setReplyingMessage={setReplyingMessage}
                        />
                    </div>
                    {Object.entries(message[MESSAGE_REACTIONS_FIELD] || {})
                        .length > 0 && (
                        <div className="flex gap-1 mb-2">
                            {Object.entries(
                                message[MESSAGE_REACTIONS_FIELD] || {}
                            ).map(([emoji, userIds]) => (
                                <Button
                                    key={emoji}
                                    variant={'outline'}
                                    size="sm"
                                    className={cn(
                                        'rounded-sm px-1.5 py-1 text-xs gap-2 h-[22px]',
                                        {
                                            'border-primary bg-primary/5':
                                                userIds.includes(
                                                    me?.[USER_ID_FIELD] || ''
                                                ),
                                        }
                                    )}
                                    onClick={() => {
                                        handleEmojiReactionClick({
                                            channelId,
                                            message,
                                            emoji,
                                            userId: me?.[USER_ID_FIELD] || '',
                                        });
                                    }}
                                >
                                    <p>{emoji} </p>
                                    <p>{userIds.length}</p>
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </FireChatMessageContextMenu>
    );
}
