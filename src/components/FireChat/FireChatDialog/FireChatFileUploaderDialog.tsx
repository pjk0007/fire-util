import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { LOCALE } from '@/lib/FireChat/settings';
import { formatSizeString } from '@/lib/FireChat/utils/sizeformat';
import truncateFilenameMiddle from '@/lib/FireChat/utils/truncateFilenameMiddle';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal, MoreVertical } from 'lucide-react';

export default function FireChatFileUploaderDialog({
    files,
    setFiles,
    onClickUpload,
}: {
    files: File[];
    setFiles: (files: File[]) => void;
    onClickUpload: () => void;
}) {
    const isMobile = useIsMobile();
    return (
        <Dialog
            open={files && files.length > 0}
            onOpenChange={(open) => {
                if (!open) setFiles([]);
            }}
        >
            <DialogContent className="p-4">
                <DialogHeader className="flex-row">
                    <DialogTitle>{LOCALE.FOOTER.UPLOAD_FILES}</DialogTitle>

                    <DialogDescription>
                        ({files.length} {files.length > 1 ? 'files' : 'file'})
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="md:max-h-80 max-h-60 mb-4">
                    <div className="h-full flex flex-col gap-2 pr-3">
                        {files.map((file, index) => (
                            <Card
                                key={index}
                                className="p-2 border rounded-md gap-2 flex-row items-center"
                            >
                                {file.type.startsWith('image/') ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        className="w-12 h-12 object-cover rounded-md"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-sm font-bold">
                                        {file.name
                                            .split('.')
                                            .pop()
                                            ?.toUpperCase()}
                                    </div>
                                )}
                                <div className="flex flex-col gap-1">
                                    <div className="font-medium line-clamp-1">
                                        {truncateFilenameMiddle(
                                            file.name,
                                            isMobile ? 20 : 38
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {formatSizeString(file.size)}
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant={'ghost'}
                                            size={'icon'}
                                            className="ml-auto"
                                        >
                                            <MoreVertical className="text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                const newFiles = [...files];
                                                newFiles.splice(index, 1);
                                                setFiles(newFiles);
                                            }}
                                        >
                                            {LOCALE.FOOTER.REMOVE_FILE}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">
                            {LOCALE.CANCEL}
                        </Button>
                    </DialogClose>
                    <Button onClick={onClickUpload}>
                        {LOCALE.FOOTER.UPLOAD_FILES}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
