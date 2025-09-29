import FireChatChannelHeaderAvatar from '@/components/FireChat/FireChatChannelHeader/FireChatChannelHeaderAvatar';
import {
    CHANNEL_NAME_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
    FcUser,
    LOCALE,
} from '@/lib/FireChat/settings';
import { ChevronLeft, Menu } from 'lucide-react';
import { useFireChatSidebar } from '@/components/FireProvider/FireChatSidebarProvider';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import useFireChatChannelInfo from '@/lib/FireChat/hooks/useFireChatChannelInfo';

export default function FireChatChannelHeader<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>() {
    const { selectedChannelId, setSelectedChannelId } =
        useFireChannel();
    const { toggleSidebar } = useFireChatSidebar();
    const { channel, participants } = useFireChatChannelInfo<C, M, T, U>({
        channelId: selectedChannelId,
    });

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
                <FireChatChannelHeaderAvatar participants={participants} />
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
