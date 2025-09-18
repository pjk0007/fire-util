import FireChatChannelRoom from '@/components/FireChat/FireChatChannelRoom';
import FireChatChannelList from '@/components/FireChat/FireChatChannelList';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { FireChatChannelProvider } from '@/components/FireChat/FireChatChannelProvider';
import { CHANNEL_ID_FIELD } from '@/lib/FireChat/settings';
import { useAuth } from '@/components/provider/AuthProvider';

export default function FireChat({
    showChannelList = true,
}: {
    showChannelList?: boolean;
}) {
    const { selectChannel, selectedChannelParticipants } = useFireChat();
    
    return (
        <div className="w-full h-full flex">
            {showChannelList && <FireChatChannelList />}

            <FireChatChannelRoom
                channelId={
                    selectedChannelParticipants?.channel[CHANNEL_ID_FIELD]
                }
                resetChannel={() => selectChannel(undefined)}
            />
        </div>
    );
}
