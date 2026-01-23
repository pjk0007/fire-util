import { FireMessage, FireMessageContent, FIRE_CHAT_LOCALE } from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

export default function FireChatChannelRoomFooterTextareaMobile<
    M extends FireMessage<T>,
    T extends FireMessageContent
>({
    message,
    setMessage,
    onSend,
    replyingMessage,
    disabled = false,
}: {
    message: string;
    setMessage: (msg: string) => void;
    onSend: () => void;
    replyingMessage?: M;
    disabled?: boolean;
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
                disabled={disabled}
                ref={textareaRef}
                className={cn(
                    'min-h-9 max-h-32 px-3 py-2 rounded-3xl focus:outline-none border-none w-full flex items-center placeholder:text-muted-foreground',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted'
                )}
                rows={1}
                placeholder={
                    replyingMessage
                        ? FIRE_CHAT_LOCALE.FOOTER.REPLY_MESSAGE
                        : FIRE_CHAT_LOCALE.FOOTER.INPUT_PLACEHOLDER
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
