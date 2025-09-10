import {
    FcChannel,
    FcChannelParticipants,
    FcMessage,
    FcMessageContent,
    FcMessageType,
    FcUser,
} from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';

export default function FireChatChannelListItemTitle<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({
    channel,
    participants,
    isSelected,
}: FcChannelParticipants<C, U, M, T> & { isSelected?: boolean }) {
    return (
        <div className="flex gap-2 items-center">
            <h3
                className={cn(
                    'text-sm font-bold line-clamp-1',
                    {
                        'text-primary': isSelected,
                    }
                )}
            >
                {channel.name}
            </h3>
            <p className="text-xs text-muted-foreground w-1 font-bold">
                {participants.length}
            </p>
        </div>
    );
}
