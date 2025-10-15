import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuShortcut,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import handleEmojiReactionClick from '@/lib/FireChat/api/handleEmojiReactionClick';
import {
    EMOJI_LIST,
    FireMessage,
    FireMessageContent,
    FireMessageText,
    FIRE_CHAT_LOCALE,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_REACTIONS_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_TEXT,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { FireUser } from '@/lib/FireAuth/settings';
import { USER_ID_FIELD } from '@/lib/FireAuth/settings';
import { cn } from '@/lib/utils';
import { Copy, CornerDownRight } from 'lucide-react';
import { ReactNode } from 'react';
import { toast } from 'sonner';

interface FireChatMessageContextMenuProps<M, U> {
    children: ReactNode;
    message: M;
    me?: U | null;
    channelId: string;
    setReplyingMessage?: (message: M) => void;
}

export default function FireChatMessageContextMenu<
    M extends FireMessage<T>,
    T extends FireMessageContent,
    U extends FireUser
>({
    children,
    message,
    me,
    channelId,
    setReplyingMessage,
}: FireChatMessageContextMenuProps<M, U>) {
    const selectedEmojis = [];
    const isMine = message[MESSAGE_USER_ID_FIELD] === me?.id;

    if (message[MESSAGE_REACTIONS_FIELD]) {
        for (const [emoji, userIds] of Object.entries(
            message[MESSAGE_REACTIONS_FIELD] || {}
        )) {
            if (userIds.includes(me?.[USER_ID_FIELD] || '')) {
                selectedEmojis.push(emoji);
            }
        }
    }
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent className="border-none shadow-none bg-transparent">
                <ToggleGroup
                    type="multiple"
                    size={'lg'}
                    value={selectedEmojis}
                    className={cn('h-11 p-0 bg-background mb-1 shadow-md', {
                        'left-[calc(100%+8px)]': !isMine,
                        'right-[calc(100%+8px)]': isMine,
                    })}
                >
                    {EMOJI_LIST.map((emoji, i) => (
                        <ToggleGroupItem
                            size={'lg'}
                            key={emoji}
                            value={emoji}
                            onClick={() => {
                                handleEmojiReactionClick({
                                    channelId,
                                    message,
                                    emoji,
                                    userId: me?.[USER_ID_FIELD] || '',
                                });
                            }}
                            asChild
                        >
                            <ContextMenuItem
                                className={cn('focus-visible:ring-0 focus-visible:border-input w-11 border-y border-r h-full', {
                                    'border-l': i === 0,
                                })}
                            >
                                {emoji}
                            </ContextMenuItem>
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
                {/* <ContextMenuSeparator /> */}
                <div className="bg-background border rounded-md shadow-md p-1">
                    {message[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_TEXT && (
                        <ContextMenuItem
                            className="px-2 py-3"
                            onSelect={() => {
                                const content = message[
                                    MESSAGE_CONTENTS_FIELD
                                ][0] as FireMessageText;
                                navigator.clipboard.writeText(
                                    content[MESSAGE_CONTENT_TEXT_FIELD]
                                );
                                toast.success(FIRE_CHAT_LOCALE.COPIED, {
                                    duration: 1000,
                                });
                            }}
                        >
                            {FIRE_CHAT_LOCALE.COPY}
                            <ContextMenuShortcut>
                                <Copy />
                            </ContextMenuShortcut>
                        </ContextMenuItem>
                    )}
                    <ContextMenuItem
                        className="px-2 py-3"
                        onSelect={() => setReplyingMessage?.(message)}
                    >
                        {FIRE_CHAT_LOCALE.REPLY}
                        <ContextMenuShortcut>
                            <CornerDownRight />
                        </ContextMenuShortcut>
                    </ContextMenuItem>
                </div>
            </ContextMenuContent>
        </ContextMenu>
    );
}
