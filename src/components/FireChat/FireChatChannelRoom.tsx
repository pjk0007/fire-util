import { FireChatChannelProvider } from '@/components/provider/FireChatChannelProvider';
import FireChatChannelRoomBody from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomBody';
import FireChatChannelRoomFooter from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomFooter';
import FireChatChannelRoomHeader from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomHeader';
import FireChatChannelRoomSidebar from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { LOCALE } from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';

export default function FireChatChannelRoom({
    channelId,
    resetChannel,
}: {
    channelId?: string;
    resetChannel?: () => void;
}) {
    return (
        <FireChatChannelProvider
            channelId={channelId}
            resetChannel={resetChannel}
        >
            <SidebarProvider
                defaultOpen={false}
                style={
                    {
                        '--sidebar-width': '320px',
                    } as React.CSSProperties
                }
                className={cn('z-50 fixed md:static md:h-full flex-1 flex  inset-0', {
                    ' hidden md:flex ': !channelId,
                })}
            >
                <div
                    className={cn('flex-1 h-full', {
                        'flex flex-col': !!channelId,
                        'items-center justify-center hidden md:flex ':
                            !channelId,
                    })}
                >
                    {channelId ? (
                        <>
                            <FireChatChannelRoomHeader />
                            <FireChatChannelRoomBody />
                            <FireChatChannelRoomFooter />
                        </>
                    ) : (
                        <span className="text-muted-foreground">
                            {LOCALE.NO_CHANNEL_SELECTED}
                        </span>
                    )}
                </div>

                <FireChatChannelRoomSidebar />
            </SidebarProvider>
        </FireChatChannelProvider>
    );
}
