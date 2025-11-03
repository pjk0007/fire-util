import FireChatRoom from '@/components/FireChat/FireChatRoom';
import FireChannelList from '@/components/FireChannel/FireChannelList';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import { cn } from '@/lib/utils';
import FireChatHeader from '@/components/FireChat/FireChatHeader';
import FireTask from '@/components/FireTask/FireTask';
import { FireTaskSidebarProvider } from '@/components/FireProvider/FireTaskSidebarProvider';
import { FireTaskProvider } from '@/components/FireProvider/FireTaskProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/router';

export default function FireWork({
    showChannelList = true,
    showChatHeader = true,
    showTask = true,
}: {
    showChannelList?: boolean;
    showChatHeader?: boolean;
    showTask?: boolean;
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
                        <FireChatRoom />
                    </div>
                </div>
            )}
        </div>
    );
}
