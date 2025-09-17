import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Paperclip } from 'lucide-react';

export default function FireChatChannelRoomFooterFileInput({
    onSelectFiles
}: {
    onSelectFiles: (files: File[]) => void;
}) {
    return (
        <>
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
                        onSelectFiles(fileArray);
                        // setFiles((prevFiles) => [...prevFiles, ...fileArray]);
                    }
                }}
                value={''}
                className="hidden"
                id="file-upload"
            />
        </>
    );
}
