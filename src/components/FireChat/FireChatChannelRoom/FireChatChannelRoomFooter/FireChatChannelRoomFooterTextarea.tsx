import { FcMessage, FcMessageContent, LOCALE } from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';
import { CornerDownRight } from 'lucide-react';

export default function FireChatChannelRoomFooterTextarea<
    M extends FcMessage<T>,
    T extends FcMessageContent
>({
    message,
    setMessage,
    onSend,
    selectReplyingMessage,
    replyingMessage,
}: {
    message: string;
    setMessage: (msg: string) => void;
    onSend: () => void;
    selectReplyingMessage?: (id?: string) => void;
    replyingMessage?: M;
}) {
    return (
        <div className="relative md:block hidden">
            {!!replyingMessage && (
                <CornerDownRight className="absolute top-0 left-0 w-4 h-4 text-foreground" />
            )}
            <textarea
                className={cn(
                    'resize-none focus:outline-none border-none h-[60px] text-sm  w-full placeholder:text-muted-foreground',
                    {
                        'pl-[26px] pr-4': !!replyingMessage,
                    }
                )}
                placeholder={LOCALE.FOOTER.INPUT_PLACEHOLDER}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        if ((e.nativeEvent as any).isComposing) return; // 한글 조합 중이면 무시
                        e.preventDefault();
                        onSend();
                    }
                }}
            />
        </div>
    );
}
