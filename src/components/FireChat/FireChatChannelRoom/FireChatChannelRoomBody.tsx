import FireChatMessage from '@/components/FireChat/FireChatMessage/FireChatMessage';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_TYPE_FIELD,
} from '@/lib/FireChat/settings';

export default function FireChatChannelRoomBody() {
    const { selectedChannelMessages } = useFireChat();
    return (
        <div className="flex-1 overflow-hidden bg-secondary">
            <ScrollArea className="px-8 h-full">
                <div className='h-full flex flex-col gap-2 py-4 '>
                    {selectedChannelMessages.map((msg, index) => (
                        <FireChatMessage key={index} message={msg} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
