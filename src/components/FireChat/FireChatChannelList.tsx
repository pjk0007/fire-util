import FireChatChannelListItem from '@/components/FireChat/FireChatChannelList/FireChatChannelListItem';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { useAuth } from '@/components/provider/AuthProvider';
import { CHANNEL_ID_FIELD } from '@/lib/FireChat/settings';

export default function FireChatChannelList() {
    const { user: me } = useAuth();
    const { channels, selectChannel, selectedChannelParticipants } =
        useFireChat();

    return (
        <div className="flex flex-col w-full md:w-80 h-full gap-2 border-r bg-background">
            {channels.map((channel) => (
                <FireChatChannelListItem
                    key={channel.channel[CHANNEL_ID_FIELD]}
                    channel={channel.channel}
                    participants={channel.participants}
                    selectedChannel={selectedChannelParticipants?.channel}
                    selectChannel={selectChannel}
                    me={me}
                />
            ))}
        </div>
    );
}
