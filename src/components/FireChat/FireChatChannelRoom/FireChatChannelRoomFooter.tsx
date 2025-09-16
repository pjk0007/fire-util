import FireChatFileUploaderDialog from '@/components/FireChat/FireChatDialog/FireChatFileUploaderDialog';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LOCALE } from '@/lib/FireChat/settings';

import { Paperclip } from 'lucide-react';
import { memo, useState } from 'react';

const MemoTextarea = memo(
    ({
        message,
        setMessage,
        sendTextMessage,
    }: {
        message: string;
        setMessage: (msg: string) => void;
        sendTextMessage: (msg: string) => Promise<void>;
    }) => (
        <textarea
            className="resize-none focus:outline-none px-4  border-none h-20 text-sm  w-full"
            placeholder={LOCALE.FOOTER.INPUT_PLACEHOLDER}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    if ((e.nativeEvent as any).isComposing) return; // 한글 조합 중이면 무시
                    setMessage('');
                    e.preventDefault();
                    sendTextMessage(message);
                }
            }}
        />
    )
);

export default function FireChatChannelRoomFooter() {
    const { sendTextMessage } = useFireChat();
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    return (
        <div className="border-t border-muted w-full py-2">
            <FireChatFileUploaderDialog files={files} setFiles={setFiles} />
            <MemoTextarea
                message={message}
                setMessage={setMessage}
                sendTextMessage={sendTextMessage}
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
                    className="hidden"
                    id="file-upload"
                />
                <Button onClick={() => sendTextMessage(message)}>
                    {LOCALE.FOOTER.SEND}
                </Button>
            </div>
        </div>
    );
}
