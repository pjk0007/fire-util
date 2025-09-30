import FireChatRoom from '@/components/FireChat/FireChatRoom';
import FireChannelList from '@/components/FireChannel/FireChannelList';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import { cn } from '@/lib/utils';
import FireChatHeader from '@/components/FireChat/FireChatHeader';
import FireKanbanList from '@/components/FireTask/FireTaskList';

export default function FireWork({
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
                    <FireChatHeader />
                    <div className="relative flex h-[calc(100%-var(--firechat-header-height))]">
                        <FireKanbanList />
                        <FireChatRoom />
                    </div>
                </div>
            )}
        </div>
    );
}
