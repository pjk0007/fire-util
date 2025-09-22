import {
    FcMessage,
    FcMessageSystem,
    LOCALE,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
} from '@/lib/FireChat/settings';

export default function FireChatMessageSystem<
    M extends FcMessage<T>,
    T extends FcMessageSystem
>({ message }: { message: M }) {
    return (
        <div
            data-seconds={message[MESSAGE_CREATED_AT_FIELD].seconds}
            id={`message-${message[MESSAGE_ID_FIELD]}`}
            className="flex w-full justify-center my-2"
        >
            <div className="text-xs text-foreground bg-muted px-3 py-1.5 rounded-xs">
                {message.contents?.[0][MESSAGE_CONTENT_TEXT_FIELD] ||
                    LOCALE.UNKNOWN}
            </div>
        </div>
    );
}
