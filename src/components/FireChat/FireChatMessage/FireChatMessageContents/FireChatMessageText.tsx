import {
    FcMessage,
    FcMessageText,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CONTENTS_FIELD,
} from '@/lib/FireChat/settings';
import sanitizeHtml from '@/lib/FireChat/utils/sanitizeHtml';
import { formatTimeString } from '@/lib/FireChat/utils/timeformat';
import { cn } from '@/lib/utils';

export default function FireChatMessageText<T extends FcMessageText>({
    content,
    isMine,
}: {
    content: T;
    isMine: boolean;
}) {
    return (
        <div
            className={cn("py-3 px-4 text-foreground rounded-b-md", {
                'bg-white rounded-tr-md': !isMine,
                'bg-primary-foreground  rounded-tl-md': isMine,
            })}
            dangerouslySetInnerHTML={{
                __html: sanitizeHtml(
                    content[MESSAGE_CONTENT_TEXT_FIELD].replace('\\n', '\n')
                ),
            }}
        />
    );
}
