import FireChatHeaderAvatar from '@/components/FireChat/FireChatHeader/FireChatHeaderAvatar';
import {
    FireMessage,
    FireMessageContent,
    FIRECHAT_LOCALE,
} from '@/lib/FireChat/settings';
import { FireChannel } from '@/lib/FireChannel/settings';
import { CHANNEL_NAME_FIELD } from '@/lib/FireChannel/settings';
import { FireUser } from '@/lib/FireAuth/settings';
import { ChevronLeft, Menu } from 'lucide-react';
import { useFireChatSidebar } from '@/components/FireProvider/FireChatSidebarProvider';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import useFireChannelInfo from '@/lib/FireChannel/hook/useFireChannelInfo';

export default function FireChatHeader<
    C extends FireChannel<M, T>,
    U extends FireUser,
    M extends FireMessage<T>,
    T extends FireMessageContent
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
                <FireChatHeaderAvatar participants={participants} />
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
