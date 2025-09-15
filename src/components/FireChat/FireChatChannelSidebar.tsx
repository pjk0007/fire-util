import FireChatChannelSidebarFiles from '@/components/FireChat/FireChatChannelSidebar/FireChatChannelSidebarFiles';
import FireChatChannelSidebarImages from '@/components/FireChat/FireChatChannelSidebar/FireChatChannelSidebarImages';
import FireChatChannelSidebarParticipants from '@/components/FireChat/FireChatChannelSidebar/FireChatChannelSidebarParticipants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from '@/components/ui/sidebar';

export default function FireChatChannelSidebar() {
    return (
        <Sidebar side="right">
            <ScrollArea className="h-full">
                <div className="p-2 h-full gap-2 flex flex-col">
                    <FireChatChannelSidebarImages />
                    <FireChatChannelSidebarFiles />
                    <FireChatChannelSidebarParticipants />
                </div>
            </ScrollArea>
        </Sidebar>
    );
}
