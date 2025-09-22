import { useFireChatChannel } from '@/components/provider/FireChatChannelProvider';
import FireChatChannelRoomSidebarFiles from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomSidebar/FireChatChannelRoomSidebarFiles';
import FireChatChannelRoomSidebarImages from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomSidebar/FireChatChannelRoomSidebarImages';
import FireChatChannelRoomSidebarParticipants from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomSidebar/FireChatChannelRoomSidebarParticipants';
import { useAuth } from '@/components/provider/AuthProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from '@/components/ui/sidebar';
import { CHANNEL_ID_FIELD } from '@/lib/FireChat/settings';
import useListFiles from '@/lib/FireChat/hooks/useListFiles';

export default function FireChatChannelRoomSidebar() {
    const { user: me } = useAuth();
    const { channel, participants } =
        useFireChatChannel();

    const { imageMessages, fileMessages } = useListFiles({
        channelId: channel?.[CHANNEL_ID_FIELD],
    });

    return (
        <Sidebar side="right">
            <ScrollArea className="h-full">
                <div className="p-2 h-full gap-2 flex flex-col">
                    <FireChatChannelRoomSidebarImages
                        channelId={channel?.[CHANNEL_ID_FIELD] || ''}
                        imageMessages={imageMessages}
                        participants={participants || []}
                    />
                    <FireChatChannelRoomSidebarFiles
                        fileMessages={fileMessages}
                        channelId={channel?.[CHANNEL_ID_FIELD] || ''}
                    />
                    <FireChatChannelRoomSidebarParticipants
                        participants={participants || []}
                        channel={channel}
                        me={me}
                    />
                </div>
            </ScrollArea>
        </Sidebar>
    );
}
