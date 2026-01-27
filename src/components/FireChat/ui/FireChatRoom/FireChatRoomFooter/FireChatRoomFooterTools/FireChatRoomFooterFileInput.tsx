import { FIRE_CHAT_LOCALE } from '@/components/FireChat/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Paperclip } from 'lucide-react';

export default function FireChatChannelRoomFooterFileInput({
    onSelectFiles,
}: {
    onSelectFiles: (files: File[]) => void;
}) {
    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={'ghost'}
                        className={cn('rounded-lg')}
                        size={'icon'}
                        asChild
                    >
                        <Label
                            htmlFor="chat-file-upload"
                            className="cursor-pointer"
                        >
                            <Paperclip className="text-foreground" />
                        </Label>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {FIRE_CHAT_LOCALE.FOOTER.ATTATCH_FILE}
                </TooltipContent>
            </Tooltip>
            <Input
                type="file"
                multiple
                onChange={(e) => {
                    if (e.target.files) {
                        const fileArray = Array.from(e.target.files);
                        onSelectFiles(fileArray);
                        // setFiles((prevFiles) => [...prevFiles, ...fileArray]);
                    }
                }}
                value={''}
                className="hidden"
                id="chat-file-upload"
            />
        </>
    );
}
