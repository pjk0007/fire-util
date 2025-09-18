import FireChatChannelSidebarFiles from '@/components/FireChat/FireChatChannelSidebar/FireChatChannelSidebarFiles';
import FireChatChannelSidebarImages from '@/components/FireChat/FireChatChannelSidebar/FireChatChannelSidebarImages';
import FireChatChannelSidebarParticipants from '@/components/FireChat/FireChatChannelSidebar/FireChatChannelSidebarParticipants';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from '@/components/ui/sidebar';

export default function FireChatChannelSidebar() {
    const {
        imageMessages,
        fileMessages,
        selectedChannel,
        user: me,
    } = useFireChat();

    return (
        <Sidebar side="right">
            <ScrollArea className="h-full">
                <div className="p-2 h-full gap-2 flex flex-col">
                    <FireChatChannelSidebarImages
                        imageMessages={imageMessages}
                        participants={selectedChannel?.participants || []}
                    />
                    <FireChatChannelSidebarFiles
                        fileMessages={fileMessages}
                        channelId={selectedChannel?.channel.id || ''}
                    />
                    <FireChatChannelSidebarParticipants
                        participants={selectedChannel?.participants || []}
                        channel={selectedChannel?.channel}
                        me={me}
                    />
                </div>
            </ScrollArea>
        </Sidebar>
    );
}
