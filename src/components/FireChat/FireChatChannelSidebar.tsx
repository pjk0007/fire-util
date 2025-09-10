import FireChatChannelSidebarParticipants from '@/components/FireChat/FireChatChannelSidebar/FireChatChannelSidebarParticipants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from '@/components/ui/sidebar';

export default function FireChatChannelSidebar() {
    return (
        <Sidebar side="right">
            <ScrollArea className='p-2 h-full'>
                <FireChatChannelSidebarParticipants />
            </ScrollArea>
        </Sidebar>
    );
}
