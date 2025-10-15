import {
    FireMessage,
    FireMessageSystem,
    FIRE_CHAT_LOCALE,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
} from '@/lib/FireChat/settings';

export default function FireChatMessageSystem<
    M extends FireMessage<T>,
    T extends FireMessageSystem
>({ message }: { message: M }) {
    return (
        <div
            data-seconds={message[MESSAGE_CREATED_AT_FIELD].seconds}
            id={`message-${message[MESSAGE_ID_FIELD]}`}
            className="flex w-full justify-center my-2"
        >
            <div className="text-xs text-foreground bg-muted px-3 py-1.5 rounded-xs">
                {message.contents?.[0][MESSAGE_CONTENT_TEXT_FIELD] ||
                    FIRE_CHAT_LOCALE.UNKNOWN}
            </div>
        </div>
    );
}
