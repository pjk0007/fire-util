import FireChatChannelSidebarFiles from '@/components/FireChat/FireChatChannelSidebar/FireChatChannelSidebarFiles';
import FireChatChannelSidebarImages from '@/components/FireChat/FireChatChannelSidebar/FireChatChannelSidebarImages';
import FireChatChannelSidebarParticipants from '@/components/FireChat/FireChatChannelSidebar/FireChatChannelSidebarParticipants';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    CHANNEL_ID_FIELD,
    CHANNEL_NAME_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
    FcUser,
    LOCALE,
} from '@/lib/FireChat/settings';
import useListFiles from '@/lib/FireChat/hooks/useListFiles';
import {
    FireChatSidebar,
    useFireChatSidebar,
} from '@/components/FireProvider/FireChatSidebarProvider';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import useFireChatChannelInfo from '@/lib/FireChat/hooks/useFireChatChannelInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    const { toggleSidebar } = useFireChatSidebar();

    return (
        <FireChatSidebar side="right" className="bg-background">
            <div className="h-[var(--firechat-header-height)] hidden md:block">
                <Button
                    variant="ghost"
                    size="icon"
                    className="m-2"
                    onClick={toggleSidebar}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
            <ScrollArea className="md:h-[calc(100%-var(--firechat-header-height))] h-full">
                <div className="px-2 py-6 md:px-4 md:pt-0 md:pb-4 h-full gap-4 flex flex-col">
                    <div className='text-center font-semibold'>{channel?.[CHANNEL_NAME_FIELD]}</div>
                    <FireChatChannelSidebarParticipants
                        participants={participants}
                        channel={channel}
                    />
                    <Tabs className="gap-4" defaultValue="images">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="images" className="w-full">
                                {LOCALE.IMAGE}
                            </TabsTrigger>
                            <TabsTrigger value="files" className="w-full">
                                {LOCALE.FILE}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="images" className="p-0">
                            <FireChatChannelSidebarImages
                                channelId={channel?.[CHANNEL_ID_FIELD] || ''}
                                imageMessages={imageMessages}
                                participants={participants}
                            />
                        </TabsContent>
                        <TabsContent value="files" className="p-0">
                            <FireChatChannelSidebarFiles
                                fileMessages={fileMessages}
                                channelId={channel?.[CHANNEL_ID_FIELD] || ''}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </ScrollArea>
        </FireChatSidebar>
    );
}
