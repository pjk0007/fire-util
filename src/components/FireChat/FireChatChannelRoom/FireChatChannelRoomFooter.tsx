import FireChatFileUploaderDialog from '@/components/FireChat/FireChatDialog/FireChatFileUploaderDialog';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    FcMessage,
    FcMessageContent,
    FcMessageFile,
    FcMessageImage,
    FcMessageText,
    LOCALE,
    MESSAGE_CONTENT_FILE_NAME_FIELD,
    MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_FILE,
    MESSAGE_TYPE_IMAGE,
    MESSAGE_TYPE_TEXT,
} from '@/lib/FireChat/settings';
import getReplyingMessageContent from '@/lib/FireChat/utils/getReplyingMessageContent';
import sanitizeHtml from '@/lib/FireChat/utils/sanitizeHtml';
import { cn } from '@/lib/utils';

import { CornerDownRight, Paperclip, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const MemoTextarea = <M extends FcMessage<T>, T extends FcMessageContent>({
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
        {
            afterScroll,
            immediate,
        }?: {
            afterScroll?: () => void;
            immediate?: boolean;
        }
    ) => void;
}) => (
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

export default function FireChatChannelRoomFooter() {
    const {
        selectedChannel,
        files,
        setFiles,
        sendTextMessage,
        onSendingFiles,
        replyingMessage,
        user: me,
        selectReplyingMessage,
        scrollToBottom,
    } = useFireChat();
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage('');
    }, [selectedChannel?.channel]);

    const isMine = replyingMessage?.userId === me?.id;

    // 답장
    const {
        replyingMessageContent,
        replyingMessageThumbnail,
        replyingMessageUser,
    } = getReplyingMessageContent({
        replyingMessage,
        participants: selectedChannel?.participants || [],
    });

    return (
        <div className="border-t border-muted w-full py-2">
            <FireChatFileUploaderDialog
                files={files}
                setFiles={setFiles}
                onClickUpload={() => {
                    onSendingFiles(files);
                    setFiles([]);
                }}
            />
            {replyingMessage && (
                <div className="p-2 mx-4 mb-2 rounded border-b flex justify-between">
                    <div className="flex gap-2 items-center">
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
                                className="text-sm text-foreground/80 line-clamp-2"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(
                                        replyingMessageContent.replace(
                                            '\\n',
                                            '\n'
                                        )
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
            )}
            <MemoTextarea
                message={message}
                setMessage={setMessage}
                sendTextMessage={sendTextMessage}
                selectReplyingMessage={selectReplyingMessage}
                replyingMessage={replyingMessage}
                scrollToBottom={scrollToBottom}
            />

            <div className="pl-2 pr-4 flex justify-between items-center">
                <Button variant="ghost" size={'icon'} asChild>
                    <Label htmlFor="file-upload" className="cursor-pointer">
                        <Paperclip className="text-muted-foreground" />
                    </Label>
                </Button>
                <Input
                    type="file"
                    multiple
                    onChange={(e) => {
                        if (e.target.files) {
                            const fileArray = Array.from(e.target.files);
                            setFiles((prevFiles) => [
                                ...prevFiles,
                                ...fileArray,
                            ]);
                        }
                    }}
                    value={''}
                    className="hidden"
                    id="file-upload"
                />
                <Button
                    onClick={() => {
                        scrollToBottom(false, {
                            immediate: true,
                        });
                        sendTextMessage(message, replyingMessage);
                        setMessage('');
                        selectReplyingMessage?.(undefined);
                    }}
                >
                    {LOCALE.FOOTER.SEND}
                </Button>
            </div>
        </div>
    );
}
