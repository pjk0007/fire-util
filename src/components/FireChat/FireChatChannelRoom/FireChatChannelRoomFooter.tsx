import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import useFireChatSender from '@/lib/FireChat/hooks/useFireChatSender';
import { LOCALE } from '@/lib/FireChat/settings';
import { Paperclip } from 'lucide-react';

export default function FireChatChannelRoomFooter() {
    const { message, setMessage, sendTextMessage } = useFireChatSender();
    return (
        <div className="border-t border-muted w-full py-2">
            <textarea
                className="resize-none focus:outline-none px-4  border-none h-20 text-sm  w-full"
                placeholder={LOCALE.FOOTER.INPUT_PLACEHOLDER}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendTextMessage();
                    }
                }}
            />

            <div className="pl-2 pr-4 flex justify-between items-center">
                <Button variant="ghost" size={'icon'}>
                    <Paperclip className="text-muted-foreground" />
                </Button>
                <Button onClick={sendTextMessage}>{LOCALE.FOOTER.SEND}</Button>
            </div>
        </div>
    );
}
