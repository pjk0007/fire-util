import { FireMessage, FireMessageContent, FIRECHAT_LOCALE } from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';
import { CornerDownRight } from 'lucide-react';
import { useCallback } from 'react';

export default function FireChatChannelRoomFooterTextarea<
    M extends FireMessage<T>,
    T extends FireMessageContent
>({
    message,
    setMessage,
    onSend,
    replyingMessage,
    setFiles,
}: {
    message: string;
    setMessage: (msg: string) => void;
    onSend: () => void;
    replyingMessage?: M;
    setFiles: (files: File[]) => void;
}) {
    const handlePaste = useCallback((event: React.ClipboardEvent) => {
        event.preventDefault();
        if (!event.clipboardData) return;

        // 클립보드 이벤트에서 파일들을 추출합니다.
        const { items } = event.clipboardData;
        if (items.length === 0) return;
        const pasteFiles = [];

        for (let i = 0; i < items.length; i += 1) {
            const file = items[i]!.getAsFile();
            if (file) pasteFiles.push(file);
        }

        setFiles(pasteFiles);
        if (pasteFiles.length > 0) event.preventDefault();
    }, []);

    return (
        <div className="relative md:block hidden">
            {!!replyingMessage && (
                <CornerDownRight className="absolute top-0 left-0 w-4 h-4 text-foreground" />
            )}
            <textarea
                onPaste={handlePaste}
                className={cn(
                    'resize-none focus:outline-none border-none h-[60px] text-sm  w-full placeholder:text-muted-foreground',
                    {
                        'pl-[26px] pr-4': !!replyingMessage,
                    }
                )}
                placeholder={FIRECHAT_LOCALE.FOOTER.INPUT_PLACEHOLDER}
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
