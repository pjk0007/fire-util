import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Paperclip } from 'lucide-react';

export default function FireChatChannelRoomFooterFileInput({
    onSelectFiles,
}: {
    onSelectFiles: (files: File[]) => void;
}) {
    return (
        <>
            <Button
                variant={'ghost'}
                className={cn('rounded-full')}
                size={'icon'}
                asChild
            >
                <Label htmlFor="chat-file-upload" className="cursor-pointer">
                    <Paperclip className="text-muted-foreground" />
                </Label>
            </Button>
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
