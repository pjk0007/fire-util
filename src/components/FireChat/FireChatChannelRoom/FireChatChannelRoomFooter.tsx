import { useFireChatChannel } from '@/components/provider/FireChatChannelProvider';
import FireChatChannelRoomFooterFileInput from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomFooter/FireChatChannelRoomFooterFileInput';
import FireChatChannelRoomFooterTextarea from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomFooter/FireChatChannelRoomFooterTextarea';
import FireChatChannelRoomFooterTextareaMobile from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomFooter/FireChatChannelRoomFooterTextareaMobile';
import FireChatChannelRoomReplyMessage from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomFooter/FireChatChannelRoomReplyMessage';
import FireChatFileUploaderDialog from '@/components/FireChat/FireChatDialog/FireChatFileUploaderDialog';
import { useFireChat } from '@/components/provider/FireChatProvider';
import { useAuth } from '@/components/provider/AuthProvider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { sendTextMessage } from '@/lib/FireChat/api/sendMessage';
import useFireChatChannelRoomFooter from '@/lib/FireChat/hooks/useFireChatChannelRoomFooter';
import {
    CHANNEL_ID_FIELD,
    LOCALE,
    USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { ArrowUp } from 'lucide-react';

export default function FireChatChannelRoomFooter() {
    const { user: me } = useAuth();

    const {
        channel,
        participants,
        onSendingFiles,
        replyingMessage,
        setReplyingMessage,
    } = useFireChatChannel();
    const { message, setMessage, files, setFiles } =
        useFireChatChannelRoomFooter(channel?.[CHANNEL_ID_FIELD]);

    const isMine = replyingMessage?.userId === me?.id;

    if (!channel) {
        return null;
    }

    return (
        <div className="w-full  bg-white md:px-5 md:pb-5 md:pt-0 border-t md:border-none p-2">
            <FireChatFileUploaderDialog
                files={files}
                setFiles={setFiles}
                onClickUpload={() => {
                    onSendingFiles(files);
                    setFiles([]);
                }}
            />
            <div className="md:p-3 md:border border-input rounded-lg flex flex-col gap-2 md:gap-0">
                {replyingMessage && (
                    <>
                        <FireChatChannelRoomReplyMessage
                            replyingMessage={replyingMessage}
                            participants={participants || []}
                            isMine={isMine}
                            setReplyingMessage={setReplyingMessage}
                        />
                        <Separator className="md:block hidden my-2.5" />
                    </>
                )}
                <FireChatChannelRoomFooterTextarea
                    message={message}
                    setMessage={setMessage}
                    // sendTextMessage={sendTextMessage}
                    onSend={() => {
                        sendTextMessage(
                            channel[CHANNEL_ID_FIELD],
                            me?.[USER_ID_FIELD] || '',
                            message,
                            replyingMessage
                        );
                        setMessage('');
                        if (replyingMessage) setReplyingMessage?.(undefined);
                    }}
                    replyingMessage={replyingMessage}
                />

                <div className="flex justify-between items-center border rounded-lg md:border-none p-2 md:p-0">
                    <FireChatChannelRoomFooterFileInput
                        onSelectFiles={(selectedFiles) => {
                            setFiles((prevFiles) => [
                                ...prevFiles,
                                ...selectedFiles,
                            ]);
                        }}
                    />
                    <FireChatChannelRoomFooterTextareaMobile
                        message={message}
                        setMessage={setMessage}
                        onSend={() => {
                            sendTextMessage(
                                channel[CHANNEL_ID_FIELD],
                                me?.[USER_ID_FIELD] || '',
                                message,
                                replyingMessage
                            );
                            setMessage('');
                            if (replyingMessage)
                                setReplyingMessage?.(undefined);
                        }}
                        replyingMessage={replyingMessage}
                    />
                    <Button
                        disabled={!message.trim()}
                        variant={'outline'}
                        className="rounded-full h-9 w-9 p-0"
                        size={'icon'}
                        onClick={() => {
                            sendTextMessage(
                                channel[CHANNEL_ID_FIELD],
                                me?.[USER_ID_FIELD] || '',
                                message,
                                replyingMessage
                            );
                            setMessage('');
                            if (replyingMessage)setReplyingMessage?.(undefined);
                        }}
                    >
                        <ArrowUp />
                    </Button>
                </div>
            </div>
        </div>
    );
}
