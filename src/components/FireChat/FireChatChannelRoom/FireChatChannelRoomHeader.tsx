import FireChatChannelRoomHeaderAvatar from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomHeader/FireChatChannelRoomHeaderAvatar';
import {
    CHANNEL_NAME_FIELD,
    CHANNEL_PARTICIPANTS_FIELD,
    LOCALE,
} from '@/lib/FireChat/settings';
import { ChevronLeft, Menu } from 'lucide-react';
import { useFireChatSidebar } from '@/components/FireProvider/FireChatSidebarProvider';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import useUsers from '@/lib/FireChat/hooks/useUsers';

export default function FireChatChannelRoomHeader() {
    const { channels, selectedChannelId, setSelectedChannelId } = useFireChannel();
    const { toggleSidebar } = useFireChatSidebar();
    const channel = channels.find((ch) => ch.id === selectedChannelId);

    const { users: participants } = useUsers(
        channel?.[CHANNEL_PARTICIPANTS_FIELD]
    );

    if (!channel) {
        return null;
    }

    return (
        <div className="flex items-center justify-between md:p-4 p-2 border-b md:h-[65px] h-[49px] bg-background">
            <div className="flex items-center md:gap-3 gap-2">
                <ChevronLeft
                    className="md:hidden cursor-pointer text-muted-foreground"
                    onClick={() => setSelectedChannelId(undefined)}
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
