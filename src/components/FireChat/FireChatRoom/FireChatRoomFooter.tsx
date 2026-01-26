import { useFireChat } from '@/components/FireProvider/FireChatProvider';
import FireChatRoomFooterFileInput from '@/components/FireChat/FireChatRoom/FireChatRoomFooter/FireChatRoomFooterFileInput';
import FireChatRoomFooterTextarea from '@/components/FireChat/FireChatRoom/FireChatRoomFooter/FireChatRoomFooterTextarea';
import FireChatRoomFooterTextareaMobile from '@/components/FireChat/FireChatRoom/FireChatRoomFooter/FireChatRoomFooterTextareaMobile';
import FireChatRoomReplyMessage from '@/components/FireChat/FireChatRoom/FireChatRoomFooter/FireChatRoomReplyMessage';
import FireChatRoomFooterUploadDialog from '@/components/FireChat/FireChatRoom/FireChatRoomFooter/FireChatRoomFooterUploadDialog';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { sendTextMessage } from '@/lib/FireChat/api/sendMessage';
import useFireChatChannelRoomFooter from '@/lib/FireChat/hooks/useFireChatChannelRoomFooter';
import {
    FireMessage,
    FireMessageContent,
    FIRE_CHAT_LOCALE,
} from '@/lib/FireChat/settings';
import { FireChannel } from '@/lib/FireChannel/settings';
import { FireUser } from '@/lib/FireAuth/settings';
import { USER_ID_FIELD } from '@/lib/FireAuth/settings';
import { ArrowUp } from 'lucide-react';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import useFireChannelInfo from '@/lib/FireChannel/hook/useFireChannelInfo';
import { useState } from 'react';
import FireChatRoomFooterLinkInput from '@/components/FireChat/FireChatRoom/FireChatRoomFooter/FireChatRoomFooterTools/FireChatRoomFooterLinkInput';
import FireChatRoomFooterMeetLink from '@/components/FireChat/FireChatRoom/FireChatRoomFooter/FireChatRoomFooterTools/FireChatRoomFooterMeetLink';
import FireChatRoomFooterTemplate from '@/components/FireChat/FireChatRoom/FireChatRoomFooter/FireChatRoomFooterTools/FireChatRoomFooterTemplate';

export default function FireChatChannelRoomFooter<
    C extends FireChannel<M, T>,
    U extends FireUser,
    M extends FireMessage<T>,
    T extends FireMessageContent
>({ disabled = false }: { disabled?: boolean }) {
    const { user: me } = useFireAuth();
    const [isDragOver, setIsDragOver] = useState(false);

    const { selectedChannelId } = useFireChannel();
    const { participants } = useFireChannelInfo<C, M, T, U>({
        channelId: selectedChannelId,
    });
    const { onSendingFiles, replyingMessage, setReplyingMessage } =
        useFireChat();
    const { message, setMessage, files, setFiles } =
        useFireChatChannelRoomFooter(selectedChannelId);

    const isMine = replyingMessage?.userId === me?.id;

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const { files } = event.dataTransfer;

        const taskTitle = event.dataTransfer.getData('title');
        if (taskTitle) {
            setMessage((prev) => (prev ? `${prev}\n${taskTitle}` : taskTitle));
        }

        setFiles(Array.from(files));
        setIsDragOver(false);
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);
    };

    if (!selectedChannelId) {
        return null;
    }

    return (
        <div
            className="w-full relative bg-muted/40 md:px-5 md:pb-5 md:pt-0 border-t md:border-none p-2"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            {isDragOver && (
                <div className="absolute top-0 left-0 w-full h-full bg-muted z-50 flex items-center justify-center">
                    {FIRE_CHAT_LOCALE.FOOTER.DRAG_DROP_TO_UPLOAD}
                </div>
            )}
            <FireChatRoomFooterUploadDialog
                files={files}
                setFiles={setFiles}
                onClickUpload={() => {
                    onSendingFiles(files);
                    setFiles([]);
                }}
            />
            <div className={cn(
                "md:p-3 md:border border-input rounded-lg flex flex-col gap-2 md:gap-0",
                disabled ? "bg-muted" : "bg-background"
            )}>
                {replyingMessage && (
                    <>
                        <FireChatRoomReplyMessage
                            replyingMessage={replyingMessage}
                            participants={participants || []}
                            isMine={isMine}
                            setReplyingMessage={setReplyingMessage}
                        />
                        <Separator className="md:block hidden my-2.5" />
                    </>
                )}
                <FireChatRoomFooterTextarea
                    message={message}
                    setMessage={setMessage}
                    // sendTextMessage={sendTextMessage}
                    onSend={() => {
                        sendTextMessage(
                            selectedChannelId,
                            me?.[USER_ID_FIELD] || '',
                            message,
                            replyingMessage
                        );
                        setMessage('');
                        if (replyingMessage) setReplyingMessage?.(undefined);
                    }}
                    replyingMessage={replyingMessage}
                    setFiles={setFiles}
                    disabled={disabled}
                />

                <div className="flex justify-between items-center border rounded-lg md:border-none p-2 md:p-0">
                    <div className="flex" style={disabled ? { pointerEvents: 'none', opacity: 0.5 } : undefined}>
                        <FireChatRoomFooterFileInput
                            onSelectFiles={(selectedFiles) => {
                                setFiles((prevFiles) => [
                                    ...prevFiles,
                                    ...selectedFiles,
                                ]);
                            }}
                        />
                        <FireChatRoomFooterLinkInput />
                        <FireChatRoomFooterMeetLink />
                        <FireChatRoomFooterTemplate setMessage={setMessage}/>
                    </div>
                    <FireChatRoomFooterTextareaMobile
                        message={message}
                        setMessage={setMessage}
                        onSend={() => {
                            sendTextMessage(
                                selectedChannelId,
                                me?.[USER_ID_FIELD] || '',
                                message,
                                replyingMessage
                            );
                            setMessage('');
                            if (replyingMessage)
                                setReplyingMessage?.(undefined);
                        }}
                        replyingMessage={replyingMessage}
                        disabled={disabled}
                    />
                    <Button
                        disabled={disabled || !message.trim()}
                        variant={'outline'}
                        className="rounded-full h-9 w-9 p-0"
                        size={'icon'}
                        onClick={() => {
                            sendTextMessage(
                                selectedChannelId,
                                me?.[USER_ID_FIELD] || '',
                                message,
                                replyingMessage
                            );
                            setMessage('');
                            if (replyingMessage)
                                setReplyingMessage?.(undefined);
                        }}
                    >
                        <ArrowUp />
                    </Button>
                </div>
            </div>
        </div>
    );
}
