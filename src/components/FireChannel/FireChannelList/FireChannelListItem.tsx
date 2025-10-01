import FireChannelListItemAvatar from '@/components/FireChannel/FireChannelList/FireChannelListItemAvatar';
import FireChannelListItemLastChatContent from '@/components/FireChannel/FireChannelList/FireChannelListItemLastChatContent';
import FireChannelListItemLastChatTime from '@/components/FireChannel/FireChannelList/FireChannelListItemLastChatTime';
import FireChannelListItemTitle from '@/components/FireChannel/FireChannelList/FireChannelListItemTitle';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { Badge } from '@/components/ui/badge';
import useFireChannelInfo from '@/lib/FireChannel/hook/useFireChannelInfo';
import {
    FireMessage,
    FireMessageContent,
} from '@/lib/FireChat/settings';
import { FireChannel } from '@/lib/FireChannel/settings';
import { CHANNEL_ID_FIELD } from '@/lib/FireChannel/settings';
import { FireUser } from '@/lib/FireAuth/settings';
import { USER_ID_FIELD } from '@/lib/FireAuth/settings';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface FireChannelListItemProps {
    channelId: string;
    isSelected?: boolean;
    selectChannel: (channelId?: string) => void;
}

function FireChannelListItem<
    C extends FireChannel<M, T>,
    U extends FireUser,
    M extends FireMessage<T>,
    T extends FireMessageContent
>({ channelId, isSelected, selectChannel }: FireChannelListItemProps) {
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
                <FireChannelListItemAvatar
                    participants={participants}
                    me={me}
                />
            </div>

            <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center gap-4">
                    <FireChannelListItemTitle
                        channel={channel}
                        participants={participants}
                        isSelected={isSelected}
                    />
                    <FireChannelListItemLastChatTime channel={channel} />
                </div>
                <FireChannelListItemLastChatContent channel={channel} />
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

export default memo(FireChannelListItem);
