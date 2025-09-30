import {
    FcMessage,
    FcMessageContent,
} from '@/lib/FireChat/settings';
import { FcChannel } from '@/lib/FireChannel/settings';
import { CHANNEL_NAME_FIELD } from '@/lib/FireChannel/settings';
import { FcUser } from '@/lib/FireAuth/settings';
import {
    USER_ID_FIELD,
    USER_NAME_FIELD
} from '@/lib/FireAuth/settings';
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
}: {
    channel?: C;
    participants: U[];
} & { isSelected?: boolean }) {
    return (
        <div className="flex gap-2 items-center">
            <h3
                className={cn('text-sm font-bold line-clamp-1', {
                    'text-primary': isSelected,
                })}
            >
                {channel?.[CHANNEL_NAME_FIELD] ||
                    participants
                        .map((p) => p[USER_NAME_FIELD] || p[USER_ID_FIELD])
                        .join(', ')}
            </h3>
            <p className="text-xs text-muted-foreground w-1 font-bold">
                {participants.length}
            </p>
        </div>
    );
}
