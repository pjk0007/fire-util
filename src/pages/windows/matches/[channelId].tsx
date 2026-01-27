import { useFireChannel } from '@/components/FireChannel/context/FireChannelProvider';
import { FireChatProvider } from '@/components/FireChat/context/FireChatProvider';
import FireChatRoomBody from '@/components/FireChat/ui/FireChatRoom/FireChatRoomBody';
import FireChatRoomFooter from '@/components/FireChat/ui/FireChatRoom/FireChatRoomFooter';
import { FIRE_CHAT_LOCALE } from '@/components/FireChat/settings';

export default function Channel() {
    const { selectedChannelId } = useFireChannel();

    return (
        <div className="w-screen h-screen relative">
            {selectedChannelId ? (
                <FireChatProvider>
                    <div className="flex flex-col h-full flex-1">
                        <FireChatRoomBody />
                        <FireChatRoomFooter />
                    </div>
                </FireChatProvider>
            ) : (
                <span className="w-full h-full flex items-center justify-center text-muted-foreground">
                    {FIRE_CHAT_LOCALE.NO_CHANNEL_SELECTED}
                </span>
            )}
        </div>
    );
}
