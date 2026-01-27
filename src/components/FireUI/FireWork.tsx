import { cn } from '@/lib/utils';
import FireTask from '@/components/FireTask/FireTask';
import { FireTaskSidebarProvider } from '@/components/FireProvider/FireTaskSidebarProvider';
import { FireTaskProvider } from '@/components/FireProvider/FireTaskProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/router';
import { useFireChannel } from '@/components/FireChannel/context/FireChannelProvider';
import { FireChatProvider } from '@/components/FireChat/context/FireChatProvider';
import FireChatHeader from '@/components/FireChat/ui/FireChatHeader';
import FireChatRoomBody from '@/components/FireChat/ui/FireChatRoom/FireChatRoomBody';
import FireChatRoomFooter from '@/components/FireChat/ui/FireChatRoom/FireChatRoomFooter';
import FireChannelList from '../FireChannel/ui/FireChannelList';


export default function FireWork({
    showChannelList = true,
    showChatHeader = true,
    showTask = true,
    disabled = false,
}: {
    showChannelList?: boolean;
    showChatHeader?: boolean;
    showTask?: boolean;
    disabled?: boolean;
}) {
    const router = useRouter();
    const { selectedChannelId } = useFireChannel();
    const isMobile = useIsMobile();

    if (isMobile && !selectedChannelId) {
        return <FireChannelList />;
    }

    return (
        <div className="w-full h-full flex">
            {showChannelList && <FireChannelList />}
            {selectedChannelId && (
                <div className={cn('w-full h-full flex flex-col')}>
                    {showChatHeader && <FireChatHeader />}
                    <div
                        className={cn('relative flex', {
                            'h-[calc(100%-var(--firechat-header-height))]':
                                showChatHeader,
                            'h-full': !showChatHeader,
                        })}
                    >
                        {showTask && (
                            <FireTaskProvider
                                defaultTaskId={router.query.taskId as string}
                            >
                                <FireTaskSidebarProvider>
                                    <FireTask />
                                </FireTaskSidebarProvider>
                            </FireTaskProvider>
                        )}
                        <FireChatProvider>
                            <div className="flex flex-col h-full flex-1">
                                <FireChatRoomBody />
                                <FireChatRoomFooter disabled={disabled} />
                            </div>
                        </FireChatProvider>
                    </div>
                </div>
            )}
        </div>
    );
}
