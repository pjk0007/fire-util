import FireChatMessage from '@/components/FireChat/FireChatMessage/FireChatMessage';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowDown } from 'lucide-react';

export default function FireChatChannelRoomBody() {
    const {
        messages: selectedChannelMessages,
        scrollAreaRef: channelRoomRef,
        isBottom,
        scrollToBottom,
        isLoading,
    } = useFireChat();

    return (
        <div className="flex-1 overflow-hidden relative">
            {isLoading && (
                <div className="absolute w-full h-full z-10 bg-secondary flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                </div>
            )}
            <ScrollArea
                className="px-8 h-full bg-secondary"
                ref={channelRoomRef}
            >
                <div className="h-full flex flex-col gap-2 py-4 ">
                    {selectedChannelMessages.map((msg, index) => (
                        <FireChatMessage key={index} message={msg} />
                    ))}
                </div>
                {!isBottom && (
                    <Button
                        variant={'outline'}
                        className="w-10 h-10 absolute bottom-8 left-1/2 transform -translate-x-1/2 rounded-full"
                        onClick={() => scrollToBottom(true)}
                    >
                        <ArrowDown />
                    </Button>
                )}
            </ScrollArea>
        </div>
    );
}
