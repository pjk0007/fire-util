import FireChatChannelRoom from '@/components/FireChat/FireChatChannelRoom';
import FireChannelList from '@/components/FireChannel/FireChannelList';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import { cn } from '@/lib/utils';
import FireChatChannelHeader from '@/components/FireChat/FireChatChannelHeader';
import FireKanbanList from '@/components/FireKanban/FireKanbanList';

export default function FireChat({
    showChannelList = true,
}: {
    showChannelList?: boolean;
}) {
    const { selectedChannelId } = useFireChannel();

    return (
        <div className="w-full h-full flex">
            {showChannelList && <FireChannelList />}
            {selectedChannelId && (
                <div className={cn('w-full h-full flex flex-col')}>
                    <FireChatChannelHeader />
                    <div className="relative flex h-[calc(100%-var(--firechat-header-height))]">
                        <FireKanbanList />
                        <FireChatChannelRoom />
                    </div>
                </div>
            )}
        </div>
    );
}
