import FireChatChannelListItemAvatar from '@/components/FireChat/FireChatChannelList/FireChatChannelListItemAvatar';
import FireChatChannelListItemLastChatContent from '@/components/FireChat/FireChatChannelList/FireChatChannelListItemLastChatContent';
import FireChatChannelListItemLastChatTime from '@/components/FireChat/FireChatChannelList/FireChatChannelListItemLastChatTime';
import FireChatChannelListItemTitle from '@/components/FireChat/FireChatChannelList/FireChatChannelListItemTitle';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import {
    CHANNEL_ID_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
    FcUser,
} from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface FireChatChannelListItemProps<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
> {
    channel: C;
    participants: U[];
    selectedChannel?: C | null;
    selectChannel: (channelId: string) => void;
    me?: U | null;
}

function FireChatChannelListItem<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({
    channel,
    participants,
    selectedChannel,
    selectChannel,
    me,
}: FireChatChannelListItemProps<C, U, M, T>) {
    return (
        <div
            className={cn('flex py-2 px-4 gap-4 items-start', {
                'bg-primary-foreground':
                    selectedChannel?.[CHANNEL_ID_FIELD] ===
                    channel[CHANNEL_ID_FIELD],

                'hover:bg-accent hover:text-accent-foreground cursor-pointer':
                    selectedChannel?.[CHANNEL_ID_FIELD] !==
                    channel[CHANNEL_ID_FIELD],
            })}
            onClick={() => selectChannel?.(channel[CHANNEL_ID_FIELD])}
        >
            <div className="w-14 h-14">
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
                        isSelected={
                            selectedChannel?.[CHANNEL_ID_FIELD] ===
                            channel[CHANNEL_ID_FIELD]
                        }
                    />
                    <FireChatChannelListItemLastChatTime channel={channel} />
                </div>
                <FireChatChannelListItemLastChatContent channel={channel} />
            </div>
        </div>
    );
}

export default memo(FireChatChannelListItem);
