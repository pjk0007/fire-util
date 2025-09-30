import FireChatChannelHeaderAvatar from '@/components/FireChat/FireChatChannelHeader/FireChatChannelHeaderAvatar';
import {
    FcMessage,
    FcMessageContent,
    FIRECHAT_LOCALE,
} from '@/lib/FireChat/settings';
import { FcChannel } from '@/lib/FireChannel/settings';
import { CHANNEL_NAME_FIELD } from '@/lib/FireChannel/settings';
import { FcUser } from '@/lib/FireAuth/settings';
import { ChevronLeft, Menu } from 'lucide-react';
import { useFireChatSidebar } from '@/components/FireProvider/FireChatSidebarProvider';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import useFireChannelInfo from '@/lib/FireChannel/hook/useFireChannelInfo';

export default function FireChatChannelHeader<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>() {
    const { selectedChannelId, setSelectedChannelId } = useFireChannel();
    const { toggleSidebar } = useFireChatSidebar();
    const { channel, participants } = useFireChannelInfo<C, M, T, U>({
        channelId: selectedChannelId,
    });

    if (!channel) {
        return null;
    }

    return (
        <div className="flex items-center justify-between md:p-4 p-2 border-b h-[calc(var(--firechat-header-height))] bg-background">
            <div className="flex items-center md:gap-3 gap-2">
                <ChevronLeft
                    className="md:hidden cursor-pointer text-muted-foreground"
                    onClick={() => setSelectedChannelId(undefined)}
                />
                <FireChatChannelHeaderAvatar participants={participants} />
                <h2 className="md:text-base text-sm font-bold line-clamp-1">
                    {channel?.[CHANNEL_NAME_FIELD] || FIRECHAT_LOCALE.UNKNOWN}
                </h2>
            </div>
            <div className="text-sm text-muted-foreground">
                <Menu onClick={toggleSidebar} />
            </div>
        </div>
    );
}
