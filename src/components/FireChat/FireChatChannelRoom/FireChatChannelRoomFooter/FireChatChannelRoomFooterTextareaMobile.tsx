import { FcMessage, FcMessageContent, LOCALE } from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';
import { CornerDownRight } from 'lucide-react';

export default function FireChatChannelRoomFooterTextareaMobile<
    M extends FcMessage<T>,
    T extends FcMessageContent
>({
    message,
    setMessage,
    sendTextMessage,
    selectReplyingMessage,
    replyingMessage,
    scrollToBottom,
}: {
    message: string;
    setMessage: (msg: string) => void;
    sendTextMessage: (msg: string, replyingMessage?: M) => Promise<void>;
    selectReplyingMessage?: (id?: string) => void;
    replyingMessage?: M;
    scrollToBottom: (
        smooth?: boolean,
        options?: {
            afterScroll?: () => void;
            immediate?: boolean;
        }
    ) => void;
}) {
    return (
        <div className="relative">
            {!!replyingMessage && (
                <CornerDownRight className="absolute top-0 left-2 w-4 h-4 text-muted-foreground" />
            )}
            <textarea
                className={cn(
                    'resize-none focus:outline-none border-none h-20 text-sm  w-full',
                    {
                        'px-4': !replyingMessage,
                        'pl-10 pr-4': !!replyingMessage,
                    }
                )}
                placeholder={LOCALE.FOOTER.INPUT_PLACEHOLDER}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        if ((e.nativeEvent as any).isComposing) return; // 한글 조합 중이면 무시
                        e.preventDefault();
                        scrollToBottom(false, {
                            immediate: true,
                        });
                        sendTextMessage(message, replyingMessage);
                        setMessage('');
                        selectReplyingMessage?.(undefined);
                    }
                }}
            />
        </div>
    );
}
