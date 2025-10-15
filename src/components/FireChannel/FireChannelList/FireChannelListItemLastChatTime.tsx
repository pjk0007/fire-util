import {
    FireMessage,
    FireMessageContent,
    MESSAGE_CREATED_AT_FIELD,
} from '@/lib/FireChat/settings';
import { FireChannel } from '@/lib/FireChannel/settings';
import { CHANNEL_LAST_MESSAGE_FIELD } from '@/lib/FireChannel/settings';
import { localeTimeString } from '@/lib/FireUtil/timeformat';
import { Timestamp } from 'firebase/firestore';

export default function FireChannelListItemLastChatTime<
    C extends FireChannel<M, T>,
    M extends FireMessage<T>,
    T extends FireMessageContent
>({ channel }: { channel?: C }) {
    return (
        <time className="text-xs text-muted-foreground whitespace-nowrap">
            {localeTimeString(
                channel?.[CHANNEL_LAST_MESSAGE_FIELD]?.[
                    MESSAGE_CREATED_AT_FIELD
                ] as Timestamp
            )}
        </time>
    );
}
