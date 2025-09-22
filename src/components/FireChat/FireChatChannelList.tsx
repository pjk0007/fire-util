import FireChatChannelListItem from '@/components/FireChat/FireChatChannelList/FireChatChannelListItem';
import { useFireChat } from '@/components/provider/FireChatProvider';
import { useAuth } from '@/components/provider/AuthProvider';

export default function FireChatChannelList() {
    const { user: me } = useAuth();
    const { selectedChannelId, channelIds, setSelectedChannelId } =
        useFireChat();

    return (
        <div className="flex flex-col w-full md:w-80 h-full gap-2 border-r bg-background">
            {channelIds.map((channelId) => (
                <FireChatChannelListItem
                    key={channelId}
                    channelId={channelId}
                    isSelected={selectedChannelId === channelId}
                    selectChannel={() => setSelectedChannelId(channelId)}
                    me={me}
                />
            ))}
        </div>
    );
}
