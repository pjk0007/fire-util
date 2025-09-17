import {
    FcMessage,
    FcMessageContent,
    FcMessageText,
    FcUser,
    LOCALE,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_IMAGE,
} from '@/lib/FireChat/settings';
import getReplyingMessageContent from '@/lib/FireChat/utils/getReplyingMessageContent';
import sanitizeHtml from '@/lib/FireChat/utils/sanitizeHtml';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function FireChatMessageText<
    T extends FcMessageText,
    U extends FcUser
>({
    participants,
    content,
    replyingMessage,
    isMine,
}: {
    participants: U[];
    content: T;
    replyingMessage?: FcMessage<FcMessageContent> | null;
    isMine: boolean;
}) {
    const {
        replyingMessageContent,
        replyingMessageThumbnail,
        replyingMessageUser,
    } = getReplyingMessageContent({
        replyingMessage,
        participants: participants,
    });
    const router = useRouter();
    console.log(router.pathname);
    
    return (
        <div
            className={cn(
                'flex flex-col py-2 px-3 text-foreground rounded-b-md ',
                {
                    'bg-white rounded-tr-md': !isMine,
                    'bg-primary-foreground  rounded-tl-md': isMine,
                }
            )}
        >
            {replyingMessage && (
                <Link
                    href={`${router.pathname}#message-${replyingMessage.id}`}
                    className={cn(
                        'pb-1 max-w-full md:max-w-none break-all border-b mb-1 flex gap-2 items-center cursor-pointer'
                    )}
                >
                    {replyingMessage[MESSAGE_TYPE_FIELD] ===
                        MESSAGE_TYPE_IMAGE && (
                        <Image
                            className="w-8 h-8 text-primary"
                            src={replyingMessageThumbnail}
                            alt={LOCALE.IMAGE}
                            width={32}
                            height={32}
                        />
                    )}
                    <div className="flex flex-col">
                        <p className="text-xs text-muted-foreground mb-1 font-bold">
                            {LOCALE.REPLYING_TO(
                                isMine
                                    ? LOCALE.ME
                                    : replyingMessageUser?.name ||
                                          replyingMessage.userId ||
                                          LOCALE.UNKNOWN
                            )}
                        </p>
                        <div
                            className="text-sm text-foreground/80 line-clamp-2"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(
                                    replyingMessageContent.replace('\\n', '\n')
                                ),
                            }}
                        />
                    </div>
                </Link>
            )}
            <div
                className={cn(
                    'whitespace-pre-line wrap-break-word max-w-full md:max-w-none'
                )}
                dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(
                        content[MESSAGE_CONTENT_TEXT_FIELD].replace('\\n', '\n')
                    ),
                }}
            />
        </div>
    );
}
