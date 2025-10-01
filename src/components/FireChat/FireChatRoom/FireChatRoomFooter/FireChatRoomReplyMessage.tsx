import { Button } from '@/components/ui/button';
import {
    FireMessage,
    FireMessageContent,
    FIRECHAT_LOCALE,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_IMAGE,
} from '@/lib/FireChat/settings';
import { FireUser } from '@/lib/FireAuth/settings';
import getReplyingMessageContent from '@/lib/FireChat/utils/getReplyingMessageContent';
import sanitizeHtml from '@/lib/FireChat/utils/sanitizeHtml';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

export default function FireChatChannelRoomReplyMessage<
    M extends FireMessage<T>,
    T extends FireMessageContent
>({
    replyingMessage,
    participants,
    isMine,
    setReplyingMessage,
}: {
    replyingMessage: M;
    participants: FireUser[];
    isMine: boolean;
    setReplyingMessage?: (msg?: M) => void;
}) {
    const {
        replyingMessageContent,
        replyingMessageThumbnail,
        replyingMessageUser,
    } = getReplyingMessageContent({
        replyingMessage,
        participants,
    });

    // ESC 눌렀을 때 답장 취소
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                if (replyingMessage) setReplyingMessage?.(undefined);
            }
        }
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="rounded flex justify-between md:px-0 px-1">
            <div className="flex gap-2 items-center">
                {replyingMessage[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_IMAGE && (
                    <Image
                        className="w-8 h-8 text-muted-foreground"
                        src={replyingMessageThumbnail}
                        alt={FIRECHAT_LOCALE.IMAGE}
                        width={32}
                        height={32}
                    />
                )}
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">
                        {FIRECHAT_LOCALE.REPLYING_TO(
                            isMine
                                ? FIRECHAT_LOCALE.ME
                                : replyingMessageUser?.name ||
                                      replyingMessage.userId ||
                                      FIRECHAT_LOCALE.UNKNOWN
                        )}
                    </p>
                    <div
                        className="text-sm text-foreground line-clamp-1 whitespace-pre-line break-all"
                        dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(
                                replyingMessageContent.replace('\\n', '\n')
                            ),
                        }}
                    />
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="text-foreground"
                onClick={() => {
                    if (replyingMessage) setReplyingMessage?.(undefined);
                }}
            >
                <X />
            </Button>
        </div>
    );
}
