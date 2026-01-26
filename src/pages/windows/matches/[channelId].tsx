import { FireChatProvider } from '@/components/FireProvider/FireChatProvider';
import FireChatRoomBody from '@/components/FireChat/FireChatRoom/FireChatRoomBody';
import FireChatRoomFooter from '@/components/FireChat/FireChatRoom/FireChatRoomFooter';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import { FIRE_CHAT_LOCALE } from '@/lib/FireChat/settings';

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
