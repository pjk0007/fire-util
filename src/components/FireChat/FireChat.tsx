import FireChatChannelRoom from '@/components/FireChat/FireChatChannelRoom';
import FireChatChannelList from '@/components/FireChat/FireChatChannelList';
import { useFireChat } from '@/components/provider/FireChatProvider';
import { CHANNEL_ID_FIELD } from '@/lib/FireChat/settings';

export default function FireChat({
    showChannelList = true,
}: {
    showChannelList?: boolean;
}) {
    const { selectedChannelId, setSelectedChannelId } = useFireChat();

    return (
        <div className="w-full h-full flex">
            {showChannelList && <FireChatChannelList />}

            <FireChatChannelRoom
                channelId={selectedChannelId}
                resetChannel={() => setSelectedChannelId(undefined)}
            />
        </div>
    );
}
