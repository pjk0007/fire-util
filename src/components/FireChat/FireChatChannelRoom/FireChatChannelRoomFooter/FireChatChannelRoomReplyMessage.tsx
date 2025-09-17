import { Button } from '@/components/ui/button';
import {
    FcMessage,
    FcMessageContent,
    FcUser,
    LOCALE,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_IMAGE,
} from '@/lib/FireChat/settings';
import getReplyingMessageContent from '@/lib/FireChat/utils/getReplyingMessageContent';
import sanitizeHtml from '@/lib/FireChat/utils/sanitizeHtml';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

export default function FireChatChannelRoomReplyMessage({
    replyingMessage,
    participants,
    isMine,
    selectReplyingMessage,
}: {
    replyingMessage: FcMessage<FcMessageContent>;
    participants: FcUser[];
    isMine: boolean;
    selectReplyingMessage?: (id?: string) => void;
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
                selectReplyingMessage?.(undefined);
            }
        }
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [selectReplyingMessage]);

    return (
        <div className="md:p-2 mx-4 mb-2 rounded md:border-b flex justify-between">
            <div className="flex gap-2 items-center">
                {replyingMessage[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_IMAGE && (
                    <Image
                        className="w-8 h-8 text-primary"
                        src={replyingMessageThumbnail}
                        alt={LOCALE.IMAGE}
                        width={32}
                        height={32}
                    />
                )}
                <div className="flex flex-col gap-1">
                    <p className="text-sm text-primary font-bold">
                        {LOCALE.REPLYING_TO(
                            isMine
                                ? LOCALE.ME
                                : replyingMessageUser?.name ||
                                      replyingMessage.userId ||
                                      LOCALE.UNKNOWN
                        )}
                    </p>
                    <div
                        className="text-sm text-foreground/80 line-clamp-2 whitespace-pre-line break-all"
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
                onClick={() => {
                    selectReplyingMessage?.(undefined);
                }}
            >
                <X />
            </Button>
        </div>
    );
}
