import FireChatChannelRoomSidebarFiles from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomSidebar/FireChatChannelRoomSidebarFiles';
import FireChatChannelRoomSidebarImages from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomSidebar/FireChatChannelRoomSidebarImages';
import FireChatChannelRoomSidebarParticipants from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomSidebar/FireChatChannelRoomSidebarParticipants';
import { useAuth } from '@/components/provider/AuthProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    CHANNEL_ID_FIELD,
    CHANNEL_PARTICIPANTS_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
    FcUser,
} from '@/lib/FireChat/settings';
import useListFiles from '@/lib/FireChat/hooks/useListFiles';
import { FireChatSidebar } from '@/components/FireProvider/FireChatSidebarProvider';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import useUsers from '@/lib/FireChat/hooks/useUsers';
import useFireChatChannelInfo from '@/lib/FireChat/hooks/useFireChatChannelInfo';

export default function FireChatChannelSidebar<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>() {
    const { selectedChannelId: channelId } = useFireChannel();

    const { channel, participants } = useFireChatChannelInfo<C, M, T, U>({
        channelId,
    });

    const { imageMessages, fileMessages } = useListFiles({
        channelId: channel?.[CHANNEL_ID_FIELD],
    });

    return (
        <FireChatSidebar side="right">
            <ScrollArea className="h-full">
                <div className="p-2 h-full gap-2 flex flex-col">
                    <FireChatChannelRoomSidebarImages
                        channelId={channel?.[CHANNEL_ID_FIELD] || ''}
                        imageMessages={imageMessages}
                        participants={participants}
                    />
                    <FireChatChannelRoomSidebarFiles
                        fileMessages={fileMessages}
                        channelId={channel?.[CHANNEL_ID_FIELD] || ''}
                    />
                    <FireChatChannelRoomSidebarParticipants
                        participants={participants}
                        channel={channel}
                    />
                </div>
            </ScrollArea>
        </FireChatSidebar>
    );
}
