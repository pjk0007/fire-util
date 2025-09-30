import FireChatChannelListItemAvatar from '@/components/FireChannel/FireChannelList/FireChannelListItemAvatar';
import FireChatChannelListItemLastChatContent from '@/components/FireChannel/FireChannelList/FireChannelListItemLastChatContent';
import FireChatChannelListItemLastChatTime from '@/components/FireChannel/FireChannelList/FireChannelListItemLastChatTime';
import FireChatChannelListItemTitle from '@/components/FireChannel/FireChannelList/FireChannelListItemTitle';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { Badge } from '@/components/ui/badge';
import useFireChannelInfo from '@/lib/FireChannel/hook/useFireChannelInfo';
import {
    CHANNEL_ID_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
} from '@/lib/FireChat/settings';
import { FcUser } from '@/lib/FireAuth/settings';
import { USER_ID_FIELD } from '@/lib/FireAuth/settings';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface FireChatChannelListItemProps {
    channelId: string;
    isSelected?: boolean;
    selectChannel: (channelId?: string) => void;
}

function FireChatChannelListItem<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ channelId, isSelected, selectChannel }: FireChatChannelListItemProps) {
    const { user: me } = useFireAuth();
    const { channel, participants, unreadCount } = useFireChannelInfo<
        C,
        M,
        T,
        U
    >({
        channelId,
    });

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
