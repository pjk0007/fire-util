import FireChatChannelRoomHeaderAvatar from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomHeader/FireChatChannelRoomHeaderAvatar';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { useSidebar } from '@/components/ui/sidebar';
import { ChevronLeft, Info, List, Menu } from 'lucide-react';

export default function FireChatChannelRoomHeader() {
    const { selectedChannel, handleSetSelectedChannel } = useFireChat();
    const { toggleSidebar } = useSidebar();
    if (!selectedChannel) {
        return null;
    }
    return (
        <div className="flex items-center justify-between md:p-4 p-2 border-b md:h-[65px] h-[49px]">
            <div className="flex items-center md:gap-3 gap-2">
                <ChevronLeft
                    className="md:hidden cursor-pointer text-muted-foreground"
                    onClick={() => handleSetSelectedChannel(undefined)}
                />
                <FireChatChannelRoomHeaderAvatar />
                <h2 className="md:text-lg text-sm font-bold line-clamp-1">
                    {selectedChannel.channel.name}
                </h2>
            </div>
            <div className="text-sm text-muted-foreground">
                <Menu onClick={toggleSidebar}/>
            </div>
        </div>
    );
}
