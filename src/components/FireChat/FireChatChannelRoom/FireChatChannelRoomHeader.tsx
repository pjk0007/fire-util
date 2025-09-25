import { useFireChatChannel } from '@/components/FireProvider/FireChatChannelProvider';
import FireChatChannelRoomHeaderAvatar from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomHeader/FireChatChannelRoomHeaderAvatar';
import { useSidebar } from '@/components/ui/sidebar';
import { CHANNEL_NAME_FIELD, LOCALE } from '@/lib/FireChat/settings';
import { ChevronLeft, Menu } from 'lucide-react';
import { useFireChatSidebar } from '@/components/FireProvider/FireChatSidebarProvider';

export default function FireChatChannelRoomHeader() {
    const { channel, participants, resetChannel } = useFireChatChannel();
    const { toggleSidebar } = useFireChatSidebar();
    if (!channel) {
        return null;
    }

    return (
        <div className="flex items-center justify-between md:p-4 p-2 border-b md:h-[65px] h-[49px] bg-background">
            <div className="flex items-center md:gap-3 gap-2">
                <ChevronLeft
                    className="md:hidden cursor-pointer text-muted-foreground"
                    onClick={resetChannel}
                />
                <FireChatChannelRoomHeaderAvatar participants={participants} />
                <h2 className="md:text-base text-sm font-bold line-clamp-1">
                    {channel?.[CHANNEL_NAME_FIELD] || LOCALE.UNKNOWN}
                </h2>
            </div>
            <div className="text-sm text-muted-foreground">
                <Menu onClick={toggleSidebar} />
            </div>
        </div>
    );
}
