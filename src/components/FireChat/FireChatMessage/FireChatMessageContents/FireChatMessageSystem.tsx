import {
    FcMessage,
    FcMessageSystem,
    FcMessageText,
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
            <div className="text-xs text-muted-foreground bg-muted/40 px-4 py-2 rounded-full font-bold">
                {message.contents?.[0][MESSAGE_CONTENT_TEXT_FIELD] ||
                    LOCALE.UNKNOWN}
            </div>
        </div>
    );
}
