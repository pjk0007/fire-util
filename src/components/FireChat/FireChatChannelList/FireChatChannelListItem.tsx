import FireChatChannelListItemAvatar from '@/components/FireChat/FireChatChannelList/FireChatChannelListItemAvatar';
import FireChatChannelListItemLastChatContent from '@/components/FireChat/FireChatChannelList/FireChatChannelListItemLastChatContent';
import FireChatChannelListItemLastChatTime from '@/components/FireChat/FireChatChannelList/FireChatChannelListItemLastChatTime';
import FireChatChannelListItemTitle from '@/components/FireChat/FireChatChannelList/FireChatChannelListItemTitle';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import {
    CHANNEL_ID_FIELD,
    FcChannel,
    FcChannelParticipants,
    FcMessage,
    FcMessageContent,
    FcMessageType,
    FcUser,
} from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';

interface FireChatChannelListItemProps<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
> {
    channel: FcChannelParticipants<C, U, M, T>;
}

export default function FireChatChannelListItem<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ channel }: FireChatChannelListItemProps<C, U, M, T>) {
    const { selectedChannel, selectChannel: handleSetSelectedChannel } = useFireChat();

    return (
        <div
            className={cn('flex py-2 px-4 gap-4 items-start', {
                'bg-primary-foreground':
                    selectedChannel?.channel[CHANNEL_ID_FIELD] ===
                    channel.channel[CHANNEL_ID_FIELD],

                'hover:bg-accent hover:text-accent-foreground cursor-pointer':
                    selectedChannel?.channel[CHANNEL_ID_FIELD] !==
                    channel.channel[CHANNEL_ID_FIELD],
            })}
            onClick={() =>
                handleSetSelectedChannel?.(channel.channel[CHANNEL_ID_FIELD])
            }
        >
            <div className="w-14 h-14">
                <FireChatChannelListItemAvatar {...channel} />
            </div>

            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center gap-4">
                    <FireChatChannelListItemTitle
                        {...channel}
                        isSelected={
                            selectedChannel?.channel[CHANNEL_ID_FIELD] ===
                            channel.channel[CHANNEL_ID_FIELD]
                        }
                    />
                    <FireChatChannelListItemLastChatTime {...channel} />
                </div>
                <FireChatChannelListItemLastChatContent {...channel} />
            </div>
        </div>
    );
}
