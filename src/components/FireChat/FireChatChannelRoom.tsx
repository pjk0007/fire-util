import FireChatChannelRoomBody from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomBody';
import FireChatChannelRoomFooter from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomFooter';
import FireChatChannelRoomHeader from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomHeader';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { LOCALE } from '@/lib/FireChat/settings';

export default function FireChatChannelRoom() {
    const { selectedChannel } = useFireChat();
    if (!selectedChannel) {
        return (
            <div className="flex-1 z-50 hidden md:flex md:static items-center justify-center bg-background w-full h-full">
                <span className="text-muted-foreground">
                    {LOCALE.NO_CHANNEL_SELECTED}
                </span>
            </div>
        );
    }
    return (
        <div className="flex-1 z-50 fixed md:static flex flex-col bg-background w-full h-full">
            <FireChatChannelRoomHeader />
            <FireChatChannelRoomBody />
            <FireChatChannelRoomFooter />
        </div>
    );
}
