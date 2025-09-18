import FireChatChannelRoom from '@/components/FireChat/FireChatChannelRoom';
import FireChatChannelList from '@/components/FireChat/FireChatChannelList';
import { SidebarProvider } from '@/components/ui/sidebar';
import FireChatChannelSidebar from '@/components/FireChat/FireChatChannelSidebar';

export default function FireChat({
    showChannelList = true,
}: {
    showChannelList?: boolean;
}) {
    return (
        <div className="w-full h-full flex">
            <SidebarProvider
                defaultOpen={false}
                style={
                    {
                        '--sidebar-width': '320px',
                    } as React.CSSProperties
                }
            >
                {showChannelList && <FireChatChannelList />}

                <FireChatChannelRoom />

                <FireChatChannelSidebar />
            </SidebarProvider>
        </div>
    );
}
