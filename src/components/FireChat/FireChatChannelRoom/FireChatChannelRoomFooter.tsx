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
import { cn } from '@/lib/utils';

import { CornerDownRight, Paperclip, X } from 'lucide-react';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';

const MemoTextarea = <M extends FcMessage<T>, T extends FcMessageContent>({
    message,
    setMessage,
    sendTextMessage,
    selectReplyingMessage,
    replyingMessage,
}: {
    message: string;
    setMessage: (msg: string) => void;
    sendTextMessage: (msg: string, replyingMessage?: M) => Promise<void>;
    selectReplyingMessage?: (id?: string) => void;
    replyingMessage?: M;
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
    } = useFireChat();
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage('');
    }, [selectedChannel?.channel]);

    // 답장
    const replyingMessageUser = selectedChannel?.participants.find(
        (p) => p.id === replyingMessage?.userId
    );
    const replyingToMe = replyingMessage?.userId === me?.id;
    let replyingMessageContent = '';
    let replyingMessageThumbnail = '';
    if (replyingMessage?.[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_IMAGE) {
        const imageMessage = replyingMessage as FcMessage<FcMessageImage>;
        replyingMessageContent = LOCALE.IMAGE;
        replyingMessageThumbnail =
            imageMessage[MESSAGE_CONTENTS_FIELD][0][
                MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD
            ] ?? '';
    } else if (replyingMessage?.[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_FILE) {
        const fileMessage = replyingMessage as FcMessage<FcMessageFile>;
        replyingMessageContent =
            fileMessage[MESSAGE_CONTENTS_FIELD][0][
                MESSAGE_CONTENT_FILE_NAME_FIELD
            ] ?? LOCALE.FILE;
    } else if (replyingMessage?.[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_TEXT) {
        const textMessage = replyingMessage as FcMessage<FcMessageText>;
        replyingMessageContent =
            textMessage[MESSAGE_CONTENTS_FIELD][0]?.text ||
            (textMessage[MESSAGE_CONTENTS_FIELD][0]?.text === ''
                ? '""'
                : LOCALE.UNKNOWN);
    }
    console.log(replyingMessage);

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
                        <div className="flex flex-col ">
                            <div className="text-sm text-primary font-bold">
                                {LOCALE.FOOTER.REPLYING_TO(
                                    replyingToMe
                                        ? LOCALE.ME
                                        : replyingMessageUser?.name ||
                                              replyingMessage.userId ||
                                              LOCALE.UNKNOWN
                                )}
                            </div>
                            <div className="text-sm text-foreground/80">
                                {replyingMessageContent}
                            </div>
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
