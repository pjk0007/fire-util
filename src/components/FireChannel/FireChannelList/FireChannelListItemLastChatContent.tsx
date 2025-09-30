import {
    CHANNEL_LAST_MESSAGE_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
    FcMessageSystem,
    FcMessageText,
    FIRECHAT_LOCALE,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_FILE,
    MESSAGE_TYPE_IMAGE,
    MESSAGE_TYPE_SYSTEM,
    MESSAGE_TYPE_TEXT,
} from '@/lib/FireChat/settings';
import sanitizeHtml from '@/lib/FireChat/utils/sanitizeHtml';

export default function FireChatChannelListItemLastChatContent<
    C extends FcChannel<M, T>,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ channel }: { channel?: C }) {
    const lastMessage = channel?.[CHANNEL_LAST_MESSAGE_FIELD];
    const contents = lastMessage?.[MESSAGE_CONTENTS_FIELD]?.[0];

    if (!lastMessage || !contents) {
        return (
            <div className="text-xs text-muted-foreground">
                {FIRECHAT_LOCALE.NO_MESSAGES}
            </div>
        );
    }

    const type = lastMessage[MESSAGE_TYPE_FIELD];

    if (type === MESSAGE_TYPE_TEXT) {
        const text = contents as FcMessageText;
        return (
            <div
                className="text-xs text-muted-foreground line-clamp-2 whitespace-pre-line break-all"
                dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(
                        text[MESSAGE_CONTENT_TEXT_FIELD].replace('\\n', '\n')
                    ),
                }}
            />
        );
    }

    if (type === MESSAGE_TYPE_IMAGE) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                    {FIRECHAT_LOCALE.IMAGE}
                </span>
            </div>
        );
    }

    if (type === MESSAGE_TYPE_FILE) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                    {FIRECHAT_LOCALE.FILE}
                </span>
            </div>
        );
    }

    if (type === MESSAGE_TYPE_SYSTEM) {
        const system = contents as FcMessageSystem;
        return (
            <div className="text-xs text-gray-400 italic">
                {system[MESSAGE_CONTENT_TEXT_FIELD]}
            </div>
        );
    }

    return (
        <div className="text-xs text-muted-foreground">{FIRECHAT_LOCALE.UNKNOWN}</div>
    );
}
