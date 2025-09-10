import FireChatMessageAvatar from '@/components/FireChat/FireChatMessage/FireChatMessageAvatar';
import FireChatMessageContent from '@/components/FireChat/FireChatMessage/FireChatMessageContent';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import {
    FcMessage,
    FcMessageContent,
    FcMessageSystem,
    LOCALE,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_SYSTEM,
} from '@/lib/FireChat/settings';
import { formatTimeString } from '@/lib/FireChat/utils/timeformat';
import { cn } from '@/lib/utils';

export default function FireChatMessage<
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ message }: { message: M }) {
    const { selectedChannel, user: me } = useFireChat();
    const participants = selectedChannel?.participants || [];
    const messageUser = participants.find((p) => p.id === message['userId']);

    if (message[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_SYSTEM) {
        const contents = message['contents'] as FcMessageSystem[];
        return (
            <div className="flex w-full justify-center my-2">
                <div className="text-xs text-muted-foreground bg-muted/40 px-4 py-2 rounded-full font-bold">
                    {contents?.[0][MESSAGE_CONTENT_TEXT_FIELD] ||
                        LOCALE.UNKNOWN}
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn('flex w-full gap-4 my-2', {
                'justify-end': message['userId'] === me?.id,
                'justify-start': message['userId'] !== me?.id,
            })}
        >
            {message['userId'] !== me?.id && (
                <FireChatMessageAvatar message={message} />
            )}
            <div className={cn("flex flex-col max-w-[80%] gap-2", {
                'items-end': message['userId'] === me?.id,
                'items-start': message['userId'] !== me?.id,
            })}>
                <div className={cn("flex items-center gap-2", {
                    'flex-row-reverse': message['userId'] === me?.id,
                    'flex-row': message['userId'] !== me?.id,
                })}>
                    <p className="text-base text-foreground/80 font-bold">
                        {messageUser?.name || LOCALE.UNKNOWN}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatTimeString(message[MESSAGE_CREATED_AT_FIELD])}
                    </p>
                </div>

                <FireChatMessageContent message={message} />
            </div>
        </div>
    );
}
