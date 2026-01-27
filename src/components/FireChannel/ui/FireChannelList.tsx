import FireChannelListItem from '@/components/FireChannel/ui/FireChannelList/FireChannelListItem';
import { useFireChannel } from '@/components/FireChannel/context/FireChannelProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    CHANNEL_ID_FIELD,
    CHANNEL_NAME_FIELD,
} from '@/components/FireChannel/settings';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';

const CHANNELS_BATCH_SIZE = 10;

export default function FireChannelList({
    hideUnreadCount = false,
}: {
    hideUnreadCount?: boolean;
}) {
    const isMobile = useIsMobile();
    const { selectedChannelId, channels, setSelectedChannelId } =
        useFireChannel();
    const [searchQuery, setSearchQuery] = useState('');
    const [maxChannelsToShow, setMaxChannelsToShow] =
        useState(CHANNELS_BATCH_SIZE);

    const filteredChannels = useMemo(() => {
        if (!searchQuery.trim()) {
            return channels;
        }

        const query = searchQuery.toLowerCase();
        return channels.filter((channel) =>
            channel[CHANNEL_NAME_FIELD]?.toLowerCase().includes(query)
        );
    }, [channels, searchQuery]);

    if (selectedChannelId && isMobile) {
        return null;
    }

    return (
        <div className="flex flex-col w-full md:min-w-80 md:max-w-80 h-full gap-2 border-r bg-background">
            <div className="px-4 pt-4 pb-2 border-b shrink-0">
                <Label htmlFor="search" className="mb-2">
                    업무명
                </Label>
                <Input
                    id="search"
                    placeholder="업무명 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <ScrollArea className="flex-1 min-h-0">
                {filteredChannels
                    .slice(0, maxChannelsToShow)
                    .map(({ [CHANNEL_ID_FIELD]: channelId }) => (
                        <FireChannelListItem
                            key={channelId}
                            channelId={channelId}
                            isSelected={selectedChannelId === channelId}
                            selectChannel={() =>
                                setSelectedChannelId(channelId)
                            }
                            hideUnreadCount={hideUnreadCount}
                        />
                    ))}
                {filteredChannels.length > maxChannelsToShow && (
                    <div className="pl-2 pr-4 py-2 flex justify-center">
                        <Button
                            variant={'ghost'}
                            className="w-full p-4 text-sm text-center text-muted-foreground"
                            onClick={() =>
                                setMaxChannelsToShow(
                                    (prev) => prev + CHANNELS_BATCH_SIZE
                                )
                            }
                        >
                            더 보기 ({CHANNELS_BATCH_SIZE}개)
                        </Button>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
