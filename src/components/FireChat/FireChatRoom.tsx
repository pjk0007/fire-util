import { FireChatChannelProvider } from '@/components/FireProvider/FireChatChannelProvider';
import FireChatRoomBody from '@/components/FireChat/FireChatRoom/FireChatRoomBody';
import FireChatRoomFooter from '@/components/FireChat/FireChatRoom/FireChatRoomFooter';
import FireChatHeader from '@/components/FireChat/FireChatHeader';
import { FIRECHAT_LOCALE } from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import { useFireChatSidebar } from '@/components/FireProvider/FireChatSidebarProvider';
import { useEffect } from 'react';

export default function FireChatRoom() {
    const { selectedChannelId: channelId } = useFireChannel();
    const isMobile = useIsMobile();
    const { setOpen } = useFireChatSidebar();

    useEffect(() => {
        return () => {
            setOpen(false);
        };
    }, [channelId]);

    if (!channelId) {
        if (!isMobile) {
            return (
                <span className="w-full h-full flex items-center justify-center text-muted-foreground">
                    {FIRECHAT_LOCALE.NO_CHANNEL_SELECTED}
                </span>
            );
        }
        return null;
    }

    return (
        <FireChatChannelProvider>
            <div className="flex flex-col h-full flex-1">
                <FireChatRoomBody />
                <FireChatRoomFooter />
            </div>
        </FireChatChannelProvider>
    );
}
