import FireChatChannelListItem from '@/components/FireChat/FireChatChannelList/FireChatChannelListItem';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { CHANNEL_ID_FIELD } from '@/lib/FireChat/settings';

export default function FireChatChannelList() {
    const isMobile = useIsMobile();
    const { selectedChannelId, channels, setSelectedChannelId } = useFireChannel();

    if (selectedChannelId && isMobile) {
        return null;
    }

    return (
        <div className="flex flex-col w-full md:min-w-80 md:max-w-80 h-full gap-2 border-r bg-background">
            {channels.map(({ [CHANNEL_ID_FIELD]: channelId }) => (
                <FireChatChannelListItem
                    key={channelId}
                    channelId={channelId}
                    isSelected={selectedChannelId === channelId}
                    selectChannel={() => setSelectedChannelId(channelId)}
                />
            ))}
        </div>
    );
}
