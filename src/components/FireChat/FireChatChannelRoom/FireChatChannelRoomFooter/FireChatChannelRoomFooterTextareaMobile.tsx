import { FcMessage, FcMessageContent, FIRECHAT_LOCALE } from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

export default function FireChatChannelRoomFooterTextareaMobile<
    M extends FcMessage<T>,
    T extends FcMessageContent
>({
    message,
    setMessage,
    onSend,
    replyingMessage,
}: {
    message: string;
    setMessage: (msg: string) => void;
    onSend: () => void;
    replyingMessage?: M;
}) {
    useEffect(() => {
        // message가 변경될 때마다 텍스트 영역의 높이를 조정
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // 높이를 초기화
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 스크롤 높이에 맞게 조정
        }
    }, [message]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    return (
        <div className="relative flex-1 md:hidden">
            <textarea
                ref={textareaRef}
                className={cn(
                    'min-h-9 max-h-32 px-3 py-2 rounded-3xl focus:outline-none border-none w-full flex items-center placeholder:text-muted-foreground'
                )}
                rows={1}
                placeholder={
                    replyingMessage
                        ? FIRECHAT_LOCALE.FOOTER.REPLY_MESSAGE
                        : FIRECHAT_LOCALE.FOOTER.INPUT_PLACEHOLDER
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        if (e.nativeEvent.isComposing) return; // 한글 조합 중이면 무시
                        e.preventDefault();
                        onSend();
                    }
                }}
            />
        </div>
    );
}
