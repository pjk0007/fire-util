import { FireChatChannelProvider } from '@/components/FireProvider/FireChatChannelProvider';
import FireChatChannelRoomBody from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomBody';
import FireChatChannelRoomFooter from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomFooter';
import FireChatChannelHeader from '@/components/FireChat/FireChatChannelHeader';
import { LOCALE } from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import { useFireChatSidebar } from '@/components/FireProvider/FireChatSidebarProvider';
import { useEffect } from 'react';

export default function FireChatChannelRoom() {
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
                    {LOCALE.NO_CHANNEL_SELECTED}
                </span>
            );
        }
        return null;
    }

    return (
        <FireChatChannelProvider>
            <FireChatChannelRoomBody />
            <FireChatChannelRoomFooter />
        </FireChatChannelProvider>
    );
}
