import {
    FireMessage,
    FireMessageContent,
    FireMessageText,
    FIRE_CHAT_LOCALE,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_IMAGE,
} from '@/lib/FireChat/settings';
import { FireUser } from '@/lib/FireAuth/settings';
import getReplyingMessageContent from '@/lib/FireChat/utils/getReplyingMessageContent';
import sanitizeHtml from '@/lib/FireChat/utils/sanitizeHtml';
import { cn } from '@/lib/utils';
import { CornerDownRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function FireChatMessageText<
    T extends FireMessageText,
    U extends FireUser
>({
    participants,
    content,
    replyingMessage,
    isMine,
}: {
    participants: U[];
    content: T;
    replyingMessage?: FireMessage<FireMessageContent> | null;
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

    return (
        <div
            className={cn(
                'flex flex-col gap-3 p-5 text-foreground rounded-md max-w-[640px] text-sm',
                {
                    'bg-muted': !isMine,
                    'bg-violet-50': isMine,
                }
            )}
        >
            {replyingMessage && (
                <Link
                    href={`${router.pathname}#message-${replyingMessage.id}`}
                    className={cn(
                        'max-w-full md:max-w-none break-all flex gap-2 items-center cursor-pointer'
                    )}
                >
                    {replyingMessage[MESSAGE_TYPE_FIELD] ===
                        MESSAGE_TYPE_IMAGE && (
                        <Image
                            className="w-8 h-8 text-primary"
                            src={replyingMessageThumbnail}
                            alt={FIRE_CHAT_LOCALE.IMAGE}
                            width={32}
                            height={32}
                        />
                    )}
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-muted-foreground">
                            {FIRE_CHAT_LOCALE.REPLYING_TO(
                                isMine
                                    ? FIRE_CHAT_LOCALE.ME
                                    : replyingMessageUser?.name ||
                                          replyingMessage.userId ||
                                          FIRE_CHAT_LOCALE.UNKNOWN
                            )}
                        </p>
                        <div
                            className="text-sm text-muted-foreground line-clamp-1"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(
                                    replyingMessageContent.replace('\\n', '\n')
                                ),
                            }}
                        />
                    </div>
                </Link>
            )}
            <div className={cn('flex gap-2.5')}>
                {replyingMessage && <CornerDownRight size={16} className='min-w-4'/>}
                <div
                    className={cn(
                        'whitespace-pre-line break-all max-w-full md:max-w-none text-foreground text-sm'
                    )}
                    dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(
                            content[MESSAGE_CONTENT_TEXT_FIELD].replace(
                                '\\n',
                                '\n'
                            )
                        ),
                    }}
                />
            </div>
        </div>
    );
}
