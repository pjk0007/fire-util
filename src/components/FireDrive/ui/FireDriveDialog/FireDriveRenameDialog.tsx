import { useFireDrive } from '../../contexts';
import {
    FIRE_DRIVE_LOCALE,
    FireDriveItem,
    DRIVE_NAME_FIELD,
    DRIVE_TYPE_FILE,
} from '../../settings';
import { renameItem } from '../../api';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

interface FireDriveRenameDialogProps {
    item: FireDriveItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// 파일명에서 확장자 분리
function splitFileName(fileName: string): { baseName: string; extension: string } {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === 0) {
        return { baseName: fileName, extension: '' };
    }
    return {
        baseName: fileName.slice(0, lastDotIndex),
        extension: fileName.slice(lastDotIndex), // .png 형태로 포함
    };
}

export default function FireDriveRenameDialog({
    item,
    open,
    onOpenChange,
}: FireDriveRenameDialogProps) {
    const { channelId } = useFireDrive();
    const isFile = item.type === DRIVE_TYPE_FILE;

    // 파일인 경우 확장자 분리
    const { baseName: originalBaseName, extension } = useMemo(
        () => (isFile ? splitFileName(item[DRIVE_NAME_FIELD]) : { baseName: item[DRIVE_NAME_FIELD], extension: '' }),
        [item, isFile]
    );

    const [baseName, setBaseName] = useState(originalBaseName);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            const { baseName: newBaseName } = isFile
                ? splitFileName(item[DRIVE_NAME_FIELD])
                : { baseName: item[DRIVE_NAME_FIELD] };
            setBaseName(newBaseName);
        }
    }, [open, item, isFile]);

    // 최종 파일명 (baseName + extension)
    const fullName = isFile ? baseName.trim() + extension : baseName.trim();

    const handleRename = async () => {
        if (!channelId || !baseName.trim()) return;

        try {
            setIsLoading(true);
            await renameItem(channelId, item.id, fullName);
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to rename item:', error);
            toast.error(FIRE_DRIVE_LOCALE.ERRORS.RENAME_FAILED);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading && baseName.trim()) {
            handleRename();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{FIRE_DRIVE_LOCALE.DIALOG.RENAME_TITLE}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <Label htmlFor="item-name">
                        {FIRE_DRIVE_LOCALE.DIALOG.RENAME_PLACEHOLDER}
                    </Label>
                    <div className="flex items-center gap-1 mt-2">
                        <Input
                            id="item-name"
                            value={baseName}
                            onChange={(e) => setBaseName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            onFocus={(e) => e.target.select()}
                        />
                        {isFile && extension && (
                            <span className="text-sm text-muted-foreground shrink-0">
                                {extension}
                            </span>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        {FIRE_DRIVE_LOCALE.BUTTONS.CANCEL}
                    </Button>
                    <Button
                        onClick={handleRename}
                        disabled={isLoading || !baseName.trim()}
                    >
                        {FIRE_DRIVE_LOCALE.BUTTONS.SAVE}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
