import FireChatChannelRoom from '@/components/FireChat/FireChatChannelRoom';
import FireChatChannelList from '@/components/FireChat/FireChatChannelList';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import { cn } from '@/lib/utils';
import FireChatChannelRoomHeader from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomHeader';

export default function FireChat({
    showChannelList = true,
}: {
    showChannelList?: boolean;
}) {
    const { selectedChannelId } = useFireChannel();
    return (
        <div className="w-full h-full flex">
            {showChannelList && <FireChatChannelList />}

            {selectedChannelId && <div className={cn('w-full h-full flex flex-col')}>
                <FireChatChannelRoomHeader />
                <FireChatChannelRoom />
            </div>}
        </div>
    );
}
