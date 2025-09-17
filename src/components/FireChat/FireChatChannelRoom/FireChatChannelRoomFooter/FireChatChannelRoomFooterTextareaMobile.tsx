import { FcMessage, FcMessageContent, LOCALE } from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';
import { CornerDownRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

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
    useEffect(() => {
        // message가 변경될 때마다 텍스트 영역의 높이를 조정
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // 높이를 초기화
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 스크롤 높이에 맞게 조정
        }
    }, [message]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    return (
        <div className="relative flex-1 mx-2 md:hidden">
            <textarea
                ref={textareaRef}
                className={cn(
                    'bg-muted min-h-9 max-h-32 px-4 py-2 rounded-3xl focus:outline-none border-none w-full flex items-center',
                    'text-base'
                )}
                rows={1}
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
