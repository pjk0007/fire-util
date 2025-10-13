import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import handleEmojiReactionClick from '@/lib/FireChat/api/handleEmojiReactionClick';
import {
    EMOJI_LIST,
    FireMessage,
    FireMessageContent,
    MESSAGE_REACTIONS_FIELD,
} from '@/lib/FireChat/settings';
import { FireUser } from '@/lib/FireAuth/settings';
import { USER_ID_FIELD } from '@/lib/FireAuth/settings';
import { cn } from '@/lib/utils';
import { CornerDownRight } from 'lucide-react';
import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';

interface FireChatMessageActionButtonsProps<M, U> {
    channelId: string;
    message: M;
    isMine: boolean;
    me?: U | null;
    setReplyingMessage?: (message: M) => void;
}

export default function FireChatMessageActionButtons<
    M extends FireMessage<T>,
    T extends FireMessageContent,
    U extends FireUser
>({
    channelId,
    message,
    isMine,
    me,
    setReplyingMessage,
}: FireChatMessageActionButtonsProps<M, U>) {
    const selectedEmojis: string[] = [];
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
        <ButtonGroup
            className={cn(
                'group-hover:visible invisible h-7 absolute md:flex md:items-center hidden bottom-1',
                {
                    'left-[calc(100%+8px)]': !isMine,
                    'right-[calc(100%+8px)]': isMine,
                }
            )}
        >
            <Button
                onClick={() => setReplyingMessage?.(message)}
                variant={'outline'}
                size={'icon-sm'}
            >
                <CornerDownRight />
            </Button>
            {EMOJI_LIST.map((emoji, i) => (
                <Button
                    key={emoji}
                    variant={'outline'}
                    className={cn('border-x-0', {
                        'bg-accent': selectedEmojis.includes(emoji),
                        'border-r': i === EMOJI_LIST.length - 1,
                    })}
                    size={'icon-sm'}
                    onClick={() => {
                        // Handle emoji reaction click
                        // recommend name of function
                        handleEmojiReactionClick({
                            channelId,
                            message,
                            emoji,
                            userId: me?.[USER_ID_FIELD] || '',
                        });
                    }}
                >
                    {emoji}
                </Button>
            ))}
        </ButtonGroup>
    );
}
