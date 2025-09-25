import FireChatChannelListItem from '@/components/FireChat/FireChatChannelList/FireChatChannelListItem';
import { useFireChat } from '@/components/FireProvider/FireChatProvider';
import { useAuth } from '@/components/provider/AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';

export default function FireChatChannelList() {
    const { user: me } = useAuth();
    const isMobile = useIsMobile();
    const { selectedChannelId, channelIds, setSelectedChannelId } =
        useFireChat();

    if (selectedChannelId && isMobile) {
        return null;
    }

    return (
        <div className="flex flex-col w-full md:min-w-80 md:max-w-80 h-full gap-2 border-r bg-background">
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
