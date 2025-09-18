import { useFireChatChannel } from '@/components/FireChat/FireChatChannelProvider';
import FireChatChannelRoomSidebarFiles from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomSidebar/FireChatChannelRoomSidebarFiles';
import FireChatChannelRoomSidebarImages from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomSidebar/FireChatChannelRoomSidebarImages';
import FireChatChannelRoomSidebarParticipants from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomSidebar/FireChatChannelRoomSidebarParticipants';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { useAuth } from '@/components/provider/AuthProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from '@/components/ui/sidebar';
import { CHANNEL_ID_FIELD } from '@/lib/FireChat/settings';

export default function FireChatChannelRoomSidebar() {
    const { user: me } = useAuth();
    const { imageMessages, fileMessages, channel, participants } =
        useFireChatChannel();

    return (
        <Sidebar side="right">
            <ScrollArea className="h-full">
                <div className="p-2 h-full gap-2 flex flex-col">
                    <FireChatChannelRoomSidebarImages
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
