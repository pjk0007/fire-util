import FireChatChannelListItem from '@/components/FireChat/FireChatChannelList/FireChatChannelListItem';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CHANNEL_ID_FIELD } from '@/lib/FireChat/settings';

export default function FireChatChannelList() {
    const { channels } = useFireChat();

    return (
        <div className="flex flex-col w-full md:w-80 h-full gap-2 border-r">
            {channels.map((channel) => (
                <FireChatChannelListItem
                    key={channel.channel[CHANNEL_ID_FIELD]}
                    channel={channel}
                />
            ))}
        </div>
    );
}
