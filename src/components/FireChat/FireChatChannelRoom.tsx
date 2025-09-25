import { FireChatChannelProvider } from '@/components/FireProvider/FireChatChannelProvider';
import FireChatChannelRoomBody from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomBody';
import FireChatChannelRoomFooter from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomFooter';
import FireChatChannelRoomHeader from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomHeader';
import FireChatChannelRoomSidebar from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { LOCALE } from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export default function FireChatChannelRoom({
    channelId,
    resetChannel,
}: {
    channelId?: string;
    resetChannel?: () => void;
}) {
    const isMobile = useIsMobile();
    if (!channelId) {
        if (!isMobile) {
            return (
                <span className="w-full h-full flex items-center justify-center text-muted-foreground">
                    {LOCALE.NO_CHANNEL_SELECTED}
                </span>
            );
        }
        return null;
    }
    return (
        <FireChatChannelProvider
            channelId={channelId}
            resetChannel={resetChannel}
        >
            {/* className={cn('bg-background z-50 fixed md:static md:h-full flex-1 flex  inset-0', {
                    ' hidden md:flex ': !channelId,
                })} */}
            <div className={cn('w-full h-full flex flex-col')}>
                <FireChatChannelRoomHeader />
                <FireChatChannelRoomBody />
                <FireChatChannelRoomFooter />
            </div>

            <FireChatChannelRoomSidebar />
        </FireChatChannelProvider>
    );
}
