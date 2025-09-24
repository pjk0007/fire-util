import FireChatChannelListItemAvatar from '@/components/FireChat/FireChatChannelList/FireChatChannelListItemAvatar';
import FireChatChannelListItemLastChatContent from '@/components/FireChat/FireChatChannelList/FireChatChannelListItemLastChatContent';
import FireChatChannelListItemLastChatTime from '@/components/FireChat/FireChatChannelList/FireChatChannelListItemLastChatTime';
import FireChatChannelListItemTitle from '@/components/FireChat/FireChatChannelList/FireChatChannelListItemTitle';
import { Badge } from '@/components/ui/badge';
import useFireChatChannelInfo from '@/lib/FireChat/hooks/useFireChatChannelInfo';
import {
    CHANNEL_ID_FIELD,
    CHANNEL_NAME_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
    FcUser,
    USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface FireChatChannelListItemProps<U extends FcUser> {
    // channel: C;
    channelId: string;
    isSelected?: boolean;
    selectChannel: (channelId?: string) => void;
    me?: U | null;
}

function FireChatChannelListItem<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({
    channelId,
    isSelected,
    selectChannel,
    me,
}: FireChatChannelListItemProps<U>) {
    const { channel, participants, unreadCount } = useFireChatChannelInfo<
        C,
        M,
        T,
        U
    >({
        channelId,
        userId: me?.[USER_ID_FIELD],
    });
    // const unreadCount = useFireChatUnreadCount<C, M, T>({
    //     channel,
    //     userId: me?.[USER_ID_FIELD],
    // });

    console.log(channel?.[CHANNEL_NAME_FIELD], unreadCount);

    return (
        <div
            className={cn('relative flex py-2 px-4 gap-4 items-start', {
                'bg-muted': isSelected,

                'hover:bg-accent hover:text-accent-foreground cursor-pointer':
                    !isSelected,
            })}
            onClick={() => selectChannel?.(channel?.[CHANNEL_ID_FIELD])}
        >
            <div className="w-14 h-14 relative">
                <FireChatChannelListItemAvatar
                    participants={participants}
                    me={me}
                />
            </div>

            <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center gap-4">
                    <FireChatChannelListItemTitle
                        channel={channel}
                        participants={participants}
                        isSelected={isSelected}
                    />
                    <FireChatChannelListItemLastChatTime channel={channel} />
                </div>
                <FireChatChannelListItemLastChatContent channel={channel} />
            </div>
            <Badge
                className="absolute right-2 bottom-2 rounded-full bg-destructive min-w-6 text-center"
                style={{
                    fontSize: 10,
                    padding: '4px 6px',
                    display: unreadCount > 0 ? 'block' : 'none',
                }}
            >
                {unreadCount <= 99 ? unreadCount : '99+'}
            </Badge>
        </div>
    );
}

export default memo(FireChatChannelListItem);
