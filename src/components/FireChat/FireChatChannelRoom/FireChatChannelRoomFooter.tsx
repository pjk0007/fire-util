import FireChatChannelRoomFooterFileInput from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomFooter/FireChatChannelRoomFooterFileInput';
import FireChatChannelRoomFooterTextarea from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomFooter/FireChatChannelRoomFooterTextarea';
import FireChatChannelRoomFooterTextareaMobile from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomFooter/FireChatChannelRoomFooterTextareaMobile';
import FireChatChannelRoomReplyMessage from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomFooter/FireChatChannelRoomReplyMessage';
import FireChatFileUploaderDialog from '@/components/FireChat/FireChatDialog/FireChatFileUploaderDialog';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { Button } from '@/components/ui/button';
import { LOCALE } from '@/lib/FireChat/settings';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

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
                <FireChatChannelRoomReplyMessage
                    replyingMessage={replyingMessage}
                    participants={selectedChannel?.participants || []}
                    isMine={isMine}
                    selectReplyingMessage={selectReplyingMessage}
                />
            )}
            <FireChatChannelRoomFooterTextarea
                message={message}
                setMessage={setMessage}
                sendTextMessage={sendTextMessage}
                selectReplyingMessage={selectReplyingMessage}
                replyingMessage={replyingMessage}
                scrollToBottom={scrollToBottom}
            />

            <div className="pl-2 pr-4 flex justify-between items-center">
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
                    sendTextMessage={sendTextMessage}
                    selectReplyingMessage={selectReplyingMessage}
                    replyingMessage={replyingMessage}
                    scrollToBottom={scrollToBottom}
                />
                <Button
                    disabled={!message.trim()}
                    className="md:rounded-md rounded-full w-9 h-9 md:w-fit"
                    onClick={() => {
                        scrollToBottom(false, {
                            immediate: true,
                        });
                        sendTextMessage(message, replyingMessage);
                        setMessage('');
                        selectReplyingMessage?.(undefined);
                    }}
                >
                    <p className="md:block hidden">{LOCALE.FOOTER.SEND}</p>
                    <ArrowUp className="md:hidden block" />
                </Button>
            </div>
        </div>
    );
}
