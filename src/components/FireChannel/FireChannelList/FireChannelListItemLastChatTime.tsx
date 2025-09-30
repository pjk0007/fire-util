import {
    FcMessage,
    FcMessageContent,
    MESSAGE_CREATED_AT_FIELD,
} from '@/lib/FireChat/settings';
import { FcChannel } from '@/lib/FireChannel/settings';
import { CHANNEL_LAST_MESSAGE_FIELD } from '@/lib/FireChannel/settings';
import { formatTimeString } from '@/lib/FireChat/utils/timeformat';
import { Timestamp } from 'firebase/firestore';

export default function FireChannelListItemLastChatTime<
    C extends FcChannel<M, T>,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ channel }: { channel?: C }) {
    return (
        <time className="text-xs text-muted-foreground whitespace-nowrap">
            {formatTimeString(
                channel?.[CHANNEL_LAST_MESSAGE_FIELD]?.[
                    MESSAGE_CREATED_AT_FIELD
                ] as Timestamp
            )}
        </time>
    );
}
